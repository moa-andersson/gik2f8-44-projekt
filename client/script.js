const PORT = 5001;

//skapar eventlyssnare för sök och spara knappen
// Vi behövde göra olka forms för vajre knapp annars fungare det inte
submitForm.addEventListener("submit", onSubmit);
searchForm.addEventListener("submit", onSearch);

//sparar ner id från html(ul) till ny variabel
const songListElement = document.getElementById("songList");
const api = new Api(`http://localhost:${PORT}/songs`);

//funktion renderSongList hämtar alla objekt från json genom api.getAll-metoden
function renderSonglist() {
  api.getAll().then((songs) => {
    songListElement.innerHTML = "";

    //går igenom varje låt i arrayen songs, varje elemnt skapas med hjälp av "renderSong"
    // Vi hittar vart vi ska placera den genom id:t "songList" som sparat ner i songListElement
    if (songs && songs.length > 0) {
      songs.forEach((song) => {
        songListElement.insertAdjacentHTML("beforeend", renderSong(song));
      });
    }
  });
}

// renderSong bygger upp html elementet som ska renderas som returneras som en string
function renderSong({ id, songTitle, artist, year, genre, imgUrl }) {
  let html = `
  <li class="grid grid-cols-3 grid-rows-4 gap-2 bg-gray-100 rounded-lg">
    <h3 class="col-start-2 col-span-2" >${songTitle}</h3>
    <h3 class="col-start-2 col-span-2">Artist: ${artist}</h3>
    <h3 class="col-start-2 col-span-2">Releaseår: ${year}</h3>
    <h3 class="col-start-2 col-span-1">Genre: ${genre}</h3>
    <img
    src="${imgUrl}"
      alt=""
      class="col-start-1 row-start-1 row-span-4 p-2 max-h-48"
    />
    <button
    onclick="deleteSong(${id})"
    class="flex flex-col hover:hue-rotate-15 hover:brightness-50 items-end col-start-3 row-start-4 rounded-full px-4 py-1 ml-20 flex"
  >
    <img class="max-h-10" src="./imges/delete.svg"/>
  </button>
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
  searchedYear = document.getElementById("year").value;
  searchedGenre = document.getElementById("genre").value;

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
      let currentYear = songs[i].year;
      let currentGenre = songs[i].genre;

      //om vi hittar sökt artist i currentSong pushar vi den till filteredList
      if (currentArtist.includes(searchedArtist) && searchedArtist.length > 0) {
        // kolla oatt den inte innehåller objektet redan
        if (!filteredList.includes(songs[i])) {
          filteredList.push(songs[i]);
        }
      }

      if (
        currentSongTitle.includes(searchedSongTitle) &&
        searchedSongTitle.length > 0
      ) {
        // kolla oatt den inte innehåller objektet redan
        if (!filteredList.includes(songs[i])) {
          filteredList.push(songs[i]);
        }
      }

      if (currentGenre.includes(searchedGenre) && searchedGenre.length > 0) {
        // kolla oatt den inte innehåller objektet redan
        if (!filteredList.includes(songs[i])) {
          filteredList.push(songs[i]);
        }
      }

      if (currentYear.includes(searchedYear) && searchedYear.length > 0) {
        // kolla oatt den inte innehåller objektet redan
        if (!filteredList.includes(songs[i])) {
          filteredList.push(songs[i]);
        }
      }
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
    } else {
      html = `
      <li>
        <h3>Låten du sökte efter kunde inte hittas</h3>
      </li>
      `;
      songListElement.insertAdjacentHTML("beforeend", html);
    }
  });
  clearFields();
}

function saveSong() {
  if (songForm.imgUrl.value.length == 0) {
    //defaultbild om fältet för url-bild lämnas tomt
    songForm.imgUrl.value = "./imges/default.svg";
  }

  // spara värdena från songForm i objektet song
  const song = {
    songTitle: songForm.songTitle.value,
    artist: songForm.artist.value,
    year: songForm.year.value,
    genre: songForm.genre.value,
    imgUrl: songForm.imgUrl.value,
  };

  // skickar song objekt till create metoden i api och om den finns så renderas hela listan
  api.create(song).then((song) => {
    if (song) {
      renderSongList();
    }
  });

  // rensar alla inputfält
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
  let yearText = document.getElementById("year");
  let imgText = document.getElementById("imgUrl");
  let genre = document.getElementById("genre");
  songTitleText.value = "";
  artistText.value = "";
  yearText.value = "";
  imgText.value = "";
  genre.value = "";
}
renderSonglist();
