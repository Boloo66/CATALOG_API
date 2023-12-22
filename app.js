/* eslint-disable no-unused-vars */

const express = require('express');
const verifyToken = require('./middleware/user.auth');
const userRoute = require('./routes/users');
const productRoute = require('./routes/products');
const testRoute = require('./routes/test');
/* eslint-enable no-unused-vars */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', verifyToken, (req, res) => {
  res.send('Now you see me');
});
app.use('/products', verifyToken, productRoute);
app.use('/users', userRoute);
app.use('/test', verifyToken, testRoute);
module.exports = app;
