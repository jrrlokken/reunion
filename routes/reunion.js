const express = require('express');

const reunionController = require('../controllers/reunion');
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', reunionController.getIndex);
router.get('/upcoming', reunionController.getUpcoming);

module.exports = router;
