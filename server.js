//dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");
const uniqid = require("uniqid");

// Utilize express
const app = express();
// Sets environment for heroku
const PORT = process.env.PORT || 3001;

//sServe static files
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
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    //Return back to client
    res.json(noteList);
})

//Listening on the port
app.listen(PORT, () => console.log("Server listening on port " + PORT));
