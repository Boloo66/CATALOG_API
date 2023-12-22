const router = require('express').Router();
const userController = require('../controllers/users.controller');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
