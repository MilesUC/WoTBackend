const asyncHandler = require("express-async-handler");
const axios = require("axios");
const dotenv = require("dotenv");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
dotenv.config();
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oidc');

const Usuaria = require("../models/Usuaria");
const Rol = require("../models/Rol");
const UsuariasProfesion = require("../models/UsuariasProfesion");
const UsuariasIndustria = require("../models/UsuariasIndustria");
const UsuariasDisponibilidad = require("../models/UsuariasDisponibilidad");
const UsuariasAreasExperiencia = require("../models/UsuariasAreasExperiencia");
const UsuariasCompetencia = require("../models/UsuariasCompetencia");
const UsuariasIdioma = require("../models/UsuariasIdioma");
const ContactosVerificacion = require("../models/ContactosVerificacion");
const Post = require("../models/post");
const PostLike = require("../models/postlike");
const Comment = require("../models/comment");
const Notification = require("../models/notification");
const Community = require("../models/community");

const {
  initiateAuth,
  adminSetPassword,
  confirmForgotPassword,
  forgotPassword,
  adminCreateUser,
  refreshAccessToken,
} = require("../utils/cognitoUtils");
const Match = require("../models/Match");
const NotificationPreference = require("../models/notificationpreference");

function capitalizarPrimeraLetra(str) {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, lastName, mail, password } = req.body;
  try {
    const response = await adminCreateUser(name, mail, password);

    const { User: cognitoUser } = response;

    // Set a permanent password for the user
    await adminSetPassword(mail, password);

    user = await Usuaria.create({
      id: cognitoUser.Username,
      nombre: name,
      apellido: lastName,
      mail: mail,
    });

    const role = await Rol.findOne({ where: { nombre: "user" } });
    user.setRol(role);

    const response2 = await initiateAuth(mail, password);

    userPreferences = await NotificationPreference.create({
      userId: user.id,
    });

    return res.status(201).json({
      access_token: response2.AuthenticationResult.AccessToken,
      refresh_token: response2.AuthenticationResult.RefreshToken,
      token_type: "Bearer",
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      mail: user.mail,
    });
  } catch (error) {
    next(error);
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  const { mail, password } = req.body;
  try {
    const user = await Usuaria.findOne({
      where: { mail: mail },
      include: [
        {
          model: Rol,
          as: "rol",
          attributes: ["nombre"],
        },
      ],
    });

    if (!user) {
      let error = new Error(`Email address not found.`);
      error.statusCode = 404;
      throw error;
    }

    if (user && user.rol.nombre !== "user") {
      return res.status(401).json({
        error: "User must have an user role to login with this endpoint",
      });
    }

    const response = await initiateAuth(mail, password);

    // Obtención de preferencias

    const userPreferences = await NotificationPreference.findOne({
      where: {
        userId: user.id,
      },
    });

    // Creación de notificación de rendimiento
    if (userPreferences.publicaciones) {
      const lastPost = await Post.findOne({
        where: {
          userId: user.id,
        },
        include: [
          {
            model: PostLike,
          },
          {
            model: Comment,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (lastPost) {
        const likes = lastPost.dataValues.PostLikes.length;
        const comments = lastPost.dataValues.Comments.length;
        if (likes > 0 || comments > 0) {
          // Si no hay likes ni comments, no se crea la notificación
          const community = await Community.findOne({
            where: {
              id: lastPost.communityId,
            },
          });

          let content = "";
          if (likes > 0 && comments > 0) {
            content +=
              `${likes} ` +
              (likes > 1 ? "likes" : "like") +
              ` y ${comments} ` +
              (comments > 1 ? "comentarios" : "comentario");
          } else if (comments == 0) {
            content += `${likes} ` + (likes > 1 ? "likes" : "like");
          } else {
            content +=
              `${comments} ` + (comments > 1 ? "comentarios" : "comentario");
          }
          content += ` tiene tu última publicacion en ${community.name}`;

          const previousSummaryNotifications = await Notification.destroy({
            where: {
              userId: user.id,
              type: "summary",
            },
          });

          await Notification.create({
            userId: user.id,
            content: content,
            postId: lastPost.id,
            section: "Mis publicaciones",
            type: "summary",
          });
        }
      }
    }

    // Creación de notificacion de búsquedas

    if (userPreferences.busquedaEmpresas) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const matches = await Match.findAll({
        where: {
          id_usuaria: user.id,
          createdAt: {
            [Op.gte]: oneWeekAgo,
          },
        },
      });

      if (matches.length > 0) {
        let text =
          `Has aparecido en ${matches.length} ` +
          (matches.length > 1 ? "búsquedas" : "búsqueda") +
          " en la última semana";

        await Notification.create({
          userId: user.id,
          content: text,
          section: "Todo",
          type: "matches",
        });
      }
    }

    return res.status(200).json({
      access_token: response.AuthenticationResult.AccessToken,
      refresh_token: response.AuthenticationResult.RefreshToken,
      token_type: "Bearer",
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      mail: user.mail,
    });
  } catch (error) {
    if (error.message === "Incorrect username or password.") {
      // El username es el mail
      // No puede estar mal el username porque se comprueba antes que este exista -> linea 218
      error.message = "Incorrect password.";
    }
    next(error);
  }
});

exports.google = asyncHandler((req, res, next) => {
  console.log(req.get("host"));
  res.redirect(
    `https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=${process.env.URL_WEB}${process.env.REDIRECT_ROUTE}&response_type=CODE&client_id=${process.env.CLIENT_ID}&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile`
  );
});

exports.google_login = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  const finalData = {};
  axios
    .post(
      `https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/token`,
      {
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        code: code,
        redirect_uri: `${process.env.URL_WEB}${process.env.REDIRECT_ROUTE}`,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((tokenResponse) => {
      const tokenData = tokenResponse.data;
      finalData.access_token = tokenData.access_token;
      finalData.refresh_token = tokenData.refresh_token;
      finalData.token_type = tokenData.token_type;
      axios
        .get(`https://${process.env.COGNITO_DOMAIN}.auth.${process.env.AWS_REGION}.amazoncognito.com/oauth2/userInfo`, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        })
        .then(async (userResponse) => {
          const userData = userResponse.data;

          if (!userData.family_name) {
            userData.family_name = "";
          }

          userData.given_name = await capitalizarPrimeraLetra(
            userData.given_name
          );
          userData.family_name = await capitalizarPrimeraLetra(
            userData.family_name
          );

          const user = await Usuaria.findOrCreate({
            where: { mail: userData.email },
            defaults: {
              id: userData.username,
              nombre: userData.given_name,
              apellido: userData.family_name,
              mail: userData.email,
            },
          });

          finalData.id = userData.username;
          finalData.name = userData.given_name;
          finalData.lastName = userData.family_name;
          finalData.mail = userData.email;
          res.status(200).send(finalData);
        });
    })
    .catch((error) => {
      error.statusCode = 400;
      next(error);
    });
});

exports.refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const response = await refreshAccessToken(refreshToken);
    console.log("response in Refresh: ", response);

    return res.status(200).json({
      access_token: response.AuthenticationResult.AccessToken,
      refresh_token: response.AuthenticationResult.RefreshToken,
      token_type: "Bearer",
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({ error: "Error refreshing access token" });
  }
});

exports.resetPassword = async (req, res, next) => {
  const { mail } = req.body;

  try {
    const response = await forgotPassword(mail);

    return res.status(201).json({
      message: "Password reset code sent successfully!",
    });
  } catch (error) {
    console.log("Error sending password reset code:", error);
    error.statusCode = 401;
    next(error);
  }
};

exports.confirmResetPassword = async (req, res) => {
  const { mail, code, newPassword } = req.body;

  try {
    await confirmForgotPassword(mail, code, newPassword);
    return res.status(201).json({
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    next(error);
  }
};
