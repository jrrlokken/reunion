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
  const { title, year, imageUrls, description } = req.body;
  const reunion = new Reunion({
    title: title,
    year: year,
    description: description,
    imageUrls: imageUrls,
    userId: req.user,
  });
  reunion
    .save()
    .then((result) => {
      console.log('Created Reunion', reunion);
      res.redirect('/reunions');
    })
    .catch((error) => console.log(error));
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
        reunion: reunion,
      });
    })
    .catch((error) => console.log(error));
};

exports.postEditReunion = (req, res, next) => {
  const reunionId = req.body.reunionId;
  const updatedTitle = req.body.title;
  const updatedYear = req.body.year;
  const updatedImageUrls = req.body.imageUrls;
  const updatedDescription = req.body.description;

  // console.log(req.body);

  Reunion.findById(reunionId)
    .then((reunion) => {
      reunion.title = updatedTitle;
      reunion.year = updatedYear;
      reunion.imageUrls = updatedImageUrls;
      reunion.description = updatedDescription;
      return reunion.save();
    })
    .then((result) => {
      console.log('Updated Reunion');
      res.redirect('/admin/reunions');
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
