const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/reunions', adminController.getReunions);
router.get('/add-reunion', isAuth, adminController.getAddReunion);
router.post('/add-reunion', isAuth, adminController.postAddReunion);

router.post('/delete-reunion', isAuth, adminController.postDeleteReunion);

module.exports = router;
