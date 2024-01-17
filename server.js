const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Song = require('../Diplomen Proekt/models/song');
const Audio = require('../Diplomen Proekt/models/audio');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html', 'htm'] }));

mongoose.connect('mongodb://localhost:27017/PianoZen', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Example route to get all songs from MongoDB
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example route to get all audio files from MongoDB
app.get('/tunes', async (req, res) => {
    try {
      const audioFiles = await Audio.find();
      res.json(audioFiles);
    } catch (error) {
      console.error('Error fetching audio files from the database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });