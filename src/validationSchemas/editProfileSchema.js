const Joi = require("joi");

const editProfileSchema = Joi.object({
  name: Joi.string().allow(null, ''),
  lastName: Joi.string().allow(null, ''),
  mail: Joi.string().allow(null, ''),
  rut: Joi.string().allow(null, ''),
  celular: Joi.string().allow(null, ''),
  // id_rol: Joi.number().allow(null, ''),
  universidad: Joi.string().allow(null, ''),
  postgrado: Joi.string().allow(null, ''),
  id_cargo: Joi.number().allow(null, ''),
  empresa_actual: Joi.string().allow(null, ''),
  id_industria_actual: Joi.number().allow(null, ''),
  id_cargo_adicional: Joi.number().allow(null, ''),
  id_industria_adicional: Joi.number().allow(null, ''),
  empresa_adicional: Joi.string().allow(null, ''),
  id_anios_experiencia: Joi.number().allow(null, ''), // No permite null
  experienciaDirectorios: Joi.boolean().allow(null, ''), // No permite null
  altaDireccion: Joi.boolean().allow(null, ''), // No permite null
  intereses: Joi.string().allow(null, ''), // No permite null
  brief: Joi.string().allow(null, ''),
  redesSociales: Joi.string().allow(null, ''),
  id_personalidad: Joi.number().allow(null, ''),
  factor: Joi.string().allow(null, ''),
  nombrePuebloOriginario: Joi.string().allow(null, ''),
  id_region_con_compromiso: Joi.number().allow(null, ''),
  id_pais_domicilio: Joi.number().allow(null, ''),
  region_domicilio: Joi.number().allow(null, ''),
  id_posibilidad_cambiarse_region: Joi.number().allow(null, ''),
  disposicion_viajar: Joi.boolean().allow(null, ''),
  id_modalidad: Joi.number().allow(null, ''),
  id_jornada: Joi.number().allow(null, ''),
  id_conocio_wot: Joi.number().allow(null, ''),
  declaracion: Joi.bool().allow(null, ''),
  profesiones: Joi.array().allow(null, ''),
  industriasExperiencia: Joi.array().allow(null, ''),
  disponibilidad: Joi.array().allow(null, ''),
  areasExperiencia: Joi.array().allow(null, ''),
  competencias: Joi.array().allow(null, ''),
  idiomas: Joi.array().allow(null, ''),
  contactos: Joi.array().allow(null, ''),
});


module.exports = {
  editProfileSchema,
};
