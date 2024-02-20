document.addEventListener('DOMContentLoaded', () => {
  const songList = document.getElementById('songList');

  // Fetch the list of saved songs from the server
  fetch('/get-songs')
    .then(response => response.json())
    .then(songs => {
      // Populate the list with the fetched songs
      songs.forEach(song => {
        const listItem = document.createElement('li');
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = `/songList/${song}`; // Assuming the songs are stored in the "songList" directory

        listItem.textContent = song;
        listItem.appendChild(audioElement);

        songList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching songs:', error));
});
