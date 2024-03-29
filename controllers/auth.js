const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const cloudinary = require('../util/cloudinary');
const sib = require('sib-api-v3-sdk');
const { validationResult } = require('express-validator');

const User = require('../models/user');

// Mailer setup
const client = sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
const emailAPI = new sib.TransactionalEmailsApi();

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
        confirmPassword: confirmPassword,
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
	console.log(process.env.BASE_URL);
      const content = `
        <p>Thank you for signing up with LokkenReunion.com!
        Updates will be posted as they become available.
        Come join the reunion!</p>
      `;
      return emailAPI.sendTransacEmail({
        sender: { name: 'Lokken Reunion', email: 'no-reply@lokkenreunion.com' },
        to: [{ email: email }],
        subject: 'Successful signup at LokkenReunion.com',
        textContent: `Thank you for signing up at LokkenReunion.com! Updates will be posted as they become available. Come join the reunion :)`,
        htmlContent: content,
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
  req.session.destroy(() => {
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

        return emailAPI.sendTransacEmail({
          sender: {
            name: 'Lokken Reunion',
            email: 'no-reply@lokkenreunion.com',
          },
          to: [{ email: req.body.email }],
          subject: 'Password Reset',
          textContent: `Hello, You requested a password reset for your account at lokkenreunion.com. Click this link to set a new password: https://www.lokkenreunion.com/reset/${token}. Please contact the site administrator if you require assistance.`,
          htmlContent: `<p>Hello,</p><p>You requested a password reset for your account at lokkenreunion.com</p><p>Click this <a href="https://www.lokkenreunion.com/reset/${token}">link</a> to set a new password.</p><p>Please contact <a href="mailto:admin@lokkenreunion.com">the site administrator</a> for assistance.</p><br><hr>`,
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
      user: user,
    });
  });
};

exports.getEditProfile = (req, res, next) => {
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
  const updatedAvatar = req.files;
  const updatedAboutMe = req.body.about_me;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-profile', {
      pageTitle: 'Edit Profile',
      path: '/edit-profile',
      editing: true,
      hasError: true,
      user: {
        name: updatedName,
        about_me: updatedAboutMe,
        _id: req.session.user._id,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const uploadedImages = [];
  if (updatedAvatar.length > 0) {
    for (const image of updatedAvatar) {
      try {
        const newPath = await cloudinary.uploader.upload(image.path, {
          cloud_name: process.env.CLOUDINARY_CLOUDNAME,
          folder: 'reunions',
          format: 'webp',
        });
        uploadedImages.push(newPath.secure_url);
        fs.unlinkSync(image.path);
      } catch (error) {
        console.log(error);
      }
    }
  }

  User.findById(req.session.user._id).then((user) => {
    const image = uploadedImages.length > 0 ? uploadedImages[0] : user.avatar;
    user.name = updatedName;
    user.avatar = image;
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
