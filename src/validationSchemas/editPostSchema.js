const Joi = require("joi");

const editPostSchema = Joi.object({
    content: Joi.string().empty().required().messages({'string.empty': "Content can't be empty.", 'any.required': "Content is required."})
});

module.exports = {
  editPostSchema,
};