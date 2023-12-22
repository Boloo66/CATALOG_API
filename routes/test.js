'use strict';

const router = require('express').Router();
const testController = require('../controllers/test.controller').test;

router.get('/associations', testController);

module.exports = router;
