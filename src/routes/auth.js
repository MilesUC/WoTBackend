const Express = require("express");
const router = Express.Router();

const controller = require("../controllers/auth.controller");

const {
  validateLoginSchema,
  validateSignUpSchema,
  validateGoogleLoginSchema,
} = require("../middlewares/inputValidations");

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Crea un nuevo usuario.
 *     tags: [Auth]
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
 *             password:
 *               type: string
 *           required:
 *             - name
 *             - lastName
 *             - mail
 *             - password
 *           example:
 *             name: Juan
 *             lastName: Perez
 *             mail: juanperez@gmail.com
 *             password: Test1234_
 *
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 mail:
 *                   type: string
 */
router.post("/signup", [validateSignUpSchema], controller.signUp);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Inicia sesión con un usuario existente, mediante credenciales.
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             mail:
 *               type: string
 *             password:
 *               type: string
 *           required:
 *             - mail
 *             - password
 *           example:
 *             mail: juanperez@gmail.com
 *             password: Test1234_
 *
 *     responses:
 *       200:
 *         description: Usuario ingresó exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 mail:
 *                   type: string
 */
router.post("/login", [validateLoginSchema], controller.login);

// *     requestBody:
// *      required: true
// *      content:
// *       application/json:
// *         schema:
// *           type: object
// *           properties:
// *             app_type:
// *               type: string
// *           required:
// *             - app_type

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Inicia el proceso de login con google. Se obtiene un código de autorización que servirá para iniciar sesión en la app.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Se redirige al cliente de autenticación de google, para luego ser redirigido de vuelta a app (mobile o web) en la ruta de login y con un código de autorización incluído.
 */
router.get("/google", controller.google);

// *             app_type:
// *               type: string
// *             - app_type

/**
 * @openapi
 * /auth/google_login:
 *   post:
 *     summary: Se inicia sesión en la app mediante un código de autorización proporcionado por google.
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *           required:
 *             - code
 *
 *     responses:
 *       200:
 *         description: Usuario ingresó exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 mail:
 *                   type: string
 */
router.post("/google_login", [validateGoogleLoginSchema], controller.google_login);

/**
 * @openapi
 * /auth/refresh_token:
 *   post:
 *     summary: Se renueva el token.
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             refreshToken:
 *               type: string
 *           required:
 *             - refreshToken
 *
 *     responses:
 *       200:
 *         description: Token renovado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 */
router.post("/refresh_token", controller.refreshAccessToken);

/**
 * @openapi
 * /auth/forgot_password:
 *   post:
 *     summary: Se envía una request para obtener un código con el objetivo de resetear la contraseña cuando esta se olvida.
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             mail:
 *               type: string
 *           required:
 *             - mail
 *
 *     responses:
 *       201:
 *         description: Se generó el código para reestablecer la contraseña y se envió al correo del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Password reset code sent successfully!
 *
 */
router.post("/forgot_password", controller.resetPassword);

/**
 * @openapi
 * /auth/reset_password:
 *   post:
 *     summary: Con el código obtenido por medio del correo se puede reestablecer la contraseña.
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             mail:
 *               type: string
 *             code:
 *               type: string
 *             newPassword:
 *               type: string
 *           required:
 *             - mail
 *             - code
 *             - newPassword
 *
 *     responses:
 *       201:
 *         description: Se reestableció la contraseña con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Password reset successfully!
 *
 */
router.post("/reset_password", controller.confirmResetPassword);

module.exports = router;
