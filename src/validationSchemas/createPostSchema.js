const Joi = require("joi");

const createPostSchema = Joi.object({
    communityId: Joi.number().integer().required().messages({'any.required': "Community ID is required."}),
    content: Joi.string().optional(),
    multimedia: Joi.any().optional(),
});

module.exports = {
  createPostSchema,
};