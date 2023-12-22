const Joi = require("joi");

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().empty().required().messages({'string.empty': "Old password can't be empty.", 'any.required': "Old password is required."}),
  newPassword: Joi.string().min(4).empty().required().messages({'string.min': "Password requires at least 4 characters.", 'string.empty': "New password can't be empty.", 'any.required': " New password is required."}),
});

module.exports = {
  changePasswordSchema,
};
