const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.patch('/ChangeAvatar', accountController.ChangeAvatar);
router.patch('/ChangeUserName', accountController.ChangeUserName);
router.patch('/PswdChng', accountController.PswdChng);
router.patch('/PswdChngAcc', accountController.PswdChngAcc);
router.delete('/DeleteAccount', accountController.DeleteAccount);
router.post('/RefreshToken', accountController.RefreshToken);

module.exports = router;

