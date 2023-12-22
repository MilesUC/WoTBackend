const Joi = require("joi");

const likePostSchema = Joi.object({
  postId: Joi.number().required().messages({'number.empty':'Post id can\'t be empty'}),
});

module.exports = {
  likePostSchema,
};