module.exports = (req, res, next) => {
  const id = '62574023ffe0b6532849856e';
  if (!req.session) {
    console.log('No session!');
    return res.redirect('/login');
  } else if (req.session.user._id.toString() !== id.toString()) {
    // console.log(req.session.user._id.toString(), id.toString());
    console.log("IDs don't match :(");
    return res.redirect('/login');
  }
  next();
};
