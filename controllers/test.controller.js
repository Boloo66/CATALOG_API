'use strict';
/* eslint-disable no-unused-vars */
const models = require('../models');

async function test(req, res) {
  // res.send('Testing the microphone');
  const userId = req.userAuth.userId;

  const userProducts = await models.Product.findAll({
    where: { userId },
    include: [{ model: models.Category, attributes: ['id', 'name'] }]
  });
  res.status(200).json(userProducts);
}
/* eslint-enable no-unused-vars */
module.exports = { test };
