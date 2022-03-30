const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reunionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{ text: String, date: Date }],
});

module.exports = mongoose.model('Reunion', reunionSchema);
