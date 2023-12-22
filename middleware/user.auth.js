'use strict';
/* eslint-disable no-unused-vars */

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  console.log(req.headers.authentication);

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Authentication failed. Access denied.');
    }
    let verified = jwt.verify(token, process.env.SECRET_KEY);
    req.userAuth = verified;
    next();
  } catch (err) {
    return res.status(401).send('Authentication failed. Access denied.');
  }
}

module.exports = verifyToken;
