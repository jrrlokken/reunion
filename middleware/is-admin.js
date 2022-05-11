module.exports = (req, res, next) => {
  const id = process.env.ADMIN_ID;
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
