const Joi = require("joi");

const editProfilePreferencesSchema = Joi.object({
  busquedaEmpresas: Joi.bool().allow(null, ''),
  conectarComunidades: Joi.bool().allow(null, ''),
  publicaciones: Joi.bool().allow(null, ''),
  actividadComunidades: Joi.bool().allow(null, ''),
  actualizacionesPerfil: Joi.bool().allow(null, ''),
});


module.exports = {
  editProfilePreferencesSchema,
};