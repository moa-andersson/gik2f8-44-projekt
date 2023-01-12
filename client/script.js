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
  //   e.preventDefault();
  //   if (titleValid && descriptionValid && dueDateValid) {
  //     console.log("Submit");
  //     saveTask();
  //     clearFields();
  //   }
}
function onSearch(e) {
  e.preventDefault();
  console.log("söker", e);
}
renderSonglist();
