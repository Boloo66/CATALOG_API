'use strict';
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let model = require('../models');
let verifySignUp = require('../middleware/user.validation').verifySignUp;
let verifyLogin = require('../middleware/user.validation').verifyLogin;

async function signup(req, res) {
  try {
    const userDetails = {
      username: req.body.username.toLowerCase() || null,
      password: req.body.password || null,
      email: req.body.email.toLowerCase() || null
    };
    console.log(userDetails);

    try {
      let { error } = verifySignUp(userDetails);
      if (error) {
        return res
          .status(400)
          .send(`Error with validation: ${error.details[0].message}`);
      }

      // check db for existing user
      const isExistingUser = await model.User.findOne({
        where: { username: userDetails.username, email: userDetails.email }
      });
      if (isExistingUser) {
        return res
          .status(409)
          .send(`Account for ${userDetails.username} already exists`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userDetails.password, salt);
        const user = await model.User.create({
          username: req.body.username.toLowerCase(),
          password: hashedPassword,
          email: req.body.email.toLowerCase()
        })
          .then((user) => {
            res.status(201).json({
              message: `Account for ${user.username} was created successfully`,
              userDetails: {
                username: user.username.toLowerCase(),
                email: user.email.toLowerCase(),
                id: user.id
              }
            });
          })
          .catch((err) => {
            res
              .status(401)
              .send(
                'Could not create user account, Choose another username or email.'
              );
          });
      }
    } catch (err) {
      return res.status(400).send('Authentication failed. Check entries again');
    }
  } catch (err) {
    res.status(400).send('Enter Username, email and Password fields.');
  }
}

async function login(req, res) {
  const userDetails = {
    username: req.body.username,
    password: req.body.password
  };

  try {
    const { error } = verifyLogin(userDetails);
    if (error) {
      return res.status(401).send('check username or password entries again.');
    }
    // compare password

    // check for user in db and compare the passwords
    model.User.findOne({ where: { username: req.body.username } })
      .then(async (user) => {
        const isCorrectPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isCorrectPassword) {
          return res.status(401).send('Username or Password is incorrect');
        }
        // perform operations on header and return a 200
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY
        );
        res.header('Authorization', token);
        return res.status(200).json({
          message: `${user.username} is signed in.`,
          token
        });
      })
      .catch((err) => {
        res.status(401).send('Username or Password is incorrect');
      });
    //if user exist return 200 response
  } catch (err) {
    res.status(401).send('check username or password entries again.');
  }
}

module.exports = {
  signup,
  login
};
