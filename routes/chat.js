const express = require('express');

const chatController = require('../controllers/chat');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/chat', isAuth, chatController.getChat);
router.post('/chat', isAuth, chatController.postChat);

module.exports = router;
