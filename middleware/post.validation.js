'use strict';
/* eslint-disable no-unused-vars */

const Joi = require('joi');

function verifyProductData(data) {
  let schema = Joi.object().keys({
    title: Joi.string().max(20).min(5).lowercase().required(),
    description: Joi.string().max(100).min(5).required(),
    price: Joi.number().required(),
    userId: Joi.number().allow(null, ''),
    categoryId: Joi.number().required()
  });
  return schema.validate(data);
}

module.exports = {
  verifyProductData
};
