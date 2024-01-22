document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded event fired');

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioPlayer = document.getElementById('audioPlayer');
  const recordButton = document.getElementById('recordButton');
  const stopButton = document.getElementById('stopButton');
  const playButton = document.getElementById('playButton');

  // Get the user's audio stream
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Create a MediaRecorder instance
  const recorderInstance = new MediaRecorder(stream);

  // Store the audio data chunks
  let audioChunks = [];

  // Handle dataavailable event
  recorderInstance.ondataavailable = event => {
    console.log('Audio data available');
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  // Handle start event
  recorderInstance.onstart = () => {
    console.log('Recording started');
    recordButton.disabled = true;
    stopButton.disabled = false;
    playButton.disabled = true;
    saveButton.disabled = true;
    audioPlayer.src = '';
  };

  // Handle stop event
  recorderInstance.onstop = () => {
    console.log('Recording stopped');
    recordButton.disabled = false;
    stopButton.disabled = true;
    playButton.disabled = false;
    saveButton.disabled = false;
  };

  // Start recording
  recordButton.addEventListener('click', () => {
    console.log('Record button clicked');
    audioChunks = [];
    recorderInstance.start();
  });

  // Stop recording
  stopButton.addEventListener('click', () => {
    console.log('Stop button clicked');
    recorderInstance.stop();
  });

  // Play the recorded audio
  playButton.addEventListener('click', () => {
    console.log('Play button clicked');
    const audioBlob = new Blob(audioChunks, { type: 'tunes/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioPlayer.src = audioUrl;
    audioPlayer.play();
  });

  document.getElementById('saveButton').addEventListener('click', () => {
    if (audioChunks.length === 0) {
      console.error('No audio to save.');
      return;
    }
  
    const audioBlob = new Blob(audioChunks, { type: 'tunes/wav' });
  
    // Create FormData to send the audio file to the server
    const formData = new FormData();
    formData.append('songList', audioBlob, 'recording.wav');
  
    // Send the audio file to the server
    fetch('/save-audio', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Audio saved to database:', data);
  
      // Fetch and update the list of recorded songs on the list.html page
      fetch('/get-songs')
        .then(response => response.json())
        .then(songs => {
          // Update the list on list.html (assuming you have a list element with id 'songList')
          const songList = document.getElementById('YourSongList');
          songList.innerHTML = ''; // Clear the existing list
  
          songs.forEach(song => {
            const listItem = document.createElement('li');
            const audioElement = document.createElement('audio');
            audioElement.controls = true;
            audioElement.src = song.path;
  
            listItem.appendChild(document.createTextNode(song.filename));
            listItem.appendChild(audioElement);
  
            songList.appendChild(listItem);
          });
        })
        .catch(error => console.error('Error fetching songs:', error));
    })
    .catch(error => console.error('Error saving audio to database:', error));
  });
  

});
