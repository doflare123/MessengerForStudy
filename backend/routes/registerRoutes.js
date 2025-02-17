const express = require('express');
const router = express.Router();
const authController = require('../controllers/registerController');

router.post('/register', authController.login);

module.exports = router;