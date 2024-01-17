const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ffmpeg = require('fluent-ffmpeg');
const Audio = require('./models/audio');
const Song = require('./models/song');



const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static('public'));
app.use(express.json());

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle saving audio to the database
app.post('/save-audio', async (req, res) => {
  const audioChunks = [];
  const filename = `recording-${Date.now()}.wav`;
  const audioPath = path.join(__dirname, 'public', 'audio', filename);

  // Write the received audio data to a WAV file
  req.on('data', chunk => {
    audioChunks.push(chunk);
  });

  req.on('end', async () => {
    const audioBlob = Buffer.concat(audioChunks);
    require('fs').writeFileSync(audioPath, audioBlob);

    // Convert the WAV file to MP3 using fluent-ffmpeg
    const outputFilename = `recording-${Date.now()}.mp3`;
    const outputPath = path.join(__dirname, 'public', 'audio', outputFilename);

    ffmpeg()
      .input(audioPath)
      .audioCodec('libmp3lame')
      .toFormat('mp3')
      .on('end', async () => {
        // Save relevant information to the database
        try {
          const audio = new Audio({
            filename: outputFilename,
            path: `tunes/${outputFilename}`,
            note: 'a',
            timestamp: new Date(),
          });

          await audio.save();
          console.log('Audio saved to database:', audio);
        } catch (error) {
          console.error('Error saving audio to database:', error);
        }

        res.status(200).json({ message: 'Audio saved successfully' });

        // Remove the temporary WAV file
        require('fs').unlinkSync(audioPath);
      })
      .on('error', (err) => {
        console.error('Error converting to MP3:', err);
        res.status(500).json({ error: 'Error converting to MP3' });
      })
      .save(outputPath);
  });
});

// Handle fetching the list of songs
app.get('/get-songs', async (req, res) => {
  try {
    const songs = await Audio.find({}, 'filename path');
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs from the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve the list.html page
app.get('/list', (req, res) => {
  res.sendFile(path.join(__dirname, 'YourSongList.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
