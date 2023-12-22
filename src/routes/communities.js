const Express = require("express");
const router = Express.Router();
// const { expressjwt: jwtMiddleware } = require("express-jwt");
const checkCognitoToken = require("../middlewares/auth/checkCognitoToken");
const dotenv = require("dotenv");
const controller = require("../controllers/community.controller");
const {
  validateCommunityCreateSchema,
  validateCommunityJoinSchema,
  validateCommunityUpdateSchema,
  validateCommunityNameSearchSchema,
} = require("../middlewares/inputValidations");
const checkIfUserIsAdmin = require("../middlewares/auth/checkIfUserIsAdmin");
const checkIfUserProfileWasCompleted = require("../middlewares/auth/checkIfUserProfileWasCompleted");

dotenv.config();


/**
 * @openapi
 * /communities/create:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se crea una comunidad. Necesita que la usuaria sea administradora.
 *     tags: [Communities]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *           required:
 *             - name
 *             - description
 *     responses:
 *       201:
 *         description: Comunidad creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 community:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                 userCommunity:
 *                   type: object
 *                   properties:
 *                     communityId:
 *                       type: number
 *                     userId:
 *                       type: string
*/
router.post(
  "/create",
  [validateCommunityCreateSchema],
  [checkIfUserIsAdmin],
  controller.create
);

/**
 * @openapi
 * /communities/join:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: La usuaria se une a la comunidad especificada.
 *     tags: [Communities]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             communityId:
 *               type: number
 *           required:
 *             - communityId
 *     responses:
 *       200:
 *         description: La usuaria se unió a la comunidad con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 community:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                 userCommunity:
 *                   type: object
 *                   properties:
 *                     communityId:
 *                       type: number
 *                     userId:
 *                       type: string
*/
router.post(
  "/join",
  [validateCommunityJoinSchema],
  controller.join
);

/**
 * @openapi
 * /communities/memberships:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen las comunidades a las cuales la usuaria pertenece.
 *     tags: [Communities]
 *     responses:
 *       200:
 *         description: Se obtuvieron las comunidades a las cuales la usuaria pertenece con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 otherCommunities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       followers:
 *                         type: number
*/
router.get(
  "/memberships",
  controller.getMemberships
);

/**
 * @openapi
 * /communities/joinable_communities:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen las comunidades a las cuales la usuaria se puede unir.
 *     tags: [Communities]
 *     responses:
 *       200:
 *         description: Se obtuvieron las comunidades a las cuales la usuaria se puede unir con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 communitiesArray:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       followers:
 *                         type: number
*/
router.get(
  "/joinable_communities",
  controller.getJoinableCommunities
);

/**
 * @openapi
 * /communities/{communityId}:
 *   get:
 *     summary: Se obtiene la información de la comunidad especificada.
 *     tags: [Communities]
 *     parameters:
 *       - name: communityId
 *         in: path
 *         description: Id de la comunidad a buscar.
 *         required: true
 *     responses:
 *       200:
 *         description: Se obtuvo la información de la comunidad especificada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 followers:
 *                   type: number
 *                 userBelongs:
 *                   type: boolean
*/
router.get(
  "/:communityId",
  controller.getOne);

/**
 * @openapi
 * /communities/{communityId}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: Se elimina la comunidad especificada. Necesita que la usuaria sea administradora.
 *     tags: [Communities]
 *     parameters:
 *       - name: communityId
 *         in: path
 *         description: Id de la comunidad a eliminar.
 *         required: true
 *     responses:
 *       204:
 *         description: Se eliminó la comunidad especificada con éxito.
*/
router.delete(
  "/:communityId",
  [checkIfUserIsAdmin],
  controller.delete
);

/**
 * @openapi
 * /communities/{communityId}:
 *   patch:
 *     security:
 *       - Authorization: []
 *     summary: Se edita una comunidad. Necesita que la usuaria sea administradora.
 *     tags: [Communities]
 *     parameters:
 *       - name: communityId
 *         in: path
 *         description: Id de la comunidad a editar.
 *         required: true
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: Comunidad editada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 community:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
*/
router.patch(
  "/:communityId",
  [validateCommunityUpdateSchema],
  [checkIfUserIsAdmin],
  controller.edit
);

/**
 * @openapi
 * /communities/leave/{communityId}:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se abandona una comunidad.
 *     tags: [Communities]
 *     parameters:
 *       - name: communityId
 *         in: path
 *         description: Id de la comunidad que será abandonada.
 *     responses:
 *       204:
 *         description: Comunidad abandonada con éxito.
*/
router.post(
  "/leave/:communityId",
  controller.leave
);

/**
 * @openapi
 * /communities/find_by_nombre:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se buscan las comunidades que contienen el texto recibido por su nombre.
 *     tags: [Communities]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *           example:
 *             nombre: "Programación"
 *     responses:
 *       200:
 *         description: Se obtuvieron las empresas buscadas por nombre pertenece con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   followers:
 *                     type: number
 *                          
*/

router.post(
  "/find_by_nombre",
  [validateCommunityNameSearchSchema],
  controller.findCommunitiesByName
)

/**
 * @openapi
 * /companies/get_usuarias_cargos_industrias/{communityId}:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen las industrias y cargos de las usuarias de una comunidad anonimamente.
 *     tags: [Communities]
 *     responses:
 *       200:
 *         description: Se obtiene un arreglo de usuarias con cargos e industrias de cada una
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cargo:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           cargo:
 *                             type: string
 *                       industria:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nombre_industria:
 *                             type: string
 *                       aditionalCargo:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           cargo:
 *                             type: string
 *                       aditionalIndustria:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           nombre_industria:
 *                             type: string
 *                          
*/

router.get(
  "/get_usuarias_cargos_industrias/:communityId",
  controller.getUsuariasCargosIndustrias
);

module.exports = router;
