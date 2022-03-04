const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/reunions', adminController.getReunions);
router.get('/add-reunion', isAdmin, adminController.getAddReunion);
router.post('/add-reunion', isAdmin, adminController.postAddReunion);

router.post('/delete-reunion', isAdmin, adminController.postDeleteReunion);

module.exports = router;
