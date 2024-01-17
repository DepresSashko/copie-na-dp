// Import mongoose
const mongoose = require('mongoose');

// Create a song schema
const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  genre: String,
  duration: Number,
  data: Buffer,
  contentType: String
});

// Export the song model
module.exports = mongoose.model('Song', songSchema);
