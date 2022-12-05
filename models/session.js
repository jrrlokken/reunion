const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  _id: String,
  expires: Date,
  session: {
    cookie: {
      originalMaxAge: Number || null,
      expires: Date || null,
      secure: Boolean || null,
      httpOnly: Boolean || null,
      domain: String || null,
      path: String || null,
      sameSite: String || null,
    },
    csrfSecret: String || null,
    isLoggedIn: Boolean || null,
    user: {
      _id: String || null,
      email: String || null,
      password: String || null,
      resetToken: String || null,
      resetTokenExpiration: Date || null,
      about_me: String || null,
      name: String || null,
      avatar: Array || null,
    },
  },
});

module.exports = mongoose.model('Session', sessionSchema);
