require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
//Module allows use of session
const session = require('express-session');
//Imports passport local strategy
const passport = require('./config/passportConfig');
//module for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const axios = require('axios');
const methodOverride = require('method-override');

// This is only used by the session store
const db = require('./models');

const app = express();

//This line makes the session use sequelize to write session data to a postgres table.
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
  db: db.sequelize, 
  expiration: 1000 * 60 * 30
});

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(helmet());
app.use(methodOverride('_method'));

//Configures express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, 
  saveUninitialized: true,
  store: sessionStore
}));

// Use this line once to set up the store table
sessionStore.sync();

//Starts the flash middleware
app.use(flash());

//Link passport to the express session
//MUST BE BELOW SESSION
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res, next){
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});



app.get('/', function(req, res) {
  res.render('index');
});

//ACADEMY 

//SHOW all spells
app.get('/academy', function(req, res) {
	var spellsUrl = 'http://www.dnd5eapi.co/api/spells/';
	axios.get(spellsUrl)
	.then(function(apiResponse){
    var spells = apiResponse.data.results;
    console.log(spells)
		res.render('academy', {spells});
	})
});

//SHOW one spell 

app.get('/academySpell/:id', function(req, res){
  var spellsUrl = 'http://www.dnd5eapi.co/api/spells/' + req.params.id;
	axios.get(spellsUrl)
	.then(function(apiResponse){
    console.log(apiResponse.data)
    var spell = apiResponse.data;
    res.render('academySpell', {spell});
  });
});



app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));
app.use('/characters', require('./controllers/characters')); 

var server = app.listen(process.env.PORT || 3000);

module.exports = server;

