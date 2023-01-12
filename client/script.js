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
        name="submitTodoForm"
        class="w-1/4 col-start-3 row-start-4 rounded-full hover:bg-gray-400 px-4 py-1 ml-20"
        type="submit"
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

  searchedArtist = document.getElementById("artist").value;
  console.log(searchedArtist);

  api.getAll().then((songs) => {
    songListElement.innerHTML = "";
    let filteredList = [];
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].artist == searchedArtist) {
        filteredList.push(songs[i]);
        console.log("Hej");

        //console.log("Hittade: ", filteredList[i].artist);
      }
    }
    // for (x = 0; x < filteredList; x++) {
    //   console.log(filteredList[x].songTitle);
    // }

    if (filteredList && filteredList.length > 0) {
      filteredList.forEach((song) => {
        songListElement.insertAdjacentHTML("beforeend", renderSong(song));
      });
    }
  });
}
// function deleteSong(id) {
//     api.remove(id).then((result) => {

//     renderSongList();
//     });
// }

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
}

renderSonglist();
