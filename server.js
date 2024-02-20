const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PianoZen', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for audio files
const audioSchema = new mongoose.Schema({
  filename: String,
  filePath: String,
});

// Create a model based on the schema
const Audio = mongoose.model('Audio', audioSchema);

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));


// Middleware to handle JSON requests
app.use(express.json());

// Set up multer for handling file uploads
const upload = multer();

// Define the directory where audio files will be saved
const audioDirectory = path.join(__dirname, 'public', 'songList');

// Create the directory if it doesn't exist
if (!fs.existsSync(audioDirectory)) {
  fs.mkdirSync(audioDirectory, { recursive: true });
}

// Route for saving audio
app.post('/save-audio', upload.fields([{ name: 'audioBlob', maxCount: 1 }, { name: 'audioData', maxCount: 1 }]), (req, res) => {
  try {
    // Get the audio blob file
    const audioBlobFile = req.files['audioBlob'][0];
    // Get the audio data
    const audioData = req.body['audioData'];

    // Generate a unique filename
    const filename = `audio_${Date.now()}.wav`;

    // Write the audio blob to a file
    const blobFilePath = path.join(audioDirectory, filename);
    fs.writeFileSync(blobFilePath, audioBlobFile.buffer);

    // Write the audio data to a file
    const dataFilePath = path.join(audioDirectory, `${filename}.txt`);
    fs.writeFileSync(dataFilePath, audioData);

    res.status(200).json({ message: 'Audio saved successfully', filename });
  } catch (error) {
    console.error('Error saving audio:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const songListDirectory = path.join(__dirname, 'public', 'songList');

// Route to fetch the list of saved songs
app.get('/get-songs', (req, res) => {
  try {
    // Read the list of files in the songListDirectory
    fs.readdir(songListDirectory, (err, files) => {
      if (err) {
        console.error('Error reading song list:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Send the list of files as the response
        res.json(files);
      }
    });
  } catch (error) {
    console.error('Error fetching song list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
