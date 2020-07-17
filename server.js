var express = require('express');
var path = require('path');
var fs = require('fs');
const { v4: uuidv4 } = require('uuid')

var app = express();
var PORT = process.env.PORT || 8090;

notes = [];

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

//html routs
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});



//api rout
app.get('/api/notes', function (req, res) {
    fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf-8');
    return res.json(notes);

});

app.post('/api/notes', function (req, res) {
    let newNote = req.body;
    notes.push(newNote);
    notes.forEach((note) => {
        note.id = uuidv4();
    });
    console.log(newNote);
    fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), function (err) {
        if (err) {
            throw err;
        } else {
            res.json(true);
            return res.end();
            
        }
    })
});

app.delete('/api/notes/:id', function (req, res) {
let deleteId = req.params.id;

let newNotes = notes.filter( note => note.id != deleteId);

fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(newNotes), function (err) {
    if (err) {
        throw err;
    } else {
        notes = newNotes;
        return res.end();
    }
})


});

//html rout
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });