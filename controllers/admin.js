const Reunion = require('../models/reunion');

exports.getReunions = (req, res, next) => {
  Reunion.find()
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
  console.log(req.session);
  res.render('admin/edit-reunion', {
    pageTitle: 'Add Reunion',
    path: '/admin/add-reunion',
    editing: false,
  });
};

exports.postAddReunion = (req, res, next) => {
  const { title, year, imageUrl, description } = req.body;
  const reunion = new Reunion({
    title: title,
    year: year,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  reunion
    .save()
    .then((result) => {
      console.log('Created Reunion');
      res.redirect('/reunions');
    })
    .catch((error) => console.log(error));
};

exports.postDeleteReunion = (req, res, next) => {
  const reunionId = req.body.reunionId;
  Reunion.findByIdAndRemove(reunionId)
    .then(() => {
      console.log('Reunion Deleted');
      res.redirect('/admin/reunions');
    })
    .catch((error) => console.log(error));
};
