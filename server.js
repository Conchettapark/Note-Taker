// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let dbFile = "db/db.json";

function readData() {
  let stringData = fs.readFileSync(dbFile, { encoding: "utf8" });
  stringData = stringData === "" ? "[]" : stringData;
  return JSON.parse(stringData);
}

function writeData(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data));
}

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  return res.json(readData());
});

app.post("/api/notes", function (req, res) {
  var newNote = req.body;
  var notes = readData();
  notes.push(newNote);
  writeData(notes);
  return res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
  var id = req.params["id"];
  var notes = readData();
  var filteredNotes = notes.filter((n) => n.id !== id);
  writeData(filteredNotes);
  return res.json(filteredNotes);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
