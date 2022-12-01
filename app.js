const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport_config = require('./passport-config');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000

mongoose.connect('mongodb://localhost:27017/yoga-seva');
mongoose.connection.once('open', () => {
    console.log('connection has been made');
    }).on('error', (error) => console.log(error));

app.use(cors());
app.use(flash());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('', function(req, res) {
    res.render('index');
});

app.get('/login', isGuest, function(req, res) {
    res.render('login');
});

app.post('/login', isGuest, passport.authenticate('local', { 
    successRedirect: '/start',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', isGuest, function(req, res) {
    res.render('register');
});

app.post('/register', isGuest, function(req, res) {
   var user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
   });
   user.save().then(() => {
        console.log('user saved');
        res.redirect('login');
   })
})

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
})

function loggedIn(req, res, next) {
    if(req.user) {
        next();
    } else {
        res.redirect('login');
    }
}

function isGuest(req, res, next) {
    if(req.user) {
        res.redirect('start');
    } else {
        next();
    }
}

app.get('/start', function(req,res) {
    res.render('pickpose');
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