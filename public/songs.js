document.addEventListener('DOMContentLoaded', () => {
  const songList = document.getElementById('songList');

  // Fetch the list of recorded songs from the server
  fetch('/get-songs')
    .then(response => response.json())
    .then(songs => {
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
});