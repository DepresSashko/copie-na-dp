const mongoose = require('mongoose');
const Audio = require('../Diplomen Proekt/models/audio');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/PianoZen', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const audioFolderPath = path.join(__dirname, 'tunes');

fs.readdir(audioFolderPath, async (err, files) => {
  if (err) {
    console.error('Error reading audio folder:', err);
    process.exit(1);
  }

  const audioFiles = files.map(filename => {
    const note = filename.split('.')[0]; // Assuming the note is the filename without extension
    return {
      filename,
      path: path.join('tunes', filename),
      note,
    };
  });

  try {
    await Audio.insertMany(audioFiles);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error inserting audio files into the database:', error);
  } finally {
    mongoose.connection.close();
  }
});