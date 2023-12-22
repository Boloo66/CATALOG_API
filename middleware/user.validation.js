'use strict';
/* eslint-disable no-unused-vars */

const Joi = require('joi');

function verifySignUp(data) {
  let schema = Joi.object().keys({
    username: Joi.string().max(20).min(5).lowercase().required(),
    email: Joi.string().max(20).min(5).lowercase().required().email(),
    password: Joi.string().max(100).min(5).required()
  });
  return schema.validate(data);
}

function verifyLogin(data) {
  let schema = Joi.object().keys({
    username: Joi.string().max(20).min(5).lowercase().required(),
    password: Joi.string().max(100).min(5).required()
  });
  return schema.validate(data);
}

module.exports = {
  verifySignUp,
  verifyLogin
};
