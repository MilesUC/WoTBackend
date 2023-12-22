const Express = require("express");
const router = Express.Router();
// const { expressjwt: jwtMiddleware } = require("express-jwt");
const checkCognitoToken = require("../middlewares/auth/checkCognitoToken");
const dotenv = require("dotenv");
const controller = require("../controllers/post.controller");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("../config/awsConfig");
const s3 = new aws.S3();
const {
    validateCreatePostSchema,
    validateLikePostSchema,
    validateGetCommunityPostsSchema,
    validateGetFeedPostsSchema,
    validateEditPostSchema,
    validateCommentPostSchema,
    validateCreateRepostSchema,
  } = require("../middlewares/inputValidations");

const multimediaUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "private", // Se hace el objeto privado, no público
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    contentType: function (req, file, cb) {
        const dataArray = file.originalname.split(".");
        const extension = dataArray[dataArray.length - 1];
        const type = `image/${extension}`;
        cb(null ,type);
    },
    key: function (req, file, cb) {
      const key = `postMultimedia/` + Date.now().toString() + "-" + file.originalname.split(" ").join("_");
      if (!req.linksArray) {
        req.linksArray = [];
      }
      req.linksArray.push(key);
      cb(null, key);
    },
  }),
});

/**
 * @openapi
 * /posts/create:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se realiza una publicación dentro de una comunidad.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               communityId:
 *                 type: number
 *               content:
 *                 type: string
 *               multimedia:
 *                 type: file
 *             required:
 *               - communityId
 *               - content
 *     responses:
 *       201:
 *         description: Publicación creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     userId:
 *                       type: string
 *                     communityId:
 *                       type: number
 *                     content:
 *                       type: string
 *                 postMultimediaArray:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       postId:
 *                         type: number
 *                       link:
 *                         type: string
 */
router.post(
  "/create",
  multimediaUpload.array("multimedia", 2), // Máximo 2 archivos
  [validateCreatePostSchema],
  controller.create
);

/**
 * @openapi
 * /posts/{postId}/like:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: El usuario que realiza la request puede dejar o sacar un like a una publicación.
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: Id de la publicación a la que se le asignará o retirará el like.
 *         required: true
 *     responses:
 *       200:
 *         description: Like asignado o retirado con éxito.
 */
router.post(
  "/:postId/like",
  [validateLikePostSchema],
  controller.likePost
);

/**
 * @openapi
 * /posts/{postId}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: Se elimina una publicación que haya realizado el usuario anteriormente.
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: Id de la publicación que será eliminada.
 *         required: true
 *     responses:
 *       200:
 *         description: Publicación eliminada con éxito.
 */
router.delete("/:postId", controller.deletePost);

/**
 * @openapi
 * /posts/get_community_posts:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen todas las publicaciones que se han realizado en una comunidad.
 *     tags: [Posts]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             communityId:
 *               type: number
 *             mode:
 *               type: string
 *             scrollLevel:
 *               type: number
 *           required:
 *             - communityId
 *             - mode
 *             - scrollLevel
 *     responses:
 *       200:
 *         description: Se obtuvieron las publicaciones de la comunidad con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       userId:
 *                         type: string
 *                       communityId:
 *                         type: number
 *                       content:
 *                         type: string
 *                       edited:
 *                         type: boolean
 *                       interactions:
 *                         type: number
 *                 postMultimediaArray:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       postId:
 *                         type: number
 *                       link:
 *                         type: string
 *                 dateTimeArray:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: string
 *                 cargosArray:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post(
  "/get_community_posts",
  [validateGetCommunityPostsSchema],
  [checkCognitoToken],
  controller.getCommunityPosts
);

/**
 * @openapi
 * /posts/get_feed_posts:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen todas las publicaciones en Feed de las comunidades a las que la usuaria pertenece.
 *     tags: [Posts]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             mode:
 *               type: string
 *             scrollLevel:
 *               type: number
 *           required:
 *             - mode
 *             - scrollLevel
 *     responses:
 *       200:
 *         description: Se obtuvieron las publicaciones del Feed con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       userId:
 *                         type: string
 *                       communityId:
 *                         type: number
 *                       content:
 *                         type: string
 *                       edited:
 *                         type: boolean
 *                       interactions:
 *                         type: number
 *                 postMultimediaArray:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       postId:
 *                         type: number
 *                       link:
 *                         type: string
 *                 dateTimeArray:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: string
 *                 cargosArray:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post(
  "/get_feed_posts",
  [validateGetFeedPostsSchema],
  [checkCognitoToken],
  controller.getFeedPosts
);

/**
 * @openapi
 * /posts/{postId}:
 *   patch:
 *     security:
 *       - Authorization: []
 *     summary: Se edita el post publicado. Solo se puede editar una vez y dentro de 24 horas desde su creación
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: Id del post a editar.
 *         required: true
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *     responses:
 *       200:
 *         description: El post fue editado con éxito.
 *       401:
 *         description: La usuaria no es dueña del post
 *       403:
 *         description: El post ya fue editado una vez o pasaron mas de 24 horas desde su creación
 *       404:
 *         description: No se encontró el post
 */

router.patch(
  "/:postId",
  [validateEditPostSchema],
  controller.editPost
);

/**
 * @openapi
 * /posts/{postId}/comment:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se realiza un comentario en un post.
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: Id de la publicación en la que se comentará.
 *         required: true
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *           required:
 *             - content
 *     responses:
 *       201:
 *         description: Se ha realizado el comentario con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     userId:
 *                       type: string
 *                     communityId:
 *                       type: number
 *                     content:
 *                       type: string
 *                     edited:
 *                       type: boolean
 *                     interactions:
 *                       type: number
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     userId:
 *                       type: string
 *                     postId:
 *                       type: number
 *                     content:
 *                       type: string
 *                     
 */
router.post(
  "/:postId/comment",
  [validateCommentPostSchema],
  controller.commentPost
);

/**
 * @openapi
 * /posts/{postId}/comments:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen los comentarios de una publicación.
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: Id de la publicación de la cual se obtienen los comentarios.
 *         required: true
 *     responses:
 *       200:
 *         description: Se obtuvieron los comentarios de la publicación con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       userId:
 *                         type: string
 *                       postId:
 *                         type: number
 *                       content:
 *                         type: string
 *                       usuaria:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           cargo:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: number
 *                               cargo:
 *                                 type: string
 * 
 */
router.get(
  "/:postId/comments",
  controller.getPostComments
);

/**
 * @openapi
 * /posts/comments/{commentId}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: Se elimina un comentario que haya realizado el usuario anteriormente.
 *     tags: [Posts]
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: Id del comentario que será eliminado.
 *         required: true
 *     responses:
 *       204:
 *         description: Comentario eliminado con éxito.
 */
router.delete(
  "/comments/:commentId",
  controller.deleteComment);

router.get(
  "/:postId",
  controller.getPost
);

router.post(
  "/repost",
  [validateCreateRepostSchema],
  controller.repost
)

dotenv.config();

module.exports = router;
