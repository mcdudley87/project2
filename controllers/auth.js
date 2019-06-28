const express = require('express');
const db = require('../models');
const passport = require('../config/passportConfig');
const router = express.Router();


//GET /auth/signup - sends the signup form
router.get('/signup', function(req, res) {
  res.render('auth/signup');
});
//GET /auth/signup - receives data from that form above.
router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      console.log("User was create, not found.");
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in!'
      })(req, res); //immediate invoked function expression, 'IIFE', "iffy".
    } else {
      console.log("Email already exists.");
      req.flash('error', '❌❌Email already exists!❌❌');
      res.redirect('/auth/signup');
    } 
  }).catch(function(error) {
    console.log("Error:", error.message);
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

//GET /auth/login - sends the login form
router.get('/login', function(req, res) {
  res.render('auth/login');
});
// POST /auth/login - does the athentification
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'You have logged in. Heh, log...',
  failureFlash: 'Invalid username/password. Get it a wheelchair.'
}));

//GET /auth/logout - deletes the session
router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  req.flash('success', 'You have logged out? Don\'t leave me...');
  //attaching flash messages that will be sent on the next response.
  res.redirect('/');
});


module.exports = router;
