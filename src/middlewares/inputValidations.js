const { signUpSchema } = require("../validationSchemas/signUpSchema");
const { loginSchema, googleLoginSchema } = require("../validationSchemas/loginSchema");
const { changePasswordSchema } = require("../validationSchemas/chagePasswordSchema");
const { editProfileSchema } = require("../validationSchemas/editProfileSchema");
const { companyNameSearchSchema } = require("../validationSchemas/companyNameSearchSchema");
const {
  communityCreateSchema,
  communityJoinSchema,
  communityUpdateSchema,
} = require("../validationSchemas/communitySchema");
const { createPostSchema } = require("../validationSchemas/createPostSchema");
const { likePostSchema } = require("../validationSchemas/likePostSchema");
const { getCommunityPostsSchema } = require("../validationSchemas/getCommunityPostsSchema");
const { getFeedPostsSchema } = require("../validationSchemas/getFeedPostsSchema");
const { editPostSchema } = require("../validationSchemas/editPostSchema");
const { commentPostSchema } = require("../validationSchemas/commentPostSchema");
const { communityNameSearchSchema } = require("../validationSchemas/communityNameSearchSchema");
const { createRepostSchema } = require("../validationSchemas/createRepostSchema");
const { editProfilePreferencesSchema } = require("../validationSchemas/editProfilePreferencesSchema");

//   confirmResetPasswordSchema,
//   resetPasswordSchema,
// } = require("../validationSchemas/resetPasswordSchema");
// const {
//   changePasswordSchema,
// } = require("../validationSchemas/changePasswordSchema");

// const {
//   activateDeactivateSchema,
// } = require("../validationSchemas/activateDeactiveCompanySchema");

// const {
//   updateCompanySchema,
// } = require("../validationSchemas/updateCompanySchema");

// const { updateUserSchema } = require("../validationSchemas/updateUserSchema");

// const { updateAdminSchema } = require("../validationSchemas/updateAdminSchema");

function handleValidationError(res, error) {
  return res.status(400).json({
    status: 400,
    message: "Validation error",
    error: error.details.map((err) => err.message),
  });
}

function validateLoginSchema(req, res, next) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateGoogleLoginSchema(req, res, next) {
  const { error } = googleLoginSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateSignUpSchema(req, res, next) {
  const { error } = signUpSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateCommunityCreateSchema(req, res, next) {
  const { error } = communityCreateSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateCommunityJoinSchema(req, res, next) {
  const { error } = communityJoinSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateCommunityUpdateSchema(req, res, next) {
  const { error } = communityUpdateSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateChangePasswordSchema(req, res, next) {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateEditProfileSchema(req, res, next) {
  const { error } = editProfileSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateLikePostSchema(req, res, next) {
  const { error } = likePostSchema.validate({postId: req.params.postId});
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateCompanyNameSearchSchema(req, res, next) {
    const { error } = companyNameSearchSchema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }
    next();
}

function validateEditPostSchema(req, res, next) {
  const { error } = editPostSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateCreatePostSchema(req, res, next) {
  const { error } = createPostSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateGetCommunityPostsSchema(req, res, next) {
  const { error } = getCommunityPostsSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateGetFeedPostsSchema(req, res, next) {
  const { error } = getFeedPostsSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateCommentPostSchema(req, res, next) {
  const { error } = commentPostSchema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
}

function validateCommunityNameSearchSchema(req, res, next) {
    const { error } = communityNameSearchSchema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }
    next();
}

function validateCreateRepostSchema(req, res, next) {
    const { error } = createRepostSchema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }
    next();
}

function validateEditProfilePreferencesSchema(req, res, next) {
    const { error } = editProfilePreferencesSchema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }
    next();
}

module.exports = {
  validateLoginSchema,
  validateSignUpSchema,
  validateGoogleLoginSchema,
  validateCommunityCreateSchema,
  validateCommunityJoinSchema,
  validateCommunityUpdateSchema,
  validateChangePasswordSchema,
  validateEditProfileSchema,
  validateLikePostSchema,
  validateCompanyNameSearchSchema,
  validateEditPostSchema,
  validateCreatePostSchema,
  validateGetCommunityPostsSchema,
  validateGetFeedPostsSchema,
  validateCommentPostSchema,
  validateCommunityNameSearchSchema,
  validateCreateRepostSchema,
  validateEditProfilePreferencesSchema,
  //   validateResetPasswordSchema,
  //   validateConfirmResetPasswordSchema,
  //   validateChangePasswordSchema,
  //   validateActivateDeactiveSchema,
  //   validateUpdateCompanySchema,
  //   validateRegisterCompanySchema,
  //   validateUpdateUserSchema,
  //   validateRegisterAdminSchema,
  //   validateUpdateAdminSchema,
};
