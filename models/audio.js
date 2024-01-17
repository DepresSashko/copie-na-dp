const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true,
  },
  path: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
    // You can specify additional validations for the note field if needed
  },
  // Add more fields as neededS
});


const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;