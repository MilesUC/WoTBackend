const Express = require('express');
const router = Express.Router();
const auth = require('./auth');
const communities = require('./communities');
const users = require('./users');
const companies = require('./companies');
const obtenerListas = require('./obtenerListas');
const posts = require('./posts');
const notifications = require('./notifications');
const dotenv = require('dotenv');
// const { expressjwt: jwtMiddleware } = require('express-jwt');
const checkCognitoToken = require("../middlewares/auth/checkCognitoToken");
const checkIfUserProfileWasCompleted = require('../middlewares/auth/checkIfUserProfileWasCompleted');

dotenv.config();


router.use('/auth', auth);
router.use('/users', [checkCognitoToken], users);
router.use('/communities', [checkCognitoToken], [checkIfUserProfileWasCompleted], communities);
router.use('/obtener_listas', obtenerListas);
router.use('/companies', [checkCognitoToken], [checkIfUserProfileWasCompleted], companies);
router.use('/posts', [checkCognitoToken], [checkIfUserProfileWasCompleted], posts);
router.use('/notifications', [checkCognitoToken], notifications);

module.exports = router;