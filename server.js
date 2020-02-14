const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

//initialize ID counter
var counter = 0;

// Sets up the Express app to handle data parsing
// user express.static to allow for refrencing of js css files in html files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());

///////////////////
//HTML Routes
///////////////////

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//////////////////
//API Routes
//////////////////

//GET
app.get("/api/notes", function(req, res) {
    return res.json(getDBdata());
})

//POST
app.post("/api/notes", function(req, res) {
    

    //get db data...dbJSON is an array
    let dbJSON = getDBdata();
    //check if empty, if so set as empy array
    if (dbJSON === false) {
        dbJSON = [];
    }
    let newNote = req.body;
    //iterate counter by 1
    counter++;
    let id = counter;
    //add id to note object
    newNote.id = id;
    //add new note to array
    dbJSON.push(newNote);
    //stringify array
    //overwrite array with updated array
    stringifyAndWrite(dbJSON);
    // I think that this is basically showing what the response to the post request is
    // not sure why you need this. I do know that the connection is interrupted
    // if it is not here...
    res.json(dbJSON);
});

//DELETE
app.delete("/api/notes/:id", function(req, res) {
    let id = parseInt(req.params.id);
    console.log(id);

    let dbJSON = getDBdata();
    console.log(dbJSON);

    for(i=0; i < dbJSON.length; i++) {
        if(dbJSON[i].id === id){
            var newArr = dbJSON.filter(note => {
                return note.id !== id;
            })
        }
    }

    stringifyAndWrite(newArr);
    res.json(newArr);
})

///////////////////
//Catch all other routes
///////////////////
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

///////////////////
//Listen for app
///////////////////
app.listen(PORT, function() {
    console.log("listening on port: " + PORT);
});

///////////////////
//Functions
///////////////////

//return json data as an array of objects or false if empty
function getDBdata() {
    let dbString = fs.readFileSync("db/db.json", 'utf8');
    if (dbString !== ""){
        let dbJSON = JSON.parse(dbString);
        return dbJSON;
    }
    return false;
}

//take in array of objects stringify said array and write to json file
function stringifyAndWrite(array){
    let  dbString = JSON.stringify(array);
    fs.writeFileSync("db/db.json", dbString, "utf-8");
}