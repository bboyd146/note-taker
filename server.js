const express = require('express');
const path = require('path');
const fs = require("fs");
const notesData = require('./db/db.json');
const { readFromFile, writeToFile, readAndAppend } = require('./assets/js/helper');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.port || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
// app.get('/', (req, res) =>
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// );

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('/api/notes', (req, res) => {
    res.json(notesData);
});

app.post("/api/notes", (req, res) => {
console.log(req.body)
const { title, text} = req.body;
if (req.body) {
    const newNote = {
      title,
      text,
      tip_id: uuidv4(),
    };

    readAndAppend(newNote, './db/tips.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }

    fs.writeFile("./db/db.json", JSON.stringify(notesData), () => {
        res.json(notesData);
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
