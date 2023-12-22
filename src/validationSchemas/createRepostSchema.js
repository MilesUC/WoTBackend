const Joi = require("joi");

const createRepostSchema = Joi.object({
    newCommunityId: Joi.number().integer().required().messages({'any.required': "Community ID is required."}),
    originalPostId: Joi.number().integer().required().messages({'any.required': "originalPostId is required."}),
    repostContent: Joi.string().optional(),
});

module.exports = {
  createRepostSchema,
};