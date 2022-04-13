const { validationResult } = require('express-validator');

const Reunion = require('../models/reunion');
const uploadImages = require('../util/file');

let uploadedImages = [];

exports.getReunions = (req, res, next) => {
  Reunion.find({ userId: req.user._id })
    .populate()
    .then((reunions) => {
      res.render('admin/reunions', {
        reunions: reunions,
        pageTitle: 'Admin',
        path: '/admin/reunions',
      });
    })
    .catch((error) => console.log(error));
};

exports.getAddReunion = (req, res, next) => {
  res.render('admin/edit-reunion', {
    pageTitle: 'Add Reunion',
    path: '/admin/add-reunion',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    loading: false,
  });
};

exports.postAddReunion = (req, res, next) => {
  const title = req.body.title;
  const year = req.body.year;
  const images = req.files;
  const description = req.body.description;

  if (!images) {
    return res.status(422).render('admin/edit-reunion', {
      pageTitle: 'Add Reunion',
      path: '/admin/add-reunion',
      editing: false,
      hasError: true,
      reunion: {
        title: title,
        year: year,
        description: description,
      },
      errorMessage: 'A valid image is required',
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-reunion', {
      pageTitle: 'Add Reunion',
      path: '/admin/add-reunion',
      editing: false,
      hasError: true,
      reunion: {
        title: title,
        year: year,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  uploadImages(req.files).then(() => {
    const reunion = new Reunion({
      title: title,
      year: year,
      images: uploadedImages,
      description: description,
      userId: req.user,
    });
    return reunion
      .save()
      .then((result) => {
        console.log('Added Reunion');
        res.redirect('/admin/reunions');
      })
      .catch((error) => {
        const newError = new Error(error);
        newError.httpStatusCode = 500;
        return next(newError);
      });
  });
};

exports.getEditReunion = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/reunions');
  }
  const reunionId = req.params.reunionId;
  Reunion.findById(reunionId)
    .then((reunion) => {
      if (!reunion) {
        return res.redirect('/reunions');
      }

      res.render('admin/edit-reunion', {
        pageTitle: 'Edit Reunion',
        path: '/admin/edit-reunion',
        editing: editMode,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        reunion: reunion,
      });
    })
    .catch((error) => {
      const newError = new Error(error);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.postEditReunion = (req, res, next) => {
  const reunionId = req.body.reunionId;
  const updatedTitle = req.body.title;
  const updatedYear = req.body.year;
  const updatedImages = req.files;
  const updatedDescription = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-reunion', {
      pageTitle: 'Edit Reunion',
      path: '/admin/edit-reunion',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        year: updatedYear,
        description: updatedDescription,
        _id: reunionId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Reunion.findById(reunionId)
    .then((reunion) => {
      if (reunion.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/admin/reunions');
      }
      if (updatedImages) {
        uploadImages(req.files)
          .then((reunion.images = [...reunion.images, ...uploadedImages]))
          .catch((error) => console.error(error));
      }
      reunion.title = updatedTitle;
      reunion.year = updatedYear;
      reunion.description = updatedDescription;

      return reunion.save().then((result) => {
        console.log('Updated Reunion');
        res.redirect('/admin/reunions');
      });
    })
    .catch((error) => {
      const newError = new Error(error);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.postDeleteReunion = (req, res, next) => {
  const reunionId = req.body.reunionId;
  Reunion.findById({ _id: reunionId, userId: req.user._id })
    .then((reunion) => {
      if (!reunion) {
        return next(new Error('Reunion not found'));
      }
      // fileHelper.deleteFile(reunion.images[0].path);
      return Reunion.deleteOne({ _id: reunionId, userId: req.user._id });
    })
    .then(() => {
      console.log('Reunion Deleted');
      res.redirect('/admin/reunions');
    })
    .catch((error) => {
      const newError = new Error(error);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};
