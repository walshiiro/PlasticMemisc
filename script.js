

function renderArtists(artists) {
  const container = document.getElementById('artist-container');
  container.innerHTML = ''; 

  let currentRow = null;

  artists.forEach((artist, index) => {
    if (index % 4 === 0) {
      currentRow = document.createElement('div');
      currentRow.classList.add('artist-row');
      container.appendChild(currentRow);
    }

    const artistDiv = document.createElement('div');
    artistDiv.classList.add('artist');
    artistDiv.innerHTML = `
      <img src="${artist.img}" alt="${artist.name}" class="artist-img">
      <h3>${artist.name}</h3>
      <p>Thể loại: ${artist.type}</p>
    `;

    artistDiv.addEventListener('click', () => {
      // Ví dụ: Chuyển đến một trang mới với URL chứa thông tin nghệ sĩ
      const targetUrl = `/artist-page.html?name=${encodeURIComponent(artist.name)}`;
      window.location.href = targetUrl;
    });

    currentRow.appendChild(artistDiv);
  });
}

function searchArtists(searchTerm) {
  const filteredArtists = listartist.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  renderArtists(filteredArtists);
}

document.querySelector('.content-searchbox').addEventListener('input', (event) => {
  const searchTerm = event.target.value;
  searchArtists(searchTerm);
});

renderArtists(listartist);


 
function artistInfo() {
  const params = new URLSearchParams(window.location.search);
  const artistName = params.get('name'); // Get artist name from URL parameters

  // Find the artist in the list
  const artist = listartist.find((artist) => artist.name === artistName);

  // Check if artist is found
  if (!artist) {
    const artistInfoContainer = document.getElementById('artistinfo');
    artistInfoContainer.innerHTML = `<p>Artist not found!</p>`;
    return;
  }


  // Create a canvas to calculate the average color


  

  // Prepare artist information container
  const artistInfoContainer = document.getElementById('artistinfo');
  artistInfoContainer.style.zIndex = "100";
  artistInfoContainer.classList.add('information'); 
  
  const artistInfoContainer1 = document.getElementById('artistbg');
  artistInfoContainer1.classList.add('bg');
  artistInfoContainer1.style.backgroundImage = `url("${artist.img}")`;
  
  
  // Display artist information
  artistInfoContainer.innerHTML = `
    <img src="${artist.img}" alt="${artist.name}" class="artist-img">
    <h1 class="artist-name">${artist.name}</h1>
    <p class="artist-type">Thể loại: ${artist.type}</p>
  `;

 
}



function displayArtistSongs() {
  const params = new URLSearchParams(window.location.search);
  const artistName = params.get('name');
  const songlists = document.getElementById("songlists");

  // Tạo cấu trúc bảng
  songlists.innerHTML = `
      <table class="song-table">
          <thead>
              <tr class="form">
                  <th class="count">#</th>
                  <th class="title-title">Title</th>
                  <th class="duration">Duration</th>
              </tr>
          </thead>
          <tbody id="songTableBody"></tbody>
      </table>
  `;

  const tableBody = document.getElementById("songTableBody");

// Tạo một <div> mới
const audioContainer = document.createElement("div");
audioContainer.classList.add = "audioContainer"; 

// Tạo phần tử <audio>
const audioPlayer = document.createElement("audio");
audioPlayer.setAttribute("controls", "true");
audioPlayer.id = "myAudioPlayer";

// Thêm phần tử <audio> vào <div>
audioContainer.appendChild(audioPlayer);

// Thêm <div> vào trong body
document.body.appendChild(audioContainer);

  let previouslySelectedRow = null; 
  let currentSongIndex = -1; 
  let filteredSongs = []; 
  let isPlaying = false; 

  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');

  // Function to toggle play and pause
  function togglePlayPause() {
      if (isPlaying) {
          audioPlayer.pause();
          isPlaying = false;
          playIcon.style.display = 'inline'; // Show the play icon
          pauseIcon.style.display = 'none'; // Hide the pause icon
      } else {
          if (currentSongIndex === -1) {
              playSong(0, tableBody.children[0]);
          } else {
              // Else, just play the current song
              audioPlayer.play();
              isPlaying = true;
              playIcon.style.display = 'none'; // Hide play icon
              pauseIcon.style.display = 'inline'; // Show pause icon
          }
      }
  }

  // Function to play the song
  function playSong(index, songRow) {
      const song = filteredSongs[index];
      currentSongIndex = index;

      // Reset màu của hàng trước đó (nếu có)
      if (previouslySelectedRow) {
          previouslySelectedRow.querySelector(".song-count").style.color = "";
          previouslySelectedRow.querySelector(".song-title").style.color = "";
          previouslySelectedRow.querySelector(".song-duration").style.color = "";
      }

      // Lưu hàng hiện tại là hàng đã chọn
      previouslySelectedRow = songRow;

      // Cập nhật trình phát nhạc
      const mp3FileName = `songfile/${song.name}.mp3`;
      audioPlayer.src = mp3FileName;
      audioPlayer.play(); // Play the audio automatically when the song is selected
      isPlaying = true;
      playIcon.style.display = 'none'; // Hide play icon
      pauseIcon.style.display = 'inline'; // Show pause icon

      // Update the song row's color
      songRow.querySelector(".song-count").style.color = `#03fc7f`;
      songRow.querySelector(".song-title").style.color = `#03fc7f`;
      songRow.querySelector(".song-duration").style.color = `#03fc7f`;
  }

  // Lắng nghe sự kiện kết thúc bài hát
  audioPlayer.addEventListener("ended", () => {
      if (currentSongIndex + 1 < filteredSongs.length) {
          const nextSongRow = tableBody.children[currentSongIndex + 1];
          playSong(currentSongIndex + 1, nextSongRow);
      }
  });

  // Load song list
  fetch('song.js')
      .then(response => response.json())
      .then(lists => {
          let count = 0;

          // Lọc danh sách bài hát
          filteredSongs = lists.filter(song => !artistName || song.artist === artistName);

          filteredSongs.forEach((song, index) => {
              count++;

              // Tạo một hàng mới
              const songRow = document.createElement("tr");
              songRow.classList.add("song-element");

              songRow.innerHTML = `
                  <td class="song-count">${count}</td>
                  <td class="song-title">
                  <div class="song-info">
                  <img src="songicon/${song.img}" alt="${song.name}" class="songicon" />
                  <span class="song-name">${song.name}</span>
                  </div></td>
                  <td class="song-duration">${song.time}</td>
              `;

              // Add event listener for row click to play the song
              songRow.addEventListener("click", () => {
                  playSong(index, songRow);
              });

              tableBody.appendChild(songRow);
          });
      })
      .catch(error => {
          console.error("Failed to load songs:", error);
          songlists.innerHTML = `<p class="error">Failed to load songs.</p>`;
      });

  // Event listener for the play/pause button
  playIcon.addEventListener('click', togglePlayPause);
  pauseIcon.addEventListener('click', togglePlayPause);
}







