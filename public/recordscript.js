// public/client.js

document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mediaRecorderChunks = [];

    const pianoKeys = document.querySelectorAll('.piano-key');
    const startRecordingButton = document.getElementById('startRecording');
    const stopRecordingButton = document.getElementById('stopRecording');

    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    pianoKeys.forEach((key) => {
        key.addEventListener('click', () => {
            const note = key.dataset.note;
            playNoteAudio(note);
        });
    });
    
    function playNoteAudio(note) {
        const audio = new Audio(`tunes/${note}.wav`);
        audio.play();
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    mediaRecorderChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(mediaRecorderChunks, { type: 'tunes/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                // Use audioBlob or audioUrl as needed (e.g., send to server for storage)
                // ...

                mediaRecorderChunks.length = 0;
            };

            startRecordingButton.addEventListener('click', () => {
                mediaRecorder.start();
                startRecordingButton.disabled = true;
                stopRecordingButton.disabled = false;
            });

            stopRecordingButton.addEventListener('click', () => {
                mediaRecorder.stop();
                startRecordingButton.disabled = false;
                stopRecordingButton.disabled = true;
            });
        })
        .catch((error) => {
            console.error('Error accessing microphone:', error);
        });
});
