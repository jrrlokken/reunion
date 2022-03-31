const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reunions: [{ type: Schema.Types.ObjectId, ref: 'Reunion' }],
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);
