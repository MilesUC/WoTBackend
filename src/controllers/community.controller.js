const asyncHandler = require("express-async-handler");
const Usuaria = require("../models/Usuaria");
const Community = require("../models/community");
const UsuariaCommunity = require("../models/usuariacommunity");
const { RolesAnywhere } = require("../config/awsConfig");
const Cargo = require("../models/Cargo");
const Industria = require("../models/Industria");

const { Op } = require("sequelize");

exports.create = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con nombre, descripción e id del usuario creador (en token).
    // {name, description}
    const reqInfo = req.body;
    const userId = req.cognitoUserId;

    // Se busca el usuario creador
    const user = await Usuaria.findOne({
      where: {
        id: userId,
      },
    });

    // Se verifica que exista el usuario.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se crea la comunidad.
    const community = await Community.create({
      name: reqInfo.name,
      description: reqInfo.description,
    });

    // Se crea la relación entre la comunidad y el usuario creador
    const userCommunity = await UsuariaCommunity.create({
      communityId: community.id,
      userId: userId,
    });

    res.status(201).send({
      community: community,
      userCommunity: userCommunity,
    });
  } catch (error) {
    next(error);
  }
});

exports.join = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con id del usuario (en token) e id de la comunidad
    // {communityId}
    const reqInfo = req.body;
    const userId = req.cognitoUserId;

    // Se busca el usuario
    const user = await Usuaria.findOne({
      where: {
        id: userId,
      },
    });

    // Se verifica que exista el usuario.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la comunidad
    const community = await Community.findOne({
      where: {
        id: reqInfo.communityId,
      },
    });

    // Se verifica que exista la comunidad.
    if (!community) {
      let error = new Error(`Community not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca si ya existía la relación entre la comunidad y el usuario
    // Es decir, que el usuario ya pertenezca a la comunidad
    let userCommunity = await UsuariaCommunity.findOne({
      where: {
        communityId: reqInfo.communityId,
        userId: userId,
      },
    });

    // Se verifica que NO exista previamente la relación usuario-comunidad.
    if (userCommunity) {
      let error = new Error(`User already belongs to the community.`);
      error.statusCode = 400;
      throw error;
    }

    // Se crea la relación entre la comunidad y el usuario
    userCommunity = await UsuariaCommunity.create({
      communityId: reqInfo.communityId,
      userId: userId,
    });

    res.status(200).send({
      community: community,
      userCommunity: userCommunity,
    });
  } catch (error) {
    next(error);
  }
});

exports.getMemberships = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.cognitoUserId;

    // Obtener todas las comunidades a las que el usuario pertenece

    const communityUserRows = await UsuariaCommunity.findAll({
      where: {
        userId: userId,
      },
    });

    let communitiesUserBelongsTo = [];

    await Promise.all(
      communityUserRows.map(async (row) => {
        const community = await Community.findOne({
          where: {
            id: row.communityId,
          },
          attributes: ["id", "name", "description"],
        });
        communitiesUserBelongsTo.push(community);
      })
    );

    let communitiesUserBelongsToArray = [];

    await Promise.all(
      communitiesUserBelongsTo.map(async (community) => {
        const followers = await UsuariaCommunity.findAll({
          where: {
            communityId: community.id,
          },
        });
        communitiesUserBelongsToArray.push({
          id: community.id,
          name: community.name,
          description: community.description,
          followers: followers.length,
        });
      })
    );

    res.status(200).send({
      otherCommunities: communitiesUserBelongsToArray,
    });
  } catch (error) {
    next(error);
  }
});

exports.getJoinableCommunities = asyncHandler(async (req, res, next) => {
  try {
    // Se buscan todas las comunidades

    const allCommunities = await Community.findAll({
      attributes: ["id", "name", "description"],
    });

    // Se buscan las comunidades a las que se pertenece

    const userId = req.cognitoUserId;

    const communityUserRows = await UsuariaCommunity.findAll({
      where: {
        userId: userId,
      },
    });

    let communitiesUserBelongsTo = [];

    await Promise.all(
      communityUserRows.map(async (row) => {
        const community = await Community.findOne({
          where: {
            id: row.communityId,
          },
          attributes: ["id", "name", "description"],
        });
        communitiesUserBelongsTo.push(community);
      })
    );

    // Se obtienen las comunidades a las que no se pertenece restando las anteriores

    let joinableCommunities = allCommunities.filter((itemA) => {
      return !communitiesUserBelongsTo.some((itemB) => itemB.id === itemA.id);
    });

    // Se busca numero de seguidores

    let communitiesArray = [];

    await Promise.all(
      joinableCommunities.map(async (community) => {
        const followers = await UsuariaCommunity.findAll({
          where: {
            communityId: community.id,
          },
        });
        communitiesArray.push({
          id: community.id,
          name: community.name,
          description: community.description,
          followers: followers.length,
        });
      })
    );

    res.status(200).send(communitiesArray);
  } catch (error) {
    next(error);
  }
});

exports.getOne = asyncHandler(async (req, res, next) => {
  try {
    const communityId = parseInt(req.params.communityId);
    const community = await Community.findOne({
      where: {
        id: communityId,
      },
    });

    if (!community) {
      let error = new Error("Community not found");
      error.statusCode = 404;
      throw error;
    }

    let customResponse = community;

    const followers = await UsuariaCommunity.findAll({
      where: {
        communityId: communityId,
      },
    });

    // Se verifica si el solicitante es parte de la comunidad

    let userBelongsToCommunity = false;

    if(req.cognitoUserId){
      followers.forEach((row) => {
        if (row.userId === req.cognitoUserId) {
          userBelongsToCommunity = true;
        }
      })
    }

    customResponse = {
      id: community.id,
      name: community.name,
      description: community.description,
      followers: followers.length,
      userBelongs: userBelongsToCommunity
    };

    res.status(200).send(customResponse);
  } catch (error) {
    next(error);
  }
});

// Eliminar comunidad
exports.delete = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con id de la comunidad en la url
    // Se espera, y chequea, que el usuario de la request sea el creador de la comunidad
    const reqInfo = { communityId: parseInt(req.params.communityId) };
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos
    if (!reqInfo.communityId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }

    // Se busca el usuario
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista el usuario.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la comunidad
    const community = await Community.findOne({
      where: {
        id: reqInfo.communityId,
      },
    });

    // Se verifica que exista la comunidad.
    if (!community) {
      let error = new Error(`Community not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se elimina la comunidad.
    await community.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Editar comunidad
exports.edit = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con id de la comunidad en la url y body con los parámetros
    // name y/o description, según se quieran modificar.
    // Se espera, y chequea, que el usuario de la request sea el creador de la comunidad
    const reqInfo = { communityId: parseInt(req.params.communityId) };
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos
    if (!reqInfo.communityId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }

    // Se busca el usuario
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista el usuario.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la comunidad
    const community = await Community.findOne({
      where: {
        id: reqInfo.communityId,
      },
    });

    // Se verifica que exista la comunidad.
    if (!community) {
      let error = new Error(`Community not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Editar la comunidad
    Community.update(req.body, {
      where: {
        id: community.id,
      },
    })
      .then((result) => {
        if (result[0] == 1) {
          // result[0] es la cantidad de rows cambiadas
          // La condición se cumple si se cumple que hubo una línea cambiada en la base de datos
          if (req.body.name) {
            community.name = req.body.name;
          }
          if (req.body.description) {
            community.description = req.body.description;
          }
          res.status(200).send({
            community: community,
          });
        }
      })
      .catch((error) => {
        let newError = new Error(`Error updating community: ${error}.`);
        newError.statusCode = 400;
        throw newError;
      });
  } catch (error) {
    next(error);
  }
});

// Salirse de comunidad
exports.leave = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con id de la comunidad en la url (communityId)
    // (id de usuario en token)
    // Se espera, y chequea, que el usuario de la request ya pertenezca a la comunidad (para
    // poder salirse)
    // IMPORTANTE: si el usuario creador desea salir, entonces otro usuario al azar queda como
    // owner. Si no quedan otros usuarios, se elimina la comunidad.
    const reqInfo = { communityId: parseInt(req.params.communityId) };
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos
    if (!reqInfo.communityId || !reqInfo.userId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }

    // Se busca el usuario
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista el usuario.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la comunidad
    const community = await Community.findOne({
      where: {
        id: reqInfo.communityId,
      },
    });

    // Se verifica que exista la comunidad.
    if (!community) {
      let error = new Error(`Community not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la relación entre usuario y comunidad
    const userCommunity = await UsuariaCommunity.findOne({
      where: {
        communityId: community.id,
        userId: user.id,
      },
    });

    // Se verifica que el userId pertenezca a la comunidad
    if (!userCommunity) {
      let error = new Error(`User does not belong to the community.`);
      error.statusCode = 400;
      throw error;
    }

    // Se elimina la relación entre el usuario y la comunidad.
    await userCommunity.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

exports.getUsuariasCargosIndustrias = asyncHandler(async(req, res, next) => {
  try {
    const communityId = req.params.communityId;

    const community = await Community.findOne({
      where: {
        id: communityId,
      }
    });

    // Verificar que la comunidad existe

    if (!community) {
      let error = new Error(`Community not found`);
      error.statusCode = 404;
      throw error;
    }

    // Obtener relaciones UsuariaCommunity

    const usuariaCommunityRelations = await UsuariaCommunity.findAll({
      where: {
        communityId: community.id
      }
    });

    // Buscar usuarias y agregar a un array de usuarias

    const usuariasArray = [];

    await Promise.all(
      usuariaCommunityRelations.map(async (row) => {
        const usuaria = await Usuaria.findByPk(row.userId, {
          attributes: [],
          include: [
            {
              model: Cargo,
              as: "cargo",
              attributes: ["id", "cargo"],
            },
            {
              model: Industria,
              as: "industria",
              attributes: ["id", "nombre_industria"],
            },
            {
              model: Cargo,
              as: "aditionalCargo",
              attributes: ["id", "cargo"]
            },
            {
              model: Industria,
              as: "aditionalIndustria",
              attributes: ["id", "nombre_industria"],
            }
          ]
        });

        usuariasArray.push(usuaria);
      })
    );

    res.status(200).send({
      usuarias: usuariasArray
    });
  } catch (error) {
    next(error)
  }
});

exports.findCommunitiesByName = asyncHandler(async (req, res, next) => {
    const nombre = req.body.nombre;
    
    const communities = await Community.findAll({
      where: { 
        name: { [Op.like]: `%${nombre}%` },
      },
      attributes: ["id", "name", "description"],
    });

    let communitiesArray = [];

    await Promise.all(
      communities.map(async (community) => {
        const followers = await UsuariaCommunity.findAll({
          where: {
            communityId: community.id,
          },
        });
        communitiesArray.push({
          id: community.id,
          name: community.name,
          description: community.description,
          followers: followers.length,
        });
      })
    );
    return res.status(200).send(communitiesArray);
  });
