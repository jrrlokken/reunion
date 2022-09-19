const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cloudinary = require('../util/cloudinary');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transport = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    errorMessage: null,
    userInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sign Up',
      errorMessage: errors.array()[0].msg,
      userInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
      return transport.sendMail({
        to: email,
        from: 'no-reply@lokkenreunion.com',
        subject: 'Successful signup at LokkenReunion.com',
        html: `
          <p>Thank you for signing up with LokkenReunion.com!</p>
          <p>Come join the reunion 😄</p>
        `,
      });
    })
    .catch((error) => console.log(error));
};

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    validationErrors: [],
    userInput: {
      email: '',
      password: '',
    },
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      userInput: {
        email,
        password,
      },
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          validationErrors: [],
          userInput: {
            email,
            password,
          },
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((error) => {
              res.redirect('/reunions');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            validationErrors: errors.array(),
            userInput: {
              email: email,
              password: password,
            },
          });
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');
        transport.sendMail({
          to: req.body.email,
          from: 'no-reply@lokkenreunion.com',
          subject: 'Password Reset',
          html: `
          <p>Hello,</p>

          <p>You requested a password reset for your account at lokkenreunion.com</p>
          <p>Click this <a href="https://www.lokkenreunion.com/reset/${token}">link</a> to set a new password.</p>
          <p>Please contact <a href="mailto:admin@lokkenreunion.com">the site administrator</a> for assistance.</p>
          <br>
          <hr>
          `,
        });
      })
      .catch((error) => console.log(error));
  });
};

exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'Reset Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((error) => console.log(error));
};

exports.postResetPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((error) => console.log(error));
};

exports.getUserProfile = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  User.findById(req.session.user._id).then((user) => {
    if (!user) {
      return res.redirect('/login');
    }

    res.render('auth/profile', {
      path: '/user-profile',
      pageTitle: 'Profile',
      errorMessage: null,
      hasError: false,
      editing: false,
      validationErrors: [],
      user,
    });
  });
};

exports.getEditProfile = (req, res, next) => {
  // const editMode = req.query.edit;
  // if (!editMode) {
  //   return res.redirect('/user-profile');
  // }

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  User.findById(req.session.user._id).then((user) => {
    if (!user) {
      return res.redirect('/login');
    }

    res.render('auth/edit-profile', {
      pageTitle: 'Edit Profile',
      path: '/edit-profile',
      editing: true,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      user: user,
    });
  });
};

exports.postEditProfile = async (req, res, next) => {
  const updatedName = req.body.name;
  const updatedAvatar = req.file;
  const updatedAboutMe = req.body.about_me;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-reunion', {
      pageTitle: 'Edit Reunion',
      path: '/admin/edit-reunion',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        year: updatedYear,
        description: updatedDescription,
        _id: reunionId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const uploadedImage = [];
  if (updatedAvatar) {
    const newPath = await upload(updatedAvatar.path, {
      folder: 'reunions',
      format: 'webp',
    });
    console.log(newPath);
    uploadedImage.push(newPath.secure_url);
    fs.unlinkSync(image.path);
  }

  User.findById(req.session.user._id).then((user) => {
    user.name = updatedName;
    user.avatar = uploadedImage;
    user.about_me = updatedAboutMe;
    return user
      .save()
      .then((result) => {
        console.log('Updated Profile');
        res.redirect('/user-profile');
      })
      .catch((error) => {
        const newError = new Error(error);
        newError.httpStatusCode = 500;
        return next(newError);
      });
  });
};
