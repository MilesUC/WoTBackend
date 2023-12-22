const Express = require("express");
const router = Express.Router();
const dotenv = require("dotenv");
const controller = require("../controllers/company.controller");

const {
    validateCompanyNameSearchSchema
  } = require("../middlewares/inputValidations");
const checkIfUserProfileWasCompleted = require("../middlewares/auth/checkIfUserProfileWasCompleted");
const checkCognitoToken = require("../middlewares/auth/checkCognitoToken");

dotenv.config();

/**
 * @openapi
 * /companies/get_by_nombre:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Se buscan las empresas que se encuentran ACTIVAS por su nombre.
 *     tags: [Companies]
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
 *             nombre: "Abastible"
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
 *                   nombre:
 *                     type: string
 *                   valoresEmpresa:
 *                     type: string
 *                   industria:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nombre_industria:
 *                         type: string
 *                   fundacion:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       rango_anios_desde:
 *                         type: number
 *                       rango_anios_hasta:
 *                         type: number
 *                   region:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nombre:
 *                         type: string
 *                       numero:
 *                         type: number
 *                          
*/

router.post(
  "/get_by_nombre",
  [validateCompanyNameSearchSchema],
  [checkCognitoToken],
  [checkIfUserProfileWasCompleted],
  controller.findEmpresasByName
);

/**
 * @openapi
 * /companies/get_company_profile/{companyId}:
 *   get:
 *     summary: Se obtiene la información para la usuaria de la empresa solicitada.
 *     tags: [Companies]
 *     parameters:
 *       - name: companyId
 *         in: path
 *         description: Id de la empresa a buscar.
 *         required: true
 *     responses:
 *       200:
 *         description: Se obtuvo la información de la empresa especificada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 empresa:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     valoresEmpresa:
 *                       type: string
 *                     industria:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         nombre_industria:
 *                           type: string
 *                     region:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         nombre:
 *                           type: string
 *                         numero:
 *                           type: number
 *       404:
 *         description: No se encontró la empresa con el id solicitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string   
 */

router.get(
  "/get_company_profile/:companyId",
  [checkCognitoToken],
  [checkIfUserProfileWasCompleted],
  controller.getCompanyForUsuaria,
)

module.exports = router;