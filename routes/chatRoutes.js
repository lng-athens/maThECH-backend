const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/generate', chatController.generateQuestionnaire);

module.exports = router;