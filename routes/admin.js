const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/reunions', isAdmin, adminController.getReunions);

router.get('/add-reunion', isAdmin, adminController.getAddReunion);
router.post(
  '/add-reunion',
  isAdmin,
  [
    body('title')
      .isString()
      .isLength({ min: 3, max: 50 })
      .trim()
      .withMessage('Title must be 3-50 characters'),
    body('year')
      .isInt()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be a 4 digit integer'),
    body('description')
      .isLength({ min: 3, max: 1000 })
      .trim()
      .withMessage('Description must be 3 - 1000 characters'),
  ],
  isAdmin,
  adminController.postAddReunion
);

router.get('/edit-reunion/:reunionId', isAdmin, adminController.getEditReunion);
router.post(
  '/edit-reunion',
  isAdmin,
  body('title')
    .isString()
    .isLength({ min: 3, max: 50 })
    .trim()
    .withMessage('Title must be 3-50 characters'),
  body('year').isInt().withMessage('Year must be a 4 digit integer'),
  body('description')
    .isLength({ min: 3, max: 1000 })
    .trim()
    .withMessage('Description must be 3 - 1000 characters'),
  isAdmin,
  adminController.postEditReunion
);

router.post('/delete-reunion', isAdmin, adminController.postDeleteReunion);

module.exports = router;
