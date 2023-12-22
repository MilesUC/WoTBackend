const Express = require("express");
const router = Express.Router();
const controller = require("../controllers/usuaria.controller");

const cvUploader = require("../middlewares/cvUploader");
const checkIfUserisAdmin = require("../middlewares/auth/checkIfUserIsAdmin");
const {
  validateChangePasswordSchema,
  validateEditProfileSchema,
} = require("../middlewares/inputValidations");

// function validateCorrectUser(tokenId, databaseUserId) {
//   if (tokenId === databaseUserId) {
//     return true;
//   }
//   return false;
// }

/**
 * @openapi
 * /users:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen los perfiles de todas las usuarias registradas.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   mail:
 *                     type: string
 *                   rut:
 *                     type: string
 *                   celular:
 *                     type: string
 *                   postgrado:
 *                     type: string
 *                   cargo:
 *                     type: string
 *                   empresa_actual:
 *                     type: string
 *                   aditionalIndustria:
 *                     type: string
 *                   aditionalCargo:
 *                     type: string
 *                   empresa_adicional:
 *                     type: string
 *                   aniosExperiencia:
 *                     type: number
 *                   experienciaDirectorios:
 *                     type: string
 *                   altaDireccion:
 *                     type: boolean
 *                   intereses:
 *                     type: string
 *                   brief:
 *                     type: string
 *                   redesSociales:
 *                     type: string
 *                   personalidad:
 *                     type: string
 *                   factor:
 *                     type: string
 *                   nombrePuebloOriginario:
 *                     type: string
 *                   regionCompromiso:
 *                     type: string
 *                   paisDomicilio:
 *                     type: string
 *                   regionActualDomicilio:
 *                     type: string
 *                   posibilidadCambiarseRegion:
 *                     type: string
 *                   disposicion_viajar:
 *                     type: string
 *                   tipoModalidad:
 *                     type: string
 *                   tipoJornada:
 *                     type: string
 *                   conocioWOT:
 *                     type: string
 *                   declaracion:
 *                     type: string
 *                   industria:
 *                     type: string
 *                   rol:
 *                     type: string
 */
// *                   disponibilidad:
// *                     type: array
// *                   profesion:
// *                     type: array
// *                   industrias:
// *                     type: array
// *                   areas:
// *                     type: array
// *                   competencia:
// *                     type: array
// *                   idiomas:
// *                     type: array
router.get(
  "/",
  [checkIfUserisAdmin],
  controller.getAll
);

/**
 * @openapi
 * /users/get_profile:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtiene el perfil de la usuaria que hace la request.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Datos de la usuaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 mail:
 *                   type: string
 *                 rut:
 *                   type: string
 *                 celular:
 *                   type: string
 *                 postgrado:
 *                   type: string
 *                 cargo:
 *                   type: string
 *                 empresa_actual:
 *                   type: string
 *                 aditionalIndustria:
 *                   type: string
 *                 aditionalCargo:
 *                   type: string
 *                 empresa_adicional:
 *                   type: string
 *                 aniosExperiencia:
 *                   type: number
 *                 experienciaDirectorios:
 *                   type: string
 *                 altaDireccion:
 *                   type: boolean
 *                 intereses:
 *                   type: string
 *                 brief:
 *                   type: string
 *                 redesSociales:
 *                   type: string
 *                 personalidad:
 *                   type: string
 *                 factor:
 *                   type: string
 *                 nombrePuebloOriginario:
 *                   type: string
 *                 regionCompromiso:
 *                   type: string
 *                 paisDomicilio:
 *                   type: string
 *                 regionActualDomicilio:
 *                   type: string
 *                 posibilidadCambiarseRegion:
 *                   type: string
 *                 disposicion_viajar:
 *                   type: string
 *                 tipoModalidad:
 *                   type: string
 *                 tipoJornada:
 *                   type: string
 *                 conocioWOT:
 *                   type: string
 *                 declaracion:
 *                   type: string
 *                 industria:
 *                   type: string
 *                 rol:
 *                   type: string
 */
router.get(
  "/get_profile",
  controller.getProfile
);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtiene el perfil de una usuaria en específico.
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: Id de la usuaria a buscar.
 *         required: true
 *     responses:
 *       200:
 *         description: Datos de una usuaria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 mail:
 *                   type: string
 *                 rut:
 *                   type: string
 *                 celular:
 *                   type: string
 *                 postgrado:
 *                   type: string
 *                 cargo:
 *                   type: string
 *                 empresa_actual:
 *                   type: string
 *                 aditionalIndustria:
 *                   type: string
 *                 aditionalCargo:
 *                   type: string
 *                 empresa_adicional:
 *                   type: string
 *                 aniosExperiencia:
 *                   type: number
 *                 experienciaDirectorios:
 *                   type: string
 *                 altaDireccion:
 *                   type: boolean
 *                 intereses:
 *                   type: string
 *                 brief:
 *                   type: string
 *                 redesSociales:
 *                   type: string
 *                 personalidad:
 *                   type: string
 *                 factor:
 *                   type: string
 *                 nombrePuebloOriginario:
 *                   type: string
 *                 regionCompromiso:
 *                   type: string
 *                 paisDomicilio:
 *                   type: string
 *                 regionActualDomicilio:
 *                   type: string
 *                 posibilidadCambiarseRegion:
 *                   type: string
 *                 disposicion_viajar:
 *                   type: string
 *                 tipoModalidad:
 *                   type: string
 *                 tipoJornada:
 *                   type: string
 *                 conocioWOT:
 *                   type: string
 *                 declaracion:
 *                   type: string
 *                 industria:
 *                   type: string
 *                 rol:
 *                   type: string
 */
router.get(
  "/:userId",
  [checkIfUserisAdmin],
  controller.getOne
);

/**
 * @openapi
 * /users/delete_account:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: Se elimina la cuenta de la usuaria que realiza la request.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuaria eliminada.
 */
router.delete(
  "/delete_account",
  controller.deleteUsuaria
);

/**
 * @openapi
 * /users/change_password:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se cambia la contraseña de la cuenta de la usuaria.
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             oldPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *           required:
 *             - oldPassword
 *             - newPassword
 *     responses:
 *       200:
 *         description: Contraseña de la usuaria cambiada con éxito.
 */
router.post(
  "/change_password",
  [validateChangePasswordSchema],
  controller.changePassword
);

/**
 * @openapi
 * /users/edit_profile:
 *   patch:
 *     security:
 *       - Authorization: []
 *     summary: Se edita el perfil de la usuaria.
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             lastName:
 *               type: string
 *             mail:
 *               type: string
 *             rut:
 *               type: string
 *             celular:
 *               type: string
 *             universidad:
 *               type: string
 *             postgrado:
 *               type: string
 *             id_cargo:
 *               type: number
 *             empresa_actual:
 *               type: string
 *             id_industria_actual:
 *               type: number
 *             id_industria_adicional:
 *               type: number
 *             id_cargo_adicional:
 *               type: number
 *             empresa_adicional:
 *               type: string
 *             id_anios_experiencia:
 *               type: number
 *             experienciaDirectorios:
 *               type: string
 *             altaDireccion:
 *               type: boolean
 *             intereses:
 *               type: string
 *             brief:
 *               type: string
 *             redesSociales:
 *               type: string
 *             id_personalidad:
 *               type: number
 *             factor:
 *               type: string
 *             nombrePuebloOriginario:
 *               type: string
 *             id_region_con_compromiso:
 *               type: number
 *             id_pais_domicilio:
 *               type: number
 *             region_domicilio:
 *               type: number
 *             id_posibilidad_cambiarse_region:
 *               type: number
 *             disposicion_viajar:
 *               type: string
 *             id_modalidad:
 *               type: number
 *             id_jornada:
 *               type: number
 *             id_conocio_wot:
 *               type: number
 *             declaracion:
 *               type: string
 *             profesiones:
 *               type: string
 *             industriasExperiencia:
 *               type: string
 *             disponibilidad:
 *               type: string
 *             areasExperiencia:
 *               type: string
 *             competencias:
 *               type: string
 *             idiomas:
 *               type: string
 *             contactos:
 *               type: string
 *     responses:
 *       200:
 *         description: Perfil de la usuaria editado con éxito.
 */
router.patch(
  "/edit_profile",
  [validateEditProfileSchema],
  controller.updateUsuaria
);

/**
 * @openapi
 * /users/updatecv:
 *   patch:
 *     security:
 *       - Authorization: []
 *     summary: Se actualiza el CV de una usuaria
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: file
 *     responses:
 *       200:
 *         description: CV actualizado con éxito.
 */
router.patch(
  "/updatecv",
  [cvUploader.single('pdf')],
  controller.updateCv
);

/**
 * @openapi
 * /users/files/getcv:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtiene el cv de una usuaria.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: CV obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cvlink:
 *                   type: string
 */
router.get(
  "/files/getcv",
  controller.getCv
)

module.exports = router;
