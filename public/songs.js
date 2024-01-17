// songs.js
// Get the song data from localStorage
const songs = JSON.parse(localStorage.getItem('song'));

// Get the list element from the document
const songList = document.getElementById('song-list');

// Iterate over the song data and create list items
songs.forEach(song => {
  // Create a new list item element
  const listItem = document.createElement('li');
  // Set the text content of the list item to the song title
  listItem.textContent = song.title;
  // Append the list item to the list element
  songList.appendChild(listItem);
});
