const PORT = 5001;

submitForm.addEventListener("submit", onSubmit);
searchForm.addEventListener("submit", onSearch);

const songListElement = document.getElementById("songList");
const api = new Api(`http://localhost:${PORT}/songs`);

function renderSonglist() {
  api.getAll().then((songs) => {
    songListElement.innerHTML = "";

    if (songs && songs.length > 0) {
      songs.forEach((song) => {
        songListElement.insertAdjacentHTML("beforeend", renderSong(song));
      });
    }
  });
}

function renderSong({ id, songTitle, artist, year, genre, imgUrl }) {
  let html = `
  <li class="grid grid-cols-3 grid-rows-4 gap-2 bg-gray-100 rounded-lg">
    <h3 class="col-start-2 col-span-2">Titel: ${songTitle}</h3>
    <h3 class="col-start-2 col-span-2">Artist: ${artist}</h3>
    <h3 class="col-start-2 col-span-2">Releaseår: ${year}</h3>
    <h3 class="col-start-2 col-span-2">Genre: ${genre}</h3>
    <img
    src="${imgUrl}"
      alt=""
      class="col-start-1 row-start-1 row-span-4 p-2"
    />
    <div class="flex-row">
    <button
    onclick="deleteSong(${id})"
    class="w-1/4 col-start-3 row-start-4 rounded-full hover:bg-gray-400 px-4 py-1 ml-20"
  >
    X
  </button>
    </div>
  </li>
    
    `;

  return html;
}

function onSubmit(e) {
  e.preventDefault();
  console.log("Skapar ny låt");
  // if (titleValid && descriptionValid && dueDateValid) {}
  saveSong();
  //clearFields();
}
function onSearch(e) {
  e.preventDefault();
  console.log("söker");

  //hämtar sökt artist från DOM genom ID/artist och ger det value från inputfältet
  searchedArtist = document.getElementById("artist").value.toUpperCase();
  searchedSongTitle = document.getElementById("songTitle").value.toUpperCase();

  // searchedYear
  //searchedGenre
  console.log(searchedArtist);

  //hämtar allt från api och returnerar songs
  api.getAll().then((songs) => {
    //tömmer befintlig inner html
    songListElement.innerHTML = "";
    //som lista för det vi vill söka efter
    let filteredList = [];
    //for i loop genom arrayen songs
    for (let i = 0; i < songs.length; i++) {
      //sparar artister från songs i ny variabel i versaler
      let currentArtist = songs[i].artist.toUpperCase();
      let currentSongTitle = songs[i].songTitle.toUpperCase();
      let currentYear = songs[i].year.toUpperCase();
      let currentGenre = songs[i].genre.toUpperCase();

      //om vi hittar sökt artist i currentSong pushar vi den till filteredList
      if (currentArtist.includes(searchedArtist)) {
        // kolla oatt den inte innehåller objektet redan
        filteredList.push(songs[i]);
      }
      //   if (currentSongTitle.includes(searchedSongTitle) && currentArtist != "") {
      //     // kolla oatt den inte innehåller objektet redan
      //     filteredList.push(songs[i]);
      //   }

      //ifsats för titel
      //ifsats för år
      //ifsats för genre
    }

    //kollar att filteredList inte är null och längre än 0
    if (filteredList && filteredList.length > 0) {
      //för varje låt i filteredList renderas låten innan slutet på ul-taggen
      for (i = 0; i < filteredList.length; i++) {
        songListElement.insertAdjacentHTML(
          "beforeend",
          renderSong(filteredList[i])
        );
      }
    }
  });
  clearFields();
}
function deleteSong(id) {
  api.remove(id).then((result) => {
    renderSongList();
  });
}

function saveSong() {
  const song = {
    songTitle: songForm.songTitle.value,
    artist: songForm.artist.value,
    year: songForm.year.value,
    genre: songForm.genre.value,
    imgUrl: songForm.imgUrl.value,
  };

  api.create(song).then((song) => {
    if (song) {
      renderSongList();
    }
  });
  clearFields();
}

function deleteSong(id) {
  api.remove(id).then((result) => {
    renderSongList();
  });
}
function clearFields() {
  let songTitleText = document.getElementById("songTitle");
  let artistText = document.getElementById("artist");
  let yearText = document.getElementById("artist");
  let imgText = document.getElementById("artist");
  songTitleText.value = "";
  artistText.value = "";
  yearText.value = "";
  imgText.value = "";
}
renderSonglist();
