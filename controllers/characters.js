var express = require('express');
var router = express.Router();
var db = require('../models'); //double check this path after draft
const axios = require('axios');


//CHARACTER ROUTES



//SPELLS ROUTES

//GET spell, render in showspell.ejs to see one
router.get('/', function(req, res) {
	db.dndspellbook.findAll()
	.then(function(dndspellbooks){
		res.render('grimoire', {dndspellbooks});
	});
});
// .forEeach spellbook in the view page



// POST spell - receive the nameof a spell and add it to the database. Redirect to Spellbook
router.post('/', function(req, res){
	db.dndspellbook.create( {
		name: req.body.name
	}).then(function() {
		res.redirect('/grimoire');
	});
});

//GET /grimoire/:id - gets one Spell ID from the DATABASE and uses it to look up details about one spell
router.get('/:id', function(req, res){
	var id = parseInt(req.params.id);
	db.dndspellbook.findByPk(id)
	.then(function(--?--) {
		axios.get(`http://www.dnd5eapi.co/api/spells/`)
		.then(function(apiResponse){
			res.render('showspell', {--?--: apiResponse.data, id});
		})
	});
});



//DELETE route
router.delete('/:id', function(req, res) {
	db.dndspellbook.destroy({
		where: {id: parseInt(req.params.id)}
	}).then(function(----){
		res.redirect('/--?--');
	});
});

module.exports = router;

