document.addEventListener('DOMContentLoaded', () => {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const recordingIndicator = document.getElementById('recordingIndicator');
    const saveButton = document.getElementById('saveButton');
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');
  
    let mediaRecorder;
    let audioChunks = [];
  
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    saveButton.addEventListener('click', saveRecording);
    playButton.addEventListener('click', playRecording);
  
    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.start();
        toggleButtons(true);
        recordingIndicator.style.display = 'block';
      } catch (error) {
        console.error('Error starting recording:', error);
        alert('Failed to start recording');
      }
    }
  
    function handleDataAvailable(event) {
      audioChunks.push(event.data);
    }
  
    function stopRecording() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        toggleButtons(false);
        recordingIndicator.style.display = 'none';
        saveButton.style.display = 'block';
        playButton.style.display = 'block';
      }
    }
  
    async function saveRecording() {
      try {
        // Assuming audioChunks is an array of audio data chunks
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
    
        // Convert audio blob to base64 string
        const reader = new FileReader();
        reader.onloadend = async () => {
          const audioData = reader.result;
    
          // Construct the form data with both audio blob and audio data
          const formData = new FormData();
          formData.append('audioBlob', audioBlob);
          formData.append('audioData', audioData);
    
          // Send the form data to the server
          const response = await fetch('/save-audio', {
            method: 'POST',
            body: formData
          });
    
          if (response.ok) {
            console.log('Audio saved successfully');
            alert('Audio saved successfully');
          } else {
            console.error('Failed to save audio');
            alert('Failed to save audio');
          }
        };
    
        // Read audio blob as data URL
        reader.readAsDataURL(audioBlob);
      } catch (error) {
        console.error('Error saving audio:', error);
        alert('Error saving audio');
      }
    }
    
    
  
    function playRecording() {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayer.src = audioUrl;
      audioPlayer.play();
    }
  
    function toggleButtons(isRecording) {
      if (isRecording) {
        recordButton.style.display = 'none';
        stopButton.style.display = 'block';
      } else {
        recordButton.style.display = 'block';
        stopButton.style.display = 'none';
      }
    }
  });
  