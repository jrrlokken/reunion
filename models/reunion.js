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
  imageUrls: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Reunion', reunionSchema);