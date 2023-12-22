const express = require('express');
const router = express.Router();
const controller = require('../controllers/listas.controller');

/**
 * @openapi
 * /obtener_listas/disponibilidades:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de disponibilidades y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   disponibilidad:
 *                     type: string
 */
router.get('/disponibilidades', controller.getDisponibilidades);

/**
 * @openapi
 * /obtener_listas/jornadas:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de jornadas y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   tipoJornada:
 *                     type: string
 */
router.get('/jornadas', controller.getJornadas);

/**
 * @openapi
 * /obtener_listas/modalidades:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de modalidades y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   tipoModalidad:
 *                     type: string
 */
router.get('/modalidades', controller.getModalidades);

/**
 * @openapi
 * /obtener_listas/areas:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de areas y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
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
 */
router.get('/areas', controller.getAreas);

/**
 * @openapi
 * /obtener_listas/regiones:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de regiones y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
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
 */
router.get('/regiones', controller.getRegiones);

/**
 * @openapi
 * /obtener_listas/profesiones:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de profesiones y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
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
 */
router.get('/profesiones', controller.getProfesiones);

/**
 * @openapi
 * /obtener_listas/industrias:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de industrias y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   nombre_industria:
 *                     type: string
 */
router.get('/industrias', controller.getIndustrias);

/**
 * @openapi
 * /obtener_listas/competencias:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de competencias y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   competencia:
 *                     type: string
 */
router.get('/competencias', controller.getCompetencias);

/**
 * @openapi
 * /obtener_listas/idiomas:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de idiomas y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
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
 */
router.get('/idiomas', controller.getIdiomas);

/**
 * @openapi
 * /obtener_listas/formularios:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de personalidades correspondientes al formulario de personalidad y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   personalidad:
 *                     type: string
 */
router.get('/formularios', controller.getFormularios);

/**
 * @openapi
 * /obtener_listas/rango_anos:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de rangos de años de búsqueda y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   rango:
 *                     type: string
 */
router.get('/rango_anos', controller.getRangoAnos);

/**
 * @openapi
 * /obtener_listas/paises:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de paises y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   pais:
 *                     type: string
 */
router.get('/paises', controller.getPaises);

/**
 * @openapi
 * /obtener_listas/universidades:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de universidades y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
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
 */
router.get('/universidades', controller.getUniversidades);

/**
 * @openapi
 * /obtener_listas/cargos:
 *   get:
 *     summary: Se obtiene la lista con los distintos valores de cargos y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   cargo:
 *                     type: string
 */
router.get('/cargos', controller.getCargos);

/**
 * @openapi
 * /obtener_listas/anios_experiencia:
 *   get:
 *     summary: Se obtiene la lista con los distintos rangos de años de experiencia y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   rango_experiencia_desde:
 *                     type: number
 *                   rango_experiencia_hasta:
 *                     type: number
 */
router.get('/anios_experiencia', controller.getAniosExperiencia);

/**
 * @openapi
 * /obtener_listas/conocio_wot:
 *   get:
 *     summary: Se obtiene la lista con las distintas opciones de como conoció la plataforma y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   conocio:
 *                     type: string
 */
router.get('/conocio_wot', controller.getConocioWot);

/**
 * @openapi
 * /obtener_listas/anos_fundacion:
 *   get:
 *     summary: Se obtiene la lista con los distintos rangos de años de fundación y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   rango_anios_desde:
 *                     type: number
 *                   rango_anios_hasta:
 *                     type: number
 */
router.get('/anos_fundacion', controller.getAnosFundacion);

/**
 * @openapi
 * /obtener_listas/ingresos_anuales:
 *   get:
 *     summary: Se obtiene la lista con los distintos rangos de ingresos anuales y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   rango_ingresos_desde:
 *                     type: number
 *                   rango_ingresos_hasta:
 *                     type: number
 */
router.get('/ingresos_anuales', controller.getIngresosAnuales);

/**
 * @openapi
 * /obtener_listas/cantidad_empleados:
 *   get:
 *     summary: Se obtiene la lista con los distintos rangos empleados que posee la empresa y sus ids correspondientes.
 *     tags: [Get Lists]
 *     responses:
 *       200:
 *         description: Se obtuvo la lista con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   rango_empleados_desde:
 *                     type: number
 *                   rango_empleados_hasta:
 *                     type: number
 */
router.get('/cantidad_empleados', controller.getCantidadEmpleados); //////////////////////////////////////////////////

module.exports = router;
