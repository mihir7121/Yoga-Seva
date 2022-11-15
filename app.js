const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('', function(req,res) {
    res.render('index');
});

app.get('/pickpose', function(req,res) {
    res.render('pickpose');
});

app.get('/practice', function(req,res) {
    res.render('practice');
});

server.listen(PORT, function(err){
    console.log(`Server is listening on http://localhost:${PORT}`)
});