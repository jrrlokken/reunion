const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

require('dotenv').config();
const csrfProtection = csrf();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const indexRoute = require('./routes/index');
const reunionRoutes = require('./routes/reunion');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => console.log(error));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use('/reunions', reunionRoutes);
app.use(indexRoute);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(3000);
    console.log('Database connected');
  })
  .catch((error) => console.log(error));
