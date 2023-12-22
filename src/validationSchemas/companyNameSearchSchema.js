const Joi = require("joi");

const companyNameSearchSchema = Joi.object({
  nombre: Joi.string().empty().required().messages({'string.empty': "nombre can't be empty.", 'any.required': "nombre is required."}),
});

module.exports = {
  companyNameSearchSchema,
};