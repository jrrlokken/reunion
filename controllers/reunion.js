const { ObjectId } = require('mongodb');

const Reunion = require('../models/reunion');

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
  Reunion.findById(reunionId)
    .then((reunion) => {
      res.render('reunion/reunion-detail', {
        reunion: reunion,
        pageTitle: reunion.title,
        path: '/reunions',
      });
    })
    .catch((error) => console.log(error));
};

exports.getUpcoming = (req, res, next) => {
  res.render('reunion/upcoming', {
    pageTitle: 'Lokken Reunion',
    path: '/reunions/upcoming',
    reunion: {
      title: 'Superfun Reunion!',
      year: 2023,
      imageUrl:
        'https://images.unsplash.com/photo-1559014157-33373e15e6ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      description:
        'A description of the upcoming reunion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  });
};
