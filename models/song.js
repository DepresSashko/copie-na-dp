const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audioFilename: String, // Store the filename of the associated audio file
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
