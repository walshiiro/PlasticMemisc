document.getElementById('explorenowbtn').addEventListener('click', function () {
  const aboutMeBox = document.getElementById('content1');
  aboutMeBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

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


// function togglePlayPause() {
//     const playIcon = document.getElementById('play-icon');
//     const pauseIcon = document.getElementById('pause-icon');

//     if (!audioPlayer) {
//         audioPlayer = document.querySelector('audio'); // Lấy trình phát nhạc
//         if (!audioPlayer) {
//             console.error("Audio player not found!");
//             return;
//         }
//     }

//     if (isPlaying) {
//         // Nếu đang phát, dừng nhạc
//         audioPlayer.pause();
//         isPlaying = false;
//         playIcon.style.display = 'inline';
//         pauseIcon.style.display = 'none';
//         console.log('Paused');
//     } else {
//         // Nếu đang dừng, phát nhạc
//         if (audioPlayer.src) {
//             audioPlayer.play();
//             isPlaying = true;
//             playIcon.style.display = 'none';
//             pauseIcon.style.display = 'inline';
//             console.log('Playing');
//         } else {
//             console.error("No song selected to play!");
//         }
//     }
// }



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

  const audioPlayer = document.createElement("audio");
  audioPlayer.setAttribute("controls", "true");
  audioPlayer.style.display = "none"; // Ẩn trình phát nhạc
  document.body.appendChild(audioPlayer);

  let previouslySelectedRow = null; // Lưu hàng được chọn trước đó
  let currentSongIndex = -1; // Chỉ số bài hát hiện tại
  let filteredSongs = []; // Danh sách bài hát được lọc theo nghệ sĩ

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
                  <td class="song-title">${song.name}</td>
                  <td class="song-duration">${song.time}</td>
              `;

              // Thêm sự kiện click
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

  function playSong(index, songRow) {
      const song = filteredSongs[index];
      currentSongIndex = index;

      const artist = listartist.find(artist => artist.name === artistName);

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
      audioPlayer.play();
      audioPlayer.style.display = "block"; // Hiển thị trình phát nhạc

      // Tạo canvas để xử lý màu từ ảnh
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = `${artist.img}`; 
      img.crossOrigin = "Anonymous";

      img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Lấy dữ liệu pixel
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let r = 0, g = 0, b = 0;

          for (let i = 0; i < imageData.length; i += 4) {
              r += imageData[i];
              g += imageData[i + 1];
              b += imageData[i + 2];
          }

          const pixelCount = imageData.length / 4;
          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          // Đổi màu chữ của hàng được chọn
          songRow.querySelector(".song-count").style.color = `rgb(${r}, ${g}, ${b})`;
          songRow.querySelector(".song-title").style.color = `rgb(${r}, ${g}, ${b})`;
          songRow.querySelector(".song-duration").style.color = `rgb(${r}, ${g}, ${b})`;

          console.log(`Color applied: rgb(${r}, ${g}, ${b})`);
      };

      img.onerror = () => {
          console.error("Failed to load image.");
      };
  }

  // Lắng nghe sự kiện kết thúc bài hát
  audioPlayer.addEventListener("ended", () => {
      if (currentSongIndex + 1 < filteredSongs.length) {
          const nextSongRow = tableBody.children[currentSongIndex + 1];
          playSong(currentSongIndex + 1, nextSongRow);
      }
  });
}







