const mongoose = require('mongoose');
const Pusher = require('pusher');

const Session = require('../models/session');
const Reunion = require('../models/reunion');
const Comment = require('../models/comment');
const User = require('../models/user');

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APPID,
//   key: process.env.PUSHER_KEY,
//   secret: process.env.PUSHER_SECRET,
//   cluster: process.env.PUSHER_CLUSTER,
// });
exports.getChat = async (req, res, next) => {
  const sessions = await Session.find({ 'session.isLoggedIn': true });

  res.render('chat', {
    pageTitle: 'Chat',
    path: '/chat',
    sessions: sessions,
  });
};
exports.postChat = (req, res, next) => {};
