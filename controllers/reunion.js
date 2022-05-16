const mongoose = require('mongoose');

const Reunion = require('../models/reunion');
const Comment = require('../models/comment');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

exports.getIndex = (req, res, next) => {
  res.render('reunion/index-slideshow', {
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
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'userId' },
    })
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

exports.getUpcoming = async (req, res, next) => {
  const reunionId = process.env.UPCOMING_REUNION_ID;

  return Reunion.findOne({ _id: reunionId })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'userId' },
    })
    .then((reunion) => {
      res.render('reunion/reunion-detail', {
        reunion: reunion,
        pageTitle: reunion.title,
        path: '/reunions/upcoming',
        errorMessage: null,
      });
    })
    .catch((error) => console.log(error));
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
      pusher
        .trigger(`${reunionId}`, 'comment', {
          message: comment,
        })
        .catch((error) => console.error(error));

      Comment.findOne(comment._id)
        .populate('userId')
        .then((comment) => {
          return res.send(JSON.stringify(comment));
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => {
      const newError = new Error(error);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};
