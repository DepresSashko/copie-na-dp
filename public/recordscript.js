document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOMContentLoaded event fired');

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioPlayer = document.getElementById('audioPlayer');
  const recordButton = document.getElementById('recordButton');
  const stopButton = document.getElementById('stopButton');
  const playButton = document.getElementById('playButton');
  const saveButton = document.getElementById('saveButton');

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
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioPlayer.src = audioUrl;
    audioPlayer.play();
  });

  // Save the recorded audio
    saveButton.addEventListener('click', async () => {
      console.log('Save button clicked');
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      // Create a FormData instance and append the file
      const formData = new FormData();
      formData.append('file', audioBlob);
      // Send the file to the server-side script via fetch
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      // Handle the response
      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('File upload failed');
      }
    });

});
