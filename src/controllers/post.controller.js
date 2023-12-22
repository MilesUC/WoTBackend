const asyncHandler = require("express-async-handler");
const Usuaria = require("../models/Usuaria");
const UsuariaCommunity = require("../models/usuariacommunity");
const Community = require("../models/community");
const Post = require("../models/post");
const PostMultimedia = require("../models/postmultimedia");
const PostLike = require("../models/postlike");
const Comment = require("../models/comment");
const Cargo = require("../models/Cargo");
const Industria = require("../models/Industria");
const Notification = require("../models/notification");

const aws = require("../config/awsConfig");
const PostRepost = require("../models/postrepost");
const NotificationPreference = require("../models/notificationpreference");

const s3 = new aws.S3();

exports.create = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con id de la usuaria creadora (por medio del token), de la
    // comunidad en la que se publica y el contenido (texto) de la publicación
    // Los archivos multimedia (opcional) (máximo 2 imágenes) vienen en req.files
    // {communityId, content}
    const reqInfo = req.body;
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos (Debe haber contenido o imágenes)
    if (!reqInfo.userId || !reqInfo.communityId || !(reqInfo.content || req.files)) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }
    
    // Se busca la usuaria creadora
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
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

    // Se busca la relación entre usuaria y comunidad
    const userCommunity = await UsuariaCommunity.findOne({
      where: {
        communityId: community.id,
        userId: user.id,
      },
    });

    // Se verifica que el userId pertenezca a la comunidad para poder publicar
    if (!userCommunity) {
      let error = new Error(`User does not belong to the community.`);
      error.statusCode = 400;
      throw error;
    }

    // Se verifica que la usuaria ya tenga un cargo (que debería tener al completar el formulario)
    if (!user.id_cargo) {
      let error = new Error(`User does not have id_cargo assigned.`);
      error.statusCode = 400;
      throw error;
    }
    
    // Se crea la publicación.
    const post = await Post.create({
      userId: reqInfo.userId,
      communityId: reqInfo.communityId,
      content: reqInfo.content,
    });

    // Se crean las relaciones de archivos multimedia (si hay) con los posts
    const postMultimediaArray = [];
    if (req.files) {
      if (req.files.length > 0) {
        const postMultimedia1 = await PostMultimedia.create({
          postId: post.id,
          link: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/` + req.linksArray[0]
        });
        postMultimediaArray.push(postMultimedia1);
      };
      if (req.files.length == 2) {
        const postMultimedia2 = await PostMultimedia.create({
          postId: post.id,
          link: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/` + req.linksArray[1]
        });
        postMultimediaArray.push(postMultimedia2);
      };
    }

    res.status(201).send({
      post: post,
      postMultimediaArray: postMultimediaArray
    });
  } catch (error) {
    next(error);
  }
});

exports.likePost = asyncHandler(async (req, res, next) => {
  try {
    const usuariaId = req.cognitoUserId;
    const postId = parseInt(req.params.postId);

    // Se busca el usuario creador
    const usuaria = await Usuaria.findOne({
        where: {
          id: usuariaId,
        },
      });
  
      // Se verifica que exista el usuario.
      if (!usuaria) {
        let error = new Error(`Usuaria not found.`);
        error.statusCode = 404;
        throw error;
      }
  
      // Se busca el post
      const post = await Post.findOne({
        where: {
          id: postId,
        },
      });
  
      // Se verifica que exista el post.
      if (!post) {
        let error = new Error(`post not found.`);
        error.statusCode = 404;
        throw error;
      }

      // Buscar si ya se le dió like anteriormente

      const oldLike = await PostLike.findOne({
        where: {
          usuariaId: usuariaId,
          postId: postId
        }
      });

      // Se busca la usuaria creadora del post al que se le da like
      const postOwner = await Usuaria.findOne({
        where: {
          id: post.userId,
        },
      });

      // Se busca la comunidad del post
      const community = await Community.findOne({
        where: {
          id: post.communityId
        },
      });

      // Se buscan las preferencias de notificaciones de la usuaria creador del post
      const ownerPreferences = await NotificationPreference.findOne({
        where: {
          userId: postOwner.id
        }
      });

      if (oldLike) {
        // Se elimina la notificación de like anterior solo si tiene actividas las notificaciones
        if (ownerPreferences.publicaciones) {
          // Se busca la notificación que se había creado para el like, para poder eliminarla
          if (usuaria.id !== post.userId) {
          const notification = await Notification.findOne({
            where: {
              triggerUserId: usuaria.id,
              postId: post.id,
              type: "like"
            }
          });
  
          // Se verifica que exista la notificación
          if (!notification) {
            let error = new Error();
            error.message = `Notification not found.`;
            error.statusCode = 404;
            throw error;
          }
  
          // Se elimina la notificación
          await notification.destroy();
          }
        };

        // Si ya se dió like se quita el like
        await oldLike.destroy();

        // Disminuye la cantidad de interacciones en 1
        const updates = {
          interactions: post.interactions - 1
        };
        await Post.update(updates, {
          where: {
            id: post.id,
          },
        });

        res.status(200).send();
      } else {
        // Crear nuevo PostLike (like) si no se había dado like
        await PostLike.create({
          usuariaId: usuariaId,
          postId: postId
        });

        // Aumenta la cantidad de interacciones en 1
        const updates = {
          interactions: post.interactions + 1
        };
        await Post.update(updates, {
          where: {
            id: post.id,
          },
        });

        // Se crea una notificación para la usuaria que recibe el like en su publicación
        if (ownerPreferences.publicaciones) {
          if (usuaria.id !== post.userId) {
            await Notification.create({
              userId: postOwner.id,
              content: `Una usuaria ha dado Me Gusta a una publicación tuya en la comunidad ${community.name}.`,
              triggerUserId: usuaria.id,
              postId: post.id,
              section: "Mis publicaciones",
              type: "like"
            });
          }
        }
        
        res.status(200).send();
      }
  } catch (error) {
    next(error);
  }
});

exports.getCommunityPosts = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con el id de la comunidad que se desea ver, el modo de vista
    // de los posts (ver posts recientes primero o los más destacados/populares), el nivel de
    // scroll que se está viendo (scroll down en la página) y token de usuaria
    // {communityId, mode, scrollLevel}
    // mode puede ser 'createdAt' o 'interactions' (los posts más populares son los que tienen
    // más interacciones, es decir, suma entre comentarios y likes).
    // Usuaria debe pertenecer
    const reqInfo = req.body;
    reqInfo.userId = req.cognitoUserId;
    const scrollSize = 15;  // Cantidad de posts por scroll

    // Verificación de campos
    if (!reqInfo.userId || !reqInfo.communityId || !reqInfo.mode || !reqInfo.scrollLevel) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }
    
    // Se busca la usuaria que desea ver las publicaciones
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
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
    
    // Se busca la relación entre usuaria y comunidad
    const userCommunity = await UsuariaCommunity.findOne({
      where: {
        communityId: community.id,
        userId: user.id,
      },
    });

    // Se verifica que userId pertenezca a la comunidad para poder ver las publicaciones
    if (!userCommunity) {
      let error = new Error(`User does not belong to the community.`);
      error.statusCode = 400;
      throw error;
    }

    // Se verifica que el modo de visualización entregado sea correcto
    if (!(reqInfo.mode == 'createdAt' || reqInfo.mode == 'interactions')) {
      let error = new Error(`Viewing mode not accepted.`);
      error.statusCode = 400;
      throw error;
    }

    // Se obtienen las publicaciones de la comunidad
    const posts = await Post.findAll({
      where: {
        communityId: community.id
      },
      include: [
      {
        model: PostLike,
        where:{
          usuariaId: user.id
        },
        required: false,
      },
      {
        model: PostRepost,
        as: "repostedPost",
        attributes: ["originalPostId"],
      }],
      order: [(reqInfo.mode === "createdAt") ? ["createdAt", 'DESC'] : ["interactions", 'DESC'], ["createdAt", 'DESC']],  // Para ordenar los posts por fecha o popularidad
      limit: scrollSize,
      offset: (reqInfo.scrollLevel - 1) * scrollSize
    });

    // postMultimediaArray es un array que tiene, para cada posición, otro array con la multimedia
    // correspondiente a cada post.
    // Sigue el mismo orden que el array de posts, es decir, postMultimediaArray[i] tiene los
    // archivos multimedia del post posts[i].
    const postMultimediaArray = [];
    const dateTimeArray = [];
    const cargosArray = [];
    for (var i = 0; i < posts.length; i++) {
      // Para cada post se buscan sus archivos multimedia, fecha/hora y cargo de la creadora

      let post = posts[i];
      post.dataValues.liked = false;
      let date = `${post.createdAt.toISOString().slice(8,10)}-${post.createdAt.toISOString().slice(5,7)}-${post.createdAt.toISOString().slice(0,4)}`;
      let time = `${post.createdAt.toISOString().slice(11,16)}`;
      
      // Usuario que hace cada post
      let postUser = await Usuaria.findOne({
        where: {
          id: post.userId,
        },
      });

      let cargo = await Cargo.findOne({
        where: {
          id: postUser.id_cargo
        }
      })

      let attachedImages = await PostMultimedia.findAll({
        where: {
          postId: post.id
        }
      });
  
      let singlePostImages = [];
      attachedImages.map(async (image) => {
        let urlParts = new URL(image.link);
        let s3ObjectKey = urlParts.pathname.substring(1);

        let params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3ObjectKey,
          Expires: 3600, // en segundos (3600 = 1 hora)
        };

        let preSignedUrl = s3.getSignedUrl('getObject', params);
        singlePostImages.push(preSignedUrl);
      });
      
      postMultimediaArray.push(singlePostImages);
      dateTimeArray.push(
        [date, time]
      );
      cargosArray.push(cargo.cargo);

      // Se verifica si el usuario dio like al post
      if (post.PostLikes.length > 0) {
        post.dataValues.liked = true
      }
      delete post.dataValues.PostLikes;
    }

    res.status(200).send({
      posts: posts,
      postMultimediaArray: postMultimediaArray,
      dateTimeArray: dateTimeArray,
      cargosArray: cargosArray
    });
  } catch (error) {
    next(error);
  }
});

exports.getFeedPosts = asyncHandler(async (req, res, next) => {
  try {
    // Es análogo al getCommunityPosts para /get_community_posts pero sin la condición del id de
    // comunidad.
    // Se asume que la request viene con el modo de vista de los posts (ver posts recientes primero
    // o los más destacados/populares), el nivel de scroll que se está viendo (scroll down en la
    // página) y token de usuaria
    // {mode, scrollLevel}
    // mode puede ser 'createdAt' o 'interactions' (los posts más populares son los que tienen
    // más interacciones, es decir, suma entre comentarios y likes).
    const reqInfo = req.body;
    reqInfo.userId = req.cognitoUserId;
    const scrollSize = 15;  // Cantidad de posts por scroll

    // Verificación de campos
    if (!reqInfo.userId || !reqInfo.mode || !reqInfo.scrollLevel) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }

    // Se busca la usuaria que desea ver las publicaciones
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se verifica que el modo de visualización entregado sea correcto
    if (!(reqInfo.mode == 'createdAt' || reqInfo.mode == 'interactions')) {
      let error = new Error(`Viewing mode not accepted.`);
      error.statusCode = 400;
      throw error;
    }

    // Se buscan todas las comunidades a las que pertenece la usuaria
    const communityUserRows = await UsuariaCommunity.findAll({
      where: {
        userId: reqInfo.userId,
      },
      attributes: ["communityId"]
    });

    const communityIdArray = [];
    communityUserRows.map((row) => {
      communityIdArray.push(row.communityId);
    });

    // Se obtienen las publicaciones
    const posts = await Post.findAll({
      where: {
        communityId: communityIdArray
      },
      include: [
        {
          model: PostLike,
          where:{
            usuariaId: user.id
          },
          required: false,
        },
        {
            model: PostRepost,
            as: "repostedPost",
            attributes: ["originalPostId"],
        }
    ],
      order: [(reqInfo.mode === "createdAt") ? ["createdAt", 'DESC'] : ["interactions", 'DESC'], ["createdAt", 'DESC']],  // Para ordenar los posts por fecha o popularidad
      limit: scrollSize,
      offset: (reqInfo.scrollLevel - 1) * scrollSize
    });

    // postMultimediaArray es un array que tiene, para cada posición, otro array con la multimedia
    // correspondiente a cada post.
    // Sigue el mismo orden que el array de posts, es decir, postMultimediaArray[i] tiene los
    // archivos multimedia del post posts[i].
    const postMultimediaArray = [];
    const dateTimeArray = [];
    const cargosArray = [];
    for (var i = 0; i < posts.length; i++) {
      // Para cada post se buscan sus archivos multimedia, fecha/hora y cargo de la creadora

      let post = posts[i];
      post.dataValues.liked = false;
      let date = `${post.createdAt.toISOString().slice(8,10)}-${post.createdAt.toISOString().slice(5,7)}-${post.createdAt.toISOString().slice(0,4)}`;
      let time = `${post.createdAt.toISOString().slice(11,16)}`;

      // Usuario que hace cada post
      let postUser = await Usuaria.findOne({
        where: {
          id: post.userId,
        },
      });

      let cargo = await Cargo.findOne({
        where: {
          id: postUser.id_cargo
        }
      })

      let attachedImages = await PostMultimedia.findAll({
        where: {
          postId: post.id
        }
      });

      let singlePostImages = [];
      attachedImages.map(async (image) => {
        let urlParts = new URL(image.link);
        let s3ObjectKey = urlParts.pathname.substring(1);

        let params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3ObjectKey,
          Expires: 3600, // en segundos (3600 = 1 hora)
        };

        let preSignedUrl = s3.getSignedUrl('getObject', params);
        singlePostImages.push(preSignedUrl);
      });

      postMultimediaArray.push(singlePostImages);
      dateTimeArray.push(
        [date, time]
      );
      cargosArray.push(cargo.cargo);

      // Se verifica si el usuario dio like al post
      if (post.PostLikes.length > 0) {
        post.dataValues.liked = true
      }
      delete post.dataValues.PostLikes;
    }

    res.status(200).send({
      posts: posts,
      postMultimediaArray: postMultimediaArray,
      dateTimeArray: dateTimeArray,
      cargosArray: cargosArray
    });
  } catch (error) {
    next(error);
  }
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  // Se recibe solicitud con token y parametro /:postId
  try {
    const postId = parseInt(req.params.postId);

    if (!postId) {
      let error = new Error();
      error.message = `postId is required`;
      error.statusCode = 404;
      throw error;
    }

    // Se busca el post
    const postToDelete = await Post.findOne({ where: {
      id: postId,
    }});

    // Se verifica que exista
    if (!postToDelete) {
      let error = new Error();
      error.message = `Post not found.`;
      error.statusCode = 404;
      throw error;
    }

    // Se verifica que el usuario sea el dueño del post
    if (!(req.cognitoUserId == postToDelete.userId)) {
      let error = new Error;
      error.message = `Requesting user does not own the post`;
      error.statusCode = 401;
      throw error;
    }

    // Se eliminan las imagenes del bucket de S3

    const attachedImages = await PostMultimedia.findAll({
      where: {
        postId: postToDelete.id
      }
    });

    await Promise.all(
      attachedImages.map(async (image) => {

        const urlParts = new URL(image.link);
        const s3ObjectKey = urlParts.pathname.substring(1);

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3ObjectKey
        };

        s3.deleteObject(params, (err, data) => {
          if (err) {
            console.error('Error deleting s3 object:', err);
          }
        });
      })
    );

    // Se elimina el post
    await postToDelete.destroy();
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

exports.editPost = asyncHandler(async (req, res, next) => {
  // Se recibe solicitud con token y parametro /:postId en url y contenido a cambiar en "content"
  try {
    const reqInfo = req.body;
    reqInfo.userId = req.cognitoUserId;
    reqInfo.postId = parseInt(req.params.postId);

    const content = req.body.content;
    
    // Se busca la usuaria creadora
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }
    
    // Se busca el post.
    const post = await Post.findOne({
      where: {
        id: reqInfo.postId
      }
    });

    if (!post) {
      let error = new Error(`Post not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se verifica que el editor sea quien hizo el post

    if (!(post.userId === user.id)) {
      let error = new Error(`User does not own the post.`);
      error.statusCode = 401;
      throw error;
    }

    // Se verifica si el post ya fue editado

    if (post.edited) {
      let error = new Error(`Post was already edited once`);
      error.statusCode = 403;
      throw error;
    }

    // Se verifica que hayan pasado menos de 24 horas desde su creación 

    const currentTime = new Date();
    const createdAt = post.createdAt;
    
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    if (!(createdAt >= twentyFourHoursAgo && createdAt <= currentTime)) {
      let error = new Error(`Post can only be edited until 24 hours after creation`);
      error.statusCode = 403;
      throw error;
    };

    const updates = {
      content: content,
      edited: true
    };

    // Se modifican parametros en la base de datos

    await Post.update(updates, {
      where: {
        id: post.id,
      },
    });

    res.status(200).send(
      // {post: post}
    );
  } catch (error) {
    next(error);
  }
});

exports.commentPost = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con id de la usuaria creadora (por medio del token), del
    // post en la url (:postId) y el contenido (texto) del comentario.
    // {content} y /:postId/comment
    const reqInfo = req.body;
    reqInfo.postId = parseInt(req.params.postId);
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos
    if (!reqInfo.userId || !reqInfo.postId || !reqInfo.content) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }
    
    // Se busca la usuaria que comenta
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca el post
    const post = await Post.findOne({
      where: {
        id: reqInfo.postId,
      },
    });

    // Se verifica que exista el post.
    if (!post) {
      let error = new Error(`Post not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la comunidad
    const community = await Community.findOne({
      where: {
        id: post.communityId,
      },
    });

    // Se verifica que exista la comunidad.
    if (!community) {
      let error = new Error(`Community not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la relación entre usuaria y comunidad
    const userCommunity = await UsuariaCommunity.findOne({
      where: {
        communityId: community.id,
        userId: user.id,
      },
    });

    // Se verifica que el userId pertenezca a la comunidad para poder comentar
    if (!userCommunity) {
      let error = new Error(`User does not belong to the community.`);
      error.statusCode = 400;
      throw error;
    }
    
    // Se crea el comentario.
    const comment = await Comment.create({
      userId: reqInfo.userId,
      postId: reqInfo.postId,
      content: reqInfo.content,
    });

    // Aumenta la cantidad de interacciones en 1
    const updates = {
      interactions: post.interactions + 1
    };
    await Post.update(updates, {
      where: {
        id: post.id,
      },
    });

    // Se busca la usuaria creadora del post al que se le comenta
    const postOwner = await Usuaria.findOne({
      where: {
        id: post.userId,
      },
    });

    // Se crea una notificación para la usuaria que recibe el comentario en su publicación
    const ownerPreferences = await NotificationPreference.findOne({
      where: {
        userId: postOwner.id,
      },
    });

    if (ownerPreferences.publicaciones) {
      if (post.userId !== user.id) {
        await Notification.create({
          userId: postOwner.id,
          content: `Una usuaria ha comentado en una publicación tuya en la comunidad ${community.name}.`,
          triggerUserId: user.id,
          postId: post.id,
          section: "Mis publicaciones",
          type: "comment"
        });
      }
    }

    res.status(201).send({
      post: post,
      comment: comment
    });
  } catch (error) {
    next(error);
  }
});

exports.getPostComments = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con el id del post para los comentarios (en la url)
    // y token de usuaria.
    // /:postId/comments
    // Usuaria debe pertenecer
    const reqInfo = { postId: parseInt(req.params.postId) };
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos
    if (!reqInfo.userId || !reqInfo.postId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }
    
    // Se busca la usuaria que desea ver los comentarios
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }
    
    // Se busca el post
    const post = await Post.findOne({
      where: {
        id: reqInfo.postId,
      },
    });

    // Se verifica que exista el post.
    if (!post) {
      let error = new Error(`Post not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la comunidad
    const community = await Community.findOne({
      where: {
        id: post.communityId,
      },
    });

    // Se verifica que exista la comunidad.
    if (!community) {
      let error = new Error(`Community not found.`);
      error.statusCode = 404;
      throw error;
    }
    
    // Se busca la relación entre usuaria y comunidad
    const userCommunity = await UsuariaCommunity.findOne({
      where: {
        communityId: community.id,
        userId: user.id,
      },
    });

    // Se verifica que userId pertenezca a la comunidad para poder ver los comentarios
    if (!userCommunity) {
      let error = new Error(`User does not belong to the community.`);
      error.statusCode = 400;
      throw error;
    }
    
    // Se obtienen los comentarios del post
    const comments = await Comment.findAll({
      where: {
        postId: post.id
      },
      order: [['createdAt', 'DESC']],
        // Para ordenar los comentarios del más nuevo al más viejo
      include: [
        {
          model: Usuaria,
          as: "usuaria",
          attributes: ["id"],
          include: [
            {
              model: Cargo,
              as: "cargo",
              attributes: ["id", "cargo"],
            },
          ],
        },
      ],
    });

    res.status(200).send({
      comments: comments
    });
  } catch (error) {
    next(error);
  }
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  // Se asume que la request viene con el id del comentario (en la url)
  // y token de usuaria.
  // "/comments/:commentId"
  try {
    const reqInfo = { commentId: parseInt(req.params.commentId) };
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos
    if (!reqInfo.userId || !reqInfo.commentId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }
    
    // Se busca la usuaria que desea borrar su comentario
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }
    
    // Se busca el comentario
    const comment = await Comment.findOne({
      where: {
        id: reqInfo.commentId,
      },
    });

    // Se verifica que exista el comentario.
    if (!comment) {
      let error = new Error(`Comment not found.`);
      error.statusCode = 404;
      throw error;
    };

    // Se busca el post
    const post = await Post.findOne({
      where: {
        id: comment.postId,
      },
    });

    // Se verifica que exista el post.
    if (!post) {
      let error = new Error(`Post not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se verifica que la usuaria sea la creadora del comentario
    if (comment.userId != user.id) {
      let error = new Error(
        `Permission denied to delete comment. User is not the owner.`
      );
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // Se elimina el comentario.
    await comment.destroy();

    // Disminuye la cantidad de interacciones en 1
    const updates = {
      interactions: post.interactions - 1
    };
    await Post.update(updates, {
      where: {
        id: post.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

exports.getPost = asyncHandler(async (req, res, next) => {
  // Se asume que la request viene con el id del post (en la url)
  // y token de usuaria.
  // "/:postId"
  try {
    const reqInfo = { postId: parseInt(req.params.postId) };
    reqInfo.userId = req.cognitoUserId;

    // Verificación de campos
    if (!reqInfo.userId || !reqInfo.postId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }
    
    // Se busca la usuaria que desea ver la publicación
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria.
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca el post
    const post = await Post.findOne({
      where: {
        id: reqInfo.postId,
      },
      include: [
        {
            model: PostRepost,
            as: "repostedPost",
            attributes:["originalPostId"],
        },
        {
            model: PostLike,
            where:{
              usuariaId: user.id
            },
            required: false,
        },
      ],
    });

    // Se verifica que exista el post.
    if (!post) {
      let error = new Error(`Post not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Usuaria que hizo el post
    const postUser = await Usuaria.findOne({
      where: {
        id: post.userId,
      },
    });

    const cargo = await Cargo.findOne({
      where: {
        id: postUser.id_cargo
      }
    })

    const attachedImages = await PostMultimedia.findAll({
      where: {
        postId: post.id
      }
    });

    const date = `${post.createdAt.toISOString().slice(8,10)}-${post.createdAt.toISOString().slice(5,7)}-${post.createdAt.toISOString().slice(0,4)}`;
    const time = `${post.createdAt.toISOString().slice(11,16)}`;
    
    const postImagesArray = [];
    attachedImages.map(async (image) => {
      let urlParts = new URL(image.link);
      let s3ObjectKey = urlParts.pathname.substring(1);

      let params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3ObjectKey,
        Expires: 3600, // en segundos (3600 = 1 hora)
      };

      let preSignedUrl = s3.getSignedUrl('getObject', params);
      postImagesArray.push(preSignedUrl);
    });

    let customResponse = {
      id: post.id,
      userId: post.userId,
      communityId: post.communityId,
      content: post.content,
      edited: post.edited,
      interactions: post.interactions,
      liked: post.PostLikes.length > 0 ? true : false,
      is_repost: post.is_repost,
      date: date,
      time: time,
      cargo: cargo,
      imageLinks: postImagesArray
    };

    res.status(200).send({
      post: customResponse
    });
  } catch (error) {
    next(error);
  }
});

exports.repost = asyncHandler(async (req, res, next) => {
  try {
    // Request con formato
    // {
    //   newCommunityId,
    //   originalPostId,
    //   repostContent
    // }
    const reqInfo = req.body;

    // Verificar existencia de usuaria
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

    // Se busca la comunidad
    const community = await Community.findOne({
        where: {
          id: reqInfo.newCommunityId,
        },
      });
  
    // Se verifica que exista la comunidad.
    if (!community) {
      let error = new Error(`Community not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se busca la relación entre usuaria y comunidad
    const userCommunity = await UsuariaCommunity.findOne({
        where: {
          communityId: community.id,
          userId: user.id,
        },
      });
  
    // Se verifica que el userId pertenezca a la comunidad para poder publicar
    if (!userCommunity) {
      let error = new Error(`User does not belong to the community.`);
      error.statusCode = 400;
      throw error;
    }

    // Se verifica existencia del post original

    const oldPost = await Post.findOne({
      where: {
        id: reqInfo.originalPostId,
      },
    });

    if (!oldPost) {
      let error = new Error('Post to repost was not found');
      error.statusCode = 404;
      throw error;
    }

    // Se crea la publicación para el repost
    const newPost = await Post.create({
      userId: user.id,
      communityId: reqInfo.newCommunityId,
      content: (reqInfo.repostContent) ? reqInfo.repostContent : "Mira este post!",
      is_repost: true,
    });

    // Se crea el PostRepost para referenciar el post original
    const repostRelation = await PostRepost.create({
      newPostId: newPost.id,
      originalPostId: reqInfo.originalPostId
    });

    let customResponse = { post:
      {
        userId: newPost.userId,
        communityId: newPost.communityId,
        content: newPost.content,
        is_repost: newPost.is_repost,
        references: {
          originalPostId: repostRelation.originalPostId
        }
      }
    }
    res.status(201).send(customResponse);
  } catch (error) {
    next(error);
  }
});