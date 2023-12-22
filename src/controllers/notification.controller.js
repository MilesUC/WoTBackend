const asyncHandler = require("express-async-handler");
// const { Usuaria, Community, UsuariaCommunity, ChatRoom, UserChat } = require("../models");
const Usuaria = require("../models/Usuaria");
const Notification = require("../models/notification");
const { Op } = require("sequelize");
const verifyFullProfile = require("../utils/verifyFullProfile");
const NotificationPreference = require("../models/notificationpreference");

// Obtener notificaciones.
exports.getNotifications = asyncHandler(async (req, res, next) => {
    // Se asume que la request viene con el token de usuaria que desea ver sus notificaciones
    try {
      const reqInfo = { userId: req.cognitoUserId };
      // La cantidad de notificaciones que se mostrarán en bandeja
      const cantidadNotificaciones = 20;
  
      // Verificación de campos
      if (!reqInfo.userId) {
        let error = new Error("Missing fields.");
        error.statusCode = 400;
        throw error;
      }
      
      // Se busca la usuaria que desea ver sus notificaciones
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

      const profileIsIncomplete = await verifyFullProfile(req, res, next);

      await Notification.destroy({
        where: {
          userId: user.id,
          type:"profilecheck",
        }
      });

      if (profileIsIncomplete) {
        const userPreferences = await NotificationPreference.findOne({
          where: {
            userId: user.id,
          }
        });
        if (userPreferences.actualizacionesPerfil) {
          await Notification.create({
            userId: user.id,
            content: `Todavía debes completar tus datos de perfil`,
            triggerUserId: user.id,
            section: "Todo",
            type:"profilecheck",
          });
        }
      }
  
      // Se buscan las notificaciones
      const notifications = await Notification.findAll({
        where: {
          userId: user.id,
        },
        order: [['createdAt', 'DESC']],  // Para ordenar las notificaciones desde la más nueva
        limit: cantidadNotificaciones
      });
  
      res.status(200).send({
        notifications: notifications
      });

      // Cambiar el atributo de notificaciones no han sido leídas a que sí han sido leídas.
      // Esto se hace luego de la consulta para obtener notifications, con el objetivo de que se
      // envíen las notificaciones con el atributo "seen" sin actualizar, y así, en frontend se
      // tenga la posibilidad de distinguir las notificaciones nuevas, que no habían sido leídas.
      const updates = {
        seen: true
      };
      // Se actualizan todas las notificaciones de la usuaria que tienen "seen" = false a 
      // "seen" = true
      await Notification.update(updates, {
        where: {
            userId: user.id,
            seen: false
        }
      });

      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      await Notification.destroy({
        where: {
          userId: user.id,
          createdAt: {
            [Op.lte]: fourWeeksAgo,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  });

// Obtener preferencias de notificaciones.
exports.getNotificationPreferences = asyncHandler(async (req, res, next) => {
    // Se asume que la request viene con el token de usuaria que desea ver sus preferencias
    try {
      const reqInfo = { userId: req.cognitoUserId };
  
      // Verificación de campos
      if (!reqInfo.userId) {
        let error = new Error("Missing fields.");
        error.statusCode = 400;
        throw error;
      }
      
      // Se busca la usuaria que desea ver sus preferencias de notificaciones
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
  
      // Se buscan las notificaciones
      const notificationPreferences = await NotificationPreference.findOne({
        where: {
          userId: user.id,
        },
        attributes: [
          "busquedaEmpresas",
          "publicaciones",
          "conectarComunidades",
          "actividadComunidades",
          "actualizacionesPerfil"
        ]
      });
  
      res.status(200).send({
        notificationPreferences: notificationPreferences
      });
    } catch (error) {
      next(error);
    }
  });

// Editar preferencias de notificaciones.
exports.updateNotificationPreferences = asyncHandler(async (req, res, next) => {
  try {
    // Se asume que la request viene con token de usuaria y los valores booleanos de las
    // preferencias
    const reqInfo = req.body;
    reqInfo.userId = req.cognitoUserId;

    if (!reqInfo.userId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }

    const {
      busquedaEmpresas,
      conectarComunidades,
      publicaciones,
      actividadComunidades,
      actualizacionesPerfil
    } = req.body;

    const updates = {
      busquedaEmpresas: busquedaEmpresas,
      conectarComunidades: conectarComunidades,
      publicaciones: publicaciones,
      actividadComunidades: actividadComunidades,
      actualizacionesPerfil: actualizacionesPerfil,
    }

    // Se busca la usuaria
    const user = await Usuaria.findOne({
      where: {
        id: reqInfo.userId,
      },
    });

    // Se verifica que exista la usuaria
    if (!user) {
      let error = new Error(`User not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Se actualizan las preferencias
    await NotificationPreference.update(updates, {
      where: {
          userId: user.id
      }
    });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

exports.getUnseenNotificationsNumber = asyncHandler(async (req, res, next) => {
  try {
    const reqInfo = { userId: req.cognitoUserId };
    const cantidadNotificaciones = 20;
    
    if (!reqInfo.userId) {
      let error = new Error("Missing fields.");
      error.statusCode = 400;
      throw error;
    }
    
    // Se busca la usuaria
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

    const unseenNotifications = await Notification.findAll({
      where: {
        userId: user.id,
        seen: false
      },
      limit: cantidadNotificaciones,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).send({
      unseenNotificationsNumber: unseenNotifications.length
    });
  } catch (error) {
    next(error);
  }
})