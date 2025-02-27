// models//user.js
const {Schema, model} = require("mongoose");
const Joi = require('joi');

const userSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String,
    avatarURL: String, 
    verify: {
      type: Boolean, 
      default: false,
    },
    verificationCode: {
      type: String,
      required: [true, 'Verify token is required'],
    }
  }, {versionKey: false, timestamps: true});

  userSchema.post("save", (error, data, next) => {
    error.status = 400;
    console.log(error);
    next();
})

  const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string().required(),
  })

  const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })

  const emailSchema = Joi.object({
    email: Joi.string().required,
  })

  const schemas = {
    registerSchema,
    loginSchema,
    emailSchema
  }

  const User = model("user", userSchema);

  module.exports = {
    User,
    schemas,
};