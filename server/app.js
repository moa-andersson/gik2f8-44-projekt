const express = require("express");
const { fdatasync } = require("fs");
const app = express();
const fs = require("fs/promises");

const PORT = 5001;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    next();
  });
// app.get hanterar GET reqest och respones
// i app.get använder vi fs.readfile för att parsa "packa upp" json strängen till ett objekt som
// används för att skapa innehåll på hemsidan
app.get("/songs", async (req, res) => {
  try {
    const songs = await fs.readFile("./songs.json");
    res.send(JSON.parse(songs));
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});
// hanterar POST request och respons,
app.post("/songs", async (req, res) => {
  try {
    const song = req.body;

    const listBuffer = await fs.readFile("./songs.json");
    const currentSongs = JSON.parse(listBuffer);

    //vi hanterar id på objektet
    let songId = 1;
    if (currentSongs && currentSongs.length > 0) {
      songId = currentSongs.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        songId
      );
    }
    const newSong = { id: songId + 1, ...song };
    // lägger till den nya låten i array
    const newList = currentSongs ? [...currentSongs, newSong] : [newSong];

    // skriver till json-filen
    await fs.writeFile("./songs.json", JSON.stringify(newList));

    // Sänder tillbaka ett respone med den nya låten
    res.send(newSong);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete("/songs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile("./songs.json");
    const currentSongs = JSON.parse(listBuffer);
    if (currentSongs.length > 0) {
      await fs.writeFile(
        "./songs.json",
        JSON.stringify(currentSongs.filter((song) => song.id != id))
      );
      res.send({ message: `Sång med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: "Ingen sång att ta bort" });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});
app.listen(PORT, () => console.log("server running on http://localhost:5001"));
// const http = require("http");
// const server = http.createServer((req, res) => {
//   console.log(req.url);

//   const statusCode = 425;
//   res.writeHead(statusCode);
//   res.end(`Du gjorde ett ${req.method} anrop till ${req.url}`);
// });

// server.listen("5001", () =>
//   console.log("server running on http://localhost:5001")
// );
