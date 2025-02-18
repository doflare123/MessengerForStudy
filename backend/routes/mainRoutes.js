const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.post('/GetAllDialogs', mainController.GetDialods);
router.post('/GetAllMessages', mainController.GetMessages);
router.post('/SearchUser', mainController.SearchUser);
router.post('/SentMessege', mainController.SentMessege);

module.exports = router;