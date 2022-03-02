const express = require('express');

const reunionController = require('../controllers/reunion');
// const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', reunionController.getIndex);

module.exports = router;
