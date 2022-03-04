module.exports = (req, res, next) => {
  const id = process.env.ADMIN_ID;
  if (!req.session) {
    return res.redirect('/login');
  } else if (req.session.user._id.toString() !== id) {
    return res.redirect('/login');
  }
  next();
};
