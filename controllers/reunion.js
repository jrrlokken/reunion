const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Reunion = require('../models/reunion');
const Comment = require('../models/comment');

mongoose.set('debug', true);

exports.getIndex = (req, res, next) => {
  res.render('reunion/index', {
    pageTitle: 'Lokken Reunion',
    path: '/',
  });
};

exports.getReunions = (req, res, next) => {
  Reunion.find()
    .then((reunions) => {
      res.render('reunion/reunion-list', {
        reunions: reunions,
        pageTitle: 'Lokken Reunion',
        path: '/reunions',
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getReunion = (req, res, next) => {
  const reunionId = req.params.reunionId;

  return Reunion.findOne({ _id: reunionId })
    .populate({ path: 'comments', options: { sort: { createdAt: -1 } } })
    .then((reunion) => {
      res.render('reunion/reunion-detail', {
        reunion: reunion,
        pageTitle: reunion.title,
        path: '/reunions/:reunionId',
        errorMessage: null,
      });
    })
    .catch((error) => console.log(error));
};

exports.getUpcoming = (req, res, next) => {
  res.render('reunion/upcoming', {
    pageTitle: 'Lokken Reunion',
    path: '/reunions/upcoming',
    reunion: {
      title: 'Upcoming Lokken Reunion!',
      year: 2023,
      imageUrl:
        'https://images.unsplash.com/photo-1562584086-7c6b531e01c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
      description:
        "Here will be a description of the upcoming reunion.  Since we are not sure when it will take place, I'm just calling it the 2023 reunion for now :)",
    },
  });
};

exports.postComment = (req, res, next) => {
  const reunionId = req.params.reunionId;
  const commentText = req.body.commentText;

  if (!commentText) {
    return res.status(422).render('reunion/reunion-detail', {
      pageTitle: foundReunion.title,
      path: '/reunions/:reunionId',
      hasError: true,
      reunion: foundReunion,
      errorMessage: 'Comment text is required.',
      validationErrors: [],
    });
  }

  Reunion.findById(reunionId)
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
    })
    .then((reunion) => {
      const now = Date.now();
      const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        text: commentText,
        reunionId: new mongoose.Types.ObjectId(reunionId),
        userId: req.user,
        createdAt: new Date(),
      });

      reunion.comments.push(comment);
      comment.save();
      reunion.save();
      console.log('Operation completed successfully');
      return res.send(JSON.stringify(reunion));
    })
    .catch((error) => {
      const newError = new Error(error);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};
