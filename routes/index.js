const express = require('express');

const reunionController = require('../controllers/reunion');

const router = express.Router();

router.get('/', reunionController.getIndex);

module.exports = router;
