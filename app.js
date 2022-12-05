const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');
const Stats = require('./models/stats');
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
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

// set the view engine to ejs
app.set('view engine', 'ejs');

var accuracy = [];

app.get('', function (req, res) {
    res.render('index');
});

app.get('/login', isGuest, function (req, res) {
    res.render('login');
});

app.post('/login', isGuest, passport.authenticate('local', {
    successRedirect: '/start',
    failureRedirect: '/login',
    failureFlash: true
}
));

app.get('/register', isGuest, function (req, res) {
    res.render('register');
});

app.post('/register', isGuest, function (req, res) {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(() => {
        console.log('user saved');
        res.redirect('login');
    });
})

app.delete('/logout', (req, res) => {
    req.flash("success", "Successfully logged you out!");
    req.logOut();
    res.redirect('/login');
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect('login');
}

// function loggedIn(req, res, next) {
//     if (req.user) {
//         next();
//     } else {
//         req.flash("error", "You must be signed in to do that!");
//         res.redirect('login');
//     }
// }

function isGuest(req, res, next) {
    if (req.user) {
        res.redirect('start');
    } else {
        next();
    }
}

app.get('/start', isLoggedIn, function (req, res) {
    console.log(req.user.name);
    res.render('start', { name: req.user.name });
});

app.get('/pickpose', isLoggedIn, function (req, res) {
    res.render('pickpose');
});

app.get('/practice1', isLoggedIn, function (req, res) {
    res.render('practice1');
});

app.post('/practice2', isLoggedIn, function (req, res) {
    accuracy.push(req.body.accuracy_mountain);
    console.log(accuracy);
    res.render('practice2');
});

app.post('/practice3', isLoggedIn, function (req, res) {
    accuracy.push(req.body.accuracy_tree);
    console.log(accuracy);
    res.render('practice3');
});

app.post('/practice4', isLoggedIn, function (req, res) {
    accuracy.push(req.body.accuracy_goddess);
    console.log(accuracy);
    res.render('practice4');
});


app.get('/report', isLoggedIn, function (req, res) {
    var username = { id: req.user._id, name: req.user.name };
    Stats.find({ username: username }, function (err, allstats) {
        if (err) {
            console.log(err);
        } else {
            console.log(allstats);
            res.render("report", { name: req.user.name, userStats: allstats });
        }
    });
});

app.post("/start", isLoggedIn, function (req, res) {
    accuracy.push(req.body.accuracy_warrior);
    console.log(accuracy);
    var username = { id: req.user._id, name: req.user.name };
    var date = Date.now();
    var accuracy_mountain = Number(accuracy[0]);
    var accuracy_tree = Number(accuracy[1]);
    var accuracy_goddess = Number(accuracy[2]);
    var accuracy_warrior_2 = Number(accuracy[3]);
    var a = accuracy_mountain + accuracy_tree + accuracy_goddess + accuracy_warrior_2;
    console.log(a);
    a /= 4;
    console.log(a);
    console.log(typeof a);
    if (a < 60)
        var description = "Beginner";
    else if (a >= 60 && a < 85)
        var description = "Intermediate";
    else
        var description = "Expert";

    var newStats = { username: username, date: date, accuracy_mountain: accuracy_mountain, accuracy_tree: accuracy_tree, accuracy_goddess: accuracy_goddess, accuracy_warrior_2: accuracy_warrior_2, accuracy: a, description: description };
    accuracy = [];
    Stats.create(newStats, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            console.log("New report logged in!");
            req.flash("success", "Successfully added your today's progress");
            res.redirect("/start");
        }
    })
    // res.render("report", { name: req.user.name});
});

server.listen(PORT, function (err) {
    console.log(`Server is listening on http://localhost:${PORT}`)
});