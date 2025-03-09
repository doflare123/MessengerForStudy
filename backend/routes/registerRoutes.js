const express = require('express');
const router = express.Router();
const authController = require('../controllers/registerController');

router.post('/validEmail', authController.Validation);
router.post('/register', authController.Register);

module.exports = router;