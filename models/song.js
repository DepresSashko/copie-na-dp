const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  audio: { type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
