const Joi = require("joi");

const loginSchema = Joi.object({
  mail: Joi.string().empty().required().messages({'string.empty': "Email can't be empty.", 'any.required': "Email is required."}),
  password: Joi.string().empty().required().messages({'string.empty': "Password can't be empty.", 'any.required': "Password is required."}),
});

const googleLoginSchema = Joi.object({
  code: Joi.string().empty().required().messages({'string.empty': "Code can't be empty.", 'any.required': "Code is required."}),
});

module.exports = {
  loginSchema,
  googleLoginSchema,
};
