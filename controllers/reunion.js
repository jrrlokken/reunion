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
      title: 'Upcoming Reunion',
      imageUrl: '',
      description: 'A description of the upcoming reunion',
    },
  });
};
