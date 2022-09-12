//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");
const uniqid = require("uniqid");

// Utilize express
const app = express();
// Sets environment for heroku
const PORT = process.env.PORT || 3001;

//Serve static files, enable form data and parse json body
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Route to notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//Route to get saved notes from db.json
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

//Route to home page
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Post new note to db.json and return to client
app.post("/api/notes", (req, res) => {
    //Read file from db and format into an object
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    //Declare new variable with input from the client and establish unique id
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uniqid()
    }

    //Update new note to notes object
    noteList.push(newNote);

    //Write the notes object back to the db
    try {
        fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
        //Return back to client
        res.json(noteList);
    } catch (err) {
        console.log(err);
    }
})

//Delete note
app.delete("/api/notes/:id", (req, res) => {
    //Read the file from db and set as an object in a variable  
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    //Filter out all ids except the one to be deleted and return them
    let updateList = noteList.filter(note => note.id !== req.params.id)

    //Write object to db and return to client
    try {
        fs.writeFileSync("./db/db.json", JSON.stringify(updateList));
        res.json(noteList);
    } catch (err) {
        console.log(err);
    }
});

//Listening on the port
app.listen(PORT, () => console.log("Server listening on port " + PORT));
