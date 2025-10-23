const Joi = require('joi');

exports.signupSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName:  Joi.string().trim().min(1).max(100).required(),
  phone:     Joi.string().trim().min(3).max(100).required(),
  email:     Joi.string().trim().email().max(320).required(),
  birthday:  Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  tiktok:    Joi.string().uri().allow('', null),
  instagram: Joi.string().uri().allow('', null),
  googleIdToken: Joi.string().allow('', null),
});

exports.googleLoginSchema = Joi.object({
  idToken: Joi.string().required(),
});

exports.emailStartSchema = Joi.object({
  email: Joi.string().trim().email().max(320).required(),
});

exports.emailVerifySchema = Joi.object({
  email: Joi.string().trim().email().max(320).required(),
  code:  Joi.string().trim().length(6).required(),
});
