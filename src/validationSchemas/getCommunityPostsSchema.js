const Joi = require("joi");

const getCommunityPostsSchema = Joi.object({
    communityId: Joi.number().integer().required().messages({'any.required': "Community ID is required."}),
    mode: Joi.string().empty().required().messages({'string.empty': "Viewing mode can't be empty.", 'any.required': "Viewing mode is required."}),
    scrollLevel: Joi.number().min(1).empty().required().messages({'number.empty': "Scroll level number can't be empty.", 'any.required': "scrollLevel is required.", 'number.min': "Scroll level number must be higher than 0"}),
});

module.exports = {
  getCommunityPostsSchema,
};