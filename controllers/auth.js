const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    errorMessage: [],
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })

    .catch((error) => console.log(error));
};

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((error) => {
              console.log(error);
              res.redirect('/reunions');
            });
          }
          res.redirect('/login');
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/login');
        });
    })
    .catch((error) => console.log(error));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/');
  });
};
