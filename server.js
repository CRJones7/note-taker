var express = require('express');
var path = require('path');
var fs = require('fs');
const { v4: uuidv4 } = require('uuid')

var app = express();
var PORT = process.env.PORT || 8080;

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
    // console.log(typeof notes);
    // console.log(notes);
    return res.json(notes);
    // fs.readFile(path.join(__dirname, 'db/db.json'), function(err, data){
    //     console.log(data);
    //     if (err) {
    //         throw err;
    //     } else {
    //         return res.json(data);
    //     }
    // })
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
            // notes.push(newNote);
            res.json(true);
            return res.end();
            
        }
    })
});

app.delete('/api/notes', function (req, res) {

});

//html rout
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });