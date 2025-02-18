const express = require('express');
const router = express.Router();
const accountController = require('../controllers/AccountController');

router.post('/ChangeAvatar', accountController.ChangeAvatar);
router.post('/ChangeUsername', accountController.ChangeUsername);
router.post('/PswdChng', accountController.PswdChng);
router.post('/DeleteAccount', accountController.DeleteAccount);
router.post('/RefreshToken', accountController.RefreshToken);

module.exports = router;