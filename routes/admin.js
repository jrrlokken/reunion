const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/reunions', isAuth, adminController.getReunions);

router.get('/add-reunion', isAuth, adminController.getAddReunion);
router.post(
  '/add-reunion',
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
    // body('imageUrls').isURL().withMessage('Image URL must be a valid URL'),
    body('description')
      .isLength({ min: 3, max: 400 })
      .trim()
      .withMessage('Description must be 3 - 400 characters'),
  ],
  isAuth,
  adminController.postAddReunion
);

router.get('/edit-reunion/:reunionId', isAuth, adminController.getEditReunion);
router.post(
  '/edit-reunion',
  body('title')
    .isString()
    .isLength({ min: 3, max: 50 })
    .trim()
    .withMessage('Title must be 3-50 characters'),
  body('year').isInt().withMessage('Year must be a 4 digit integer'),
  // body('imageUrls').isURL().withMessage('Image URL must be a valid URL'),
  body('description')
    .isLength({ min: 3, max: 400 })
    .trim()
    .withMessage('Description must be 3 - 400 characters'),
  isAuth,
  adminController.postEditReunion
);

router.post('/delete-reunion', isAuth, adminController.postDeleteReunion);

module.exports = router;
