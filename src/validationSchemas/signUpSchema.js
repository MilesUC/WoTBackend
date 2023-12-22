const Joi = require("joi");

const signUpSchema = Joi.object({
  name: Joi.string().empty().required().messages({'string.empty': "Name can't be empty.", 'any.required': "Name is required."}),
  lastName: Joi.string().empty().required().messages({'string.empty': "Last name can't be empty.", 'any.required': "Last name is required."}),
  mail: Joi.string().email().empty().required().messages({'string.email': "Email address is not valid.", 'string.empty': "Email can't be empty.", 'any.required': "Email is required."}),
  password: Joi.string().min(4).empty().required().messages({'string.min': "Password requires at least 4 characters.", 'string.empty': "Password can't be empty.", 'any.required': "Password is required."}),
});


// const signUpAdminSchema = Joi.object({
//   nombre: Joi.string().required(),
//   rut: Joi.string().required(),
//   password: Joi.string().required(),
//   email: Joi.string().email().required(),
//   id_rol: Joi.number().required(),
// });


module.exports = {
  signUpSchema,
//   signUpAdminSchema,
};
