const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reunionId: {
    type: Schema.Types.ObjectId,
    ref: 'Reunion',
    required: true,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
