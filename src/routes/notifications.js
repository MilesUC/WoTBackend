const Express = require("express");
const router = Express.Router();
// const { expressjwt: jwtMiddleware } = require("express-jwt");
const checkCognitoToken = require("../middlewares/auth/checkCognitoToken");
const dotenv = require("dotenv");
const controller = require("../controllers/notification.controller");
const {
  validateEditProfilePreferencesSchema,
} = require("../middlewares/inputValidations");

/**
 * @openapi
 * /notifications/:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen las notificaciones de una usuaria
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Se obtuvieron las notificaciones de la usuaria con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       userId:
 *                         type: string
 *                       content:
 *                         type: string
 *                       triggerUserId:
 *                         type: string
 *                       postId:
 *                         type: number
 *                       section:
 *                         type: string
 *                       type:
 *                         type: string
 *                       seen:
 *                         type: boolean
 */

router.get(
  "/",
  controller.getNotifications
);

/**
 * @openapi
 * /notifications/get_notification_preferences:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen las preferencias de notificaciones de la usuaria
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Se obtuvieron las preferencias de notificaciones de la usuaria con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificationPreferences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       userId:
 *                         type: string
 *                       busquedaEmpresas:
 *                         type: boolean
 *                       conectarComunidades:
 *                         type: boolean
 *                       publicaciones:
 *                         type: boolean
 *                       actividadComunidades:
 *                         type: boolean
 *                       actualizacionesPerfil:
 *                         type: boolean
 */

router.get(
  "/get_notification_preferences",
  controller.getNotificationPreferences
);

/**
 * @openapi
 * /notifications/get_unseen_notifications_number:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Se obtienen el número de notificaciones sin leer en la bandeja de la usuaria.
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Se obtuvo el número de notificaciones de la usuaria sin leer con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unseenNotificationsNumber:
 *                   type: number
 */

router.get(
  "/get_unseen_notifications_number",
  controller.getUnseenNotificationsNumber
)

/**
 * @openapi
 * /notifications/edit_notification_preferences:
 *   patch:
 *     security:
 *       - Authorization: []
 *     summary: Se editan las preferencias de notificaciones de la usuaria.
 *     tags: [Notifications]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             busquedaEmpresas:
 *               type: boolean
 *             conectarComunidades:
 *               type: boolean
 *             publicaciones:
 *               type: boolean
 *             actividadComunidades:
 *               type: boolean
 *             actualizacionesPerfil:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Preferencias de notificaciones de la usuaria editadas con éxito.
 */

router.patch(
  "/edit_notification_preferences",
  [validateEditProfilePreferencesSchema],
  controller.updateNotificationPreferences
);

dotenv.config();

module.exports = router;