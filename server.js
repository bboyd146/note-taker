const express = require('express');
const path = require('path');
const fs = require("fs");
const notesData = require('./db/db.json');
const { readFromFile, writeToFile, readAndAppend } = require('./public/assets/js/helper');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json');
    res.json(notesData);
});

app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json(notesData.push(newNote));
        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding tip');
    }

});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const index = notesData.findIndex((note) => note.id == id);
    // removing from array
    notesData.splice(index, 1)
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all notes except the one with the ID provided in the URL
            const result = json.filter((note) => note.id !== id);

            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${id} has been deleted 🗑️`);
        });

});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
