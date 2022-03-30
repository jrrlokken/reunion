const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
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

commentSchema.static('findbyReunion', async function (reunionId) {
  return this.find({ reunionId });
});

// let comments = await Comment.findById({ commentId });

// console.log(comments);
module.exports = mongoose.model('Comment', commentSchema);
