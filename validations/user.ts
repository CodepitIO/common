import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  username: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().min(3).max(100).required(),
  password: Joi.string().min(1).max(100).required(),
  country: Joi.object({
    value: Joi.string().min(1).max(100).required(),
    label: Joi.string().min(1).max(100).required(),
    imageUrl: Joi.string().uri().required(),
  }),
});

export const loginSchema = Joi.object({
  emailOrUsername: Joi.string().min(1).max(100).required(),
  password: Joi.string().min(1).max(100).required(),
});