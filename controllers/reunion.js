exports.getIndex = (req, res, next) => {
  // Reunion.find()
  //   .then((reunions) => {
  //     res.render('reunion/index', {
  //       reunions: reunions,
  //       pageTitle: 'Lokken Reunion',
  //       path: '/',
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  res.render('reunion/index', {
    pageTitle: 'Lokken Reunion',
    path: '/',
  });
};

exports.getUpcoming = (req, res, next) => {
  res.render('reunion/upcoming', {
    pageTitle: 'Lokken Reunion',
    path: '/upcoming',
  });
};
