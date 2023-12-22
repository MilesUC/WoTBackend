const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const validateCorrectUser = require("../utils/validateCorrectUser");
const bcrypt = require("bcrypt");

// controllers/UsuariaController.js
const Usuaria = require("../models/Usuaria");
const Universidad = require("../models/Universidad");
const Cargo = require("../models/Cargo");
const Empresa = require("../models/Empresa");
const Industria = require("../models/Industria");
const AniosExperiencia = require("../models/AniosExperiencia");
const FormularioPersonalidad = require("../models/FormularioPersonalidad");
const Region = require("../models/Region");
const PaisDomicilio = require("../models/PaisDomicilio");
const PosibilidadCambiarseRegion = require("../models/PosibilidadCambiarseRegion");
const Modalidad = require("../models/Modalidad");
const Jornada = require("../models/Jornada");
const ConocioWot = require("../models/ConocioWot");
const Rol = require("../models/Rol");
const UsuariasIdioma = require("../models/UsuariasIdioma");
const UsuariasAreasExperiencia = require("../models/UsuariasAreasExperiencia");
const UsuariasDisponibilidad = require("../models/UsuariasDisponibilidad");
const UsuariasCompetencia = require("../models/UsuariasCompetencia");
const UsuariasIndustria = require("../models/UsuariasIndustria");
const Idioma = require("../models/Idioma");
const Disponibilidad = require("../models/Disponibilidad");
const Competencia = require("../models/Competencia");
const Area = require("../models/Area");
const UsuariasProfesion = require("../models/UsuariasProfesion");
const Profesion = require("../models/Profesion");
const ContactosVerificacion = require("../models/ContactosVerificacion");
const Curriculum = require("../models/curriculum");
const Match = require("../models/Match");

const aws = require("../config/awsConfig");

const s3 = new aws.S3();

const {
  initiateAuth,
  adminSetPassword,
  adminDeleteUser,
  confirmForgotPassword,
  forgotPassword,
  adminCreateUser,
  refreshAccessToken,
} = require("../utils/cognitoUtils");

const getUser = async (req, res, next, userId) => {
  const { query } = req;
  console.log("query", query);

  const where = {};
  if (userId !== null) {
    where.id = userId;
  }

  console.log("where", where);

  const idiomas = req.query.idioma;
  const idiomaArray = idiomas ? idiomas.split(",") : [];

  const disponibilidad = req.query.disponibilidad;
  const disponibilidadArray = disponibilidad ? disponibilidad.split(",") : [];

  const competencia = req.query.competencia;
  const competenciaArray = competencia ? competenciaArray.split(",") : [];

  const industria = req.query.industria;
  const industriaArray = industria ? industriaArray.split(",") : [];

  const area = req.query.area;
  const areaArray = area ? areaArray.split(",") : [];

  const profesion = req.query.profesion;
  const profesionArray = profesion ? profesionArray.split(",") : [];

  // Especificamos los atributos de usuaria que queremos devolver.
  const attributes = [
    "id",
    "rut",
    "nombre",
    "apellido",
    "celular",
    "mail",
    "postgrado",
    "universidad",
    "empresa_actual",
    "empresa_adicional",
    "experienciaDirectorios",
    "altaDireccion",
    "intereses",
    "brief",
    "redesSociales",
    "factor",
    "nombrePuebloOriginario",
    "disposicion_viajar",
    "declaracion",
    "universidad",
    "empresa_actual",
    "empresa_adicional",
  ];

  let includeModels = [
    {
      model: Cargo,
      as: "cargo",
    },
    {
      model: Industria,
      as: "industria",
    },
    {
      model: Cargo,
      as: "aditionalCargo",
    },
    {
      model: Industria,
      as: "aditionalIndustria",
    },
    {
      model: AniosExperiencia,
      as: "aniosExperiencia",
    },
    {
      model: FormularioPersonalidad,
      as: "personalidad",
    },
    {
      model: Region,
      as: "regionCompromiso",
    },
    {
      model: PaisDomicilio,
      as: "paisDomicilio",
    },
    {
      model: Region,
      as: "regionActualDomicilio",
    },
    {
      model: PosibilidadCambiarseRegion,
      as: "posibilidadCambiarseRegion",
    },
    {
      model: Modalidad,
      as: "tipoModalidad",
    },
    {
      model: Jornada,
      as: "tipoJornada",
    },
    {
      model: ConocioWot,
      as: "conocioWOT",
    },
    {
      model: Rol,
      as: "rol",
    },
  ];

  // Add Idioma model to the includeModels array
  includeModels.push({
    model: Idioma,
    required: idiomaArray.length > 0, // Only set to required if there are idiomas
    where:
      idiomaArray.length > 0 ? { nombre: { [Op.in]: idiomaArray } } : undefined,
    through: { attributes: [] },
    as: "idiomas",
    attributes: ["id", "nombre"],
  });

  // Add Disponibilidad model to the includeModels array
  includeModels.push({
    model: Disponibilidad,
    required: disponibilidadArray.length > 0, // Only set to required if there are idiomas
    where:
      disponibilidadArray.length > 0
        ? { disponibilidad: { [Op.in]: disponibilidadArray } }
        : undefined,
    through: { attributes: [] },
    as: "disponibilidad",
    attributes: ["id", "disponibilidad"],
  });

  // Add Competencia model to the includeModels array
  includeModels.push({
    model: Competencia,
    required: competenciaArray.length > 0, // Only set to required if there are idiomas
    where:
      competenciaArray.length > 0
        ? { competencia: { [Op.in]: competenciaArray } }
        : undefined,
    through: { attributes: [] },
    as: "competencia",
    attributes: ["id", "competencia"],
  });

  // Add Industria model to the includeModels array
  includeModels.push({
    model: Industria,
    required: industriaArray.length > 0, // Only set to required if there are idiomas
    where:
      industriaArray.length > 0
        ? { industria: { [Op.in]: industriaArray } }
        : undefined,
    through: { attributes: [] },
    as: "industrias",
    attributes: ["id", "nombre_industria"],
  });

  // Add Area model to the includeModels array
  includeModels.push({
    model: Area,
    required: areaArray.length > 0, // Only set to required if there are areas
    where: areaArray.length > 0 ? { area: { [Op.in]: areaArray } } : undefined,
    through: { attributes: [] },
    as: "areas",
    attributes: ["id", "nombre"],
  });

  // Add UsuariasProfesion model to the includeModels array
  includeModels.push({
    model: Profesion,
    required: profesionArray.length > 0, // Only set to required if there are idiomas
    where:
      profesionArray.length > 0
        ? { area: { [Op.in]: profesionArray } }
        : undefined,
    through: { attributes: [] },
    as: "profesion",
    attributes: ["id", "nombre"],
  });

  includeModels.push({
    model: ContactosVerificacion,
    as: 'contactos_verificacion',
    attributes: ["nombre", "email", "telefono"],
  });

  const params = {
    where,
    attributes,
    include: includeModels,
  }

  return params;
};

exports.getAll = asyncHandler(async (req, res, next) => {
  try {
    const params = await getUser(req, res, next, null);

    const usuarias = await Usuaria.findAll(params);

    res.status(200).json(usuarias);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  try {
    const params = await getUser(req, res, next, req.cognitoUserId);
    const usuaria = await Usuaria.findOne(params);

    if (!usuaria) {
      let error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(usuaria);
  } catch (error) {
    next(error);
  }
});

exports.getOne = asyncHandler(async (req, res, next) => {
  try {
    const params = await getUser(req, res, next, req.params.userId);
    const usuaria = await Usuaria.findOne(params);

    if (!usuaria) {
      let error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(usuaria);
  } catch (error) {
    next(error);
  }
});

exports.deleteUsuaria = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.cognitoUserId;
    // Se busca el usuario por su id
    const user = await Usuaria.findByPk(userId);
    
    // Status 404 si no se encuentra un usuario con el id solicitada
    if (!user) {
      let error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    
    await adminDeleteUser(user.mail);
    // Se buscan y destruyen relaciones creadas con controlador auth

    const usuariaAreaRelations = await UsuariasAreasExperiencia.findAll({
      where: { id_usuaria: user.id },
    });
    await Promise.all(
      usuariaAreaRelations.map(async (row) => {
        await row.destroy();
      })
    );

    const usuariaIndustriaRelations = await UsuariasIndustria.findAll({
      where: { id_usuaria: user.id },
    });
    await Promise.all(
      usuariaIndustriaRelations.map(async (row) => {
        await row.destroy();
      })
    );

    const usuariaContactosVerificacionRelations = await ContactosVerificacion.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        usuariaContactosVerificacionRelations.map(async (row) => {
          await row.destroy();
        })
      );

    const usuariaMatches = await Match.findAll({
      where: {
        id_usuaria: user.id,
      },
    });
    await Promise.all(
      usuariaMatches.map(async (row) => {
        await row.destroy();
      })
    );

    const usuariaCv = await Curriculum.findOne({
      where: {
        usuariaId: user.id,
      }
    });

    if (usuariaCv) {
      const urlParts = new URL(usuariaCv.link);
      const s3ObjectKey = urlParts.pathname.substring(1);

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3ObjectKey,
      };

      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error('Error deleting s3 object:', err);
        }
      });
    }

    // Respuesta exitosa con status 200

    await user.destroy();
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  try {
    const resetInfo = req.body;
    let user = await Usuaria.findByPk(req.cognitoUserId);

    const initiateAuthResponse = await initiateAuth(user.mail, resetInfo.oldPassword);

    // Se actualiza la clave en Cognito
    // Mismo método que en auth.signup
    await adminSetPassword(user.mail, resetInfo.newPassword);

    res.status(200).send();
  } catch (error) {
    if (error.message === "Incorrect username or password."){
      // El username es el mail
      // No puede estar mal el username porque se comprueba antes que este exista -> linea 218
      error.message = "Incorrect current password."
    }
    next(error);
  }
});

exports.updateUsuaria = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      lastName,
      // Por ahora no actualizar mail, hay que ver primero como
      // actualizarlo también en Cognito
      // mail,
      rut,
      celular,
      universidad,
      postgrado,
      id_cargo,
      empresa_actual,
      id_industria_actual,
      id_industria_adicional,
      id_cargo_adicional,
      empresa_adicional,
      id_anios_experiencia,
      experienciaDirectorios,
      altaDireccion,
      intereses,
      brief,
      redesSociales,
      id_personalidad,
      factor,
      nombrePuebloOriginario,
      id_region_con_compromiso,
      id_pais_domicilio,
      region_domicilio,
      id_posibilidad_cambiarse_region,
      disposicion_viajar,
      id_modalidad,
      id_jornada,
      id_conocio_wot,
      declaracion,
      profesiones,
      industriasExperiencia,
      disponibilidad,
      areasExperiencia,
      competencias,
      idiomas,
      contactos,
    } = req.body;

    // Verificacion de existencia de usuario
    let user = await Usuaria.findOne({
      where: {
        id: req.cognitoUserId,
      },
    });

    if (!user) {
      let error = new Error("Usuaria not found");
      error.statusCode = 404;
      throw error;
    }

    if (rut) {
      let userRut = await Usuaria.findOne({
        where: {
          rut: rut,
        },
      });
  
      if (userRut && userRut.id !== user.id) {
        let error = new Error("RUT already in use.");
        error.statusCode = 400;
        throw error;
      }
    }


    const updates = {
      nombre: name,
      apellido: lastName,
      // No actualizar mail, ver comentario línea 399
      // mail: mail,
      rut: rut,
      celular: celular,
      universidad: universidad,
      postgrado: postgrado,
      id_cargo: id_cargo,
      empresa_actual: empresa_actual,
      id_industria_actual: id_industria_actual,
      id_industria_adicional: id_industria_adicional,
      id_cargo_adicional: id_cargo_adicional,
      empresa_adicional: empresa_adicional,
      id_anios_experiencia: id_anios_experiencia,
      experienciaDirectorios: experienciaDirectorios,
      altaDireccion: altaDireccion,
      intereses: intereses,
      brief: brief,
      redesSociales: redesSociales,
      id_personalidad: id_personalidad,
      factor: factor,
      nombrePuebloOriginario: nombrePuebloOriginario,
      id_region_con_compromiso: id_region_con_compromiso,
      id_pais_domicilio: id_pais_domicilio,
      region_domicilio: region_domicilio,
      id_posibilidad_cambiarse_region: id_posibilidad_cambiarse_region,
      disposicion_viajar: disposicion_viajar ?? false,
      id_modalidad: id_modalidad,
      id_jornada: id_jornada,
      id_conocio_wot: id_conocio_wot,
      declaracion: declaracion,
    };

    await Usuaria.update(updates, {
      where: {
        id: user.id,
      },
    });

    // Actualización de campos con referencias a otras tablas

    if (profesiones) {
      // Se buscan UsuariaProfesiones anteriores
      const oldProfesiones = await UsuariasProfesion.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        oldProfesiones.map(async (row) => {
          await row.destroy();
        })
      );

      profesiones.forEach(async (profesion) => {
        await UsuariasProfesion.create({
          id_usuaria: user.id,
          id_profesion: profesion,
        });
      });
    }

    if (industriasExperiencia) {
      // Se buscan UsuariasIndustria anteriores
      const oldIndustrias = await UsuariasIndustria.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        oldIndustrias.map(async (row) => {
          await row.destroy();
        })
      );
      industriasExperiencia.forEach(async (industria) => {
        await UsuariasIndustria.create({
          id_usuaria: user.id,
          id_industria: industria,
        });
      });
    }

    if (disponibilidad) {
      // Se buscan UsuariasDisponibilidad anteriores
      const oldDisponibilidad = await UsuariasDisponibilidad.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        oldDisponibilidad.map(async (row) => {
          await row.destroy();
        })
      );
      disponibilidad.forEach(async (disponibilidad) => {
        await UsuariasDisponibilidad.create({
          id_usuaria: user.id,
          id_disponibilidad: disponibilidad,
        });
      });
    }

    if (areasExperiencia) {
      // Se buscan UsuariasAreasExperiencia anteriores
      const oldAreasExperiencia = await UsuariasAreasExperiencia.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        oldAreasExperiencia.map(async (row) => {
          await row.destroy();
        })
      );
      areasExperiencia.forEach(async (area) => {
        await UsuariasAreasExperiencia.create({
          id_usuaria: user.id,
          id_area: area,
        });
      });
    }

    if (competencias) {
      // Se buscan UsuariasCompetencia anteriores
      const oldCompetencia = await UsuariasCompetencia.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        oldCompetencia.map(async (row) => {
          await row.destroy();
        })
      );
      competencias.forEach(async (competencia) => {
        await UsuariasCompetencia.create({
          id_usuaria: user.id,
          id_competencia: competencia,
        });
      });
    }

    if (idiomas) {
      // Se buscan UsuariasIdioma anteriores
      const oldIdiomas = await UsuariasIdioma.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        oldIdiomas.map(async (row) => {
          await row.destroy();
        })
      );
      idiomas.forEach(async (idioma) => {
        await UsuariasIdioma.create({ id_usuaria: user.id, id_idioma: idioma });
      });
    }

    if (contactos) {
      // Se buscan ContactosVerificacion anteriores
      const oldContactos = await ContactosVerificacion.findAll({
        where: { id_usuaria: user.id },
      });
      await Promise.all(
        oldContactos.map(async (row) => {
          await row.destroy();
        })
      );
      contactos.forEach(async (contacto) => {
        await ContactosVerificacion.create({
          id_usuaria: user.id,
          nombre: contacto[0],
          email: contacto[1],
          telefono: contacto[2],
        });
      });
    }
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

exports.updateCv = asyncHandler(async (req, res, next) => {
  try {
    let usuaria = await Usuaria.findByPk(req.cognitoUserId);
    if (!usuaria) {
        let error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }
    const oldCurriculum = await Curriculum.findOne({
      where: {
        usuariaId: usuaria.id
      }
    });
    if (oldCurriculum) {
      await oldCurriculum.destroy();
    }
    await Curriculum.create({
      link: req.cvkey,
      usuariaId: usuaria.id
    });

    
    res.status(200).send();
  } catch (error) {
    next(error);
  }
;});

exports.getCv = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.cognitoUserId;

    let usuaria = await Usuaria.findByPk(userId);
    if (!usuaria) {
        let error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    const cvRelation = await Curriculum.findOne({
      where: {
        usuariaId: usuaria.id,
      }
    });

    if (!cvRelation) {
        let error = new Error("CV not found for the user");
        error.statusCode = 404;
        throw error;
    }

    if (cvRelation.link === null) {
        let error = new Error("CV not found for the user");
        error.statusCode = 404;
        throw error;
    }

    let urlParts = new URL(cvRelation.link);
    let s3ObjectKey = urlParts.pathname.substring(1);

    let params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3ObjectKey,
      Expires: 3600,
    };

    let preSignedUrl = s3.getSignedUrl('getObject', params);


    res.status(200).send({
      cvlink: preSignedUrl
    });

  } catch (error) {
    next(error);
  }
})

exports.getUser = getUser;
