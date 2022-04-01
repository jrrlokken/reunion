const express = require('express');

const reunionController = require('../controllers/reunion');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, reunionController.getReunions);
router.get('/upcoming', isAuth, reunionController.getUpcoming);
router.get('/:reunionId', isAuth, reunionController.getReunion);
router.post('/comment', isAuth, reunionController.postComment);

module.exports = router;
