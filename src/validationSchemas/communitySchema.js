const Joi = require("joi");

const communityCreateSchema = Joi.object({
  name: Joi.string().empty().required().messages({'string.empty': "Name can't be empty.", 'any.required': "Name is required."}),
  description: Joi.string().empty().required().messages({'string.empty': "Description can't be empty.", 'any.required': "Description is required."}),
});

const communityJoinSchema = Joi.object({
  communityId: Joi.number().integer().required().messages({'any.required': "Community ID is required."}),
});

const communityUpdateSchema = Joi.object({
  name: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
});

module.exports = {
  communityCreateSchema,
  communityJoinSchema,
  communityUpdateSchema,
};
