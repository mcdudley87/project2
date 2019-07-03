var express = require('express');
var router = express.Router();
var db = require('../models'); //double check this path after draft
const axios = require('axios');



//ACADEMY - ALLSPELLS ROUTE
app.get('/academy', function(req, res) {
	var spellsUrl = 'http://www.dnd5eapi.co/api/spells/';
	axios.get(spellsUrl)
	.then(function(apiResponse){
		var spells = apiResponse.data.results;
		res.render('academy', {spells});
	})
});


//CHARACTER ROUTES

//GET characters
router.get('/', function(rec, res) {
	db.character.findAll({where: {userId: req.user.id}})
	.then(function(characters) {
		res.render('characters/index', {characters});
	});
});
//need to be able to post and delete

// POST character to characters
router.post('/', function(req, res){
	db.character.create( {
		name: req.body.name,
		class: req.body.class,
		level: req.body.level,
		userId: req.user.id
	}).then(function() {
		res.redirect('/characters');
	});
});

//show route
router.get('/:id', function(req, res) {
	db.character.findOne({
		where:{id: req.params.id},
		include: [db.grimoire]
	}).then(function(character) {
		res.render('characters/show', {character});
	});
});



//GRIMOIRES ROUTES
// POST grimoire to character   || ** IS THIS RIGHT ** ||
router.post('/:id/grimoires', function(req, res){
	db.grimoire.create( {
		title: req.body.title,
		description: req.body.description,
		characterId: req.params.id
	}).then(function() {
		res.redirect('/characters/' + req.params.id + '/grimoires');
	});
});


//SHOW route for grimoires || **CHECK ME, BRO!!** ||
router.get('/:id/grimoires', function(req, res) {
	db.grimoire.findOne({
		where:{id: req.params.id},
	}).then(function(grimoire) {
		res.render('grimoires/show', {grioire})
	});
});




//SPELLS ROUTES
//GET /grimoire/:id - gets one Spell ID from the DATABASE and uses it to look up details about one spell
router.get('/:id/grimoires/:id/spells', function(req, res){
	var id = parseInt(req.params.id);
	db.grimoire.findByPk(id)
	.then(function(grimoire) {
		axios.get(`http://www.dnd5eapi.co/api/spells/`)
		.then(function(apiResponse){
			res.render('showspell', {spells: apiResponse.data, id});
		})
	});
});

//SHOW spell
router.get('/:id/grimoires/:id/spells/:id', function(req, res){
	var id = parseInt(req.params.id);
	db.grimoire.findByPk(id)
	.then(function(grimoire) {
		axios.get(`http://www.dnd5eapi.co/api/spells/`)
		.then(function(apiResponse){
			res.render('showspell', {spells: apiResponse.data, id});
		})
	});
});






//DELETE route for CHARACTER, GRIMOIRE, SPELL
router.delete('/character/:id', function(req, res) {
	db.grimoire.destroy({
		where: {id: parseInt(req.params.id)}
	}).then(function(----){
		res.redirect('/--?--');
	});
});

router.delete('/grimoire/:id', function(req, res) {
	db.grimoire.destroy({
		where: {id: parseInt(req.params.id)}
	}).then(function(----){
		res.redirect('/--?--');
	});
});

router.delete('/spell/:id', function(req, res) {
	db.grimoire.destroy({
		where: {id: parseInt(req.params.id)}
	}).then(function(----){
		res.redirect('/--?--');
	});
});


module.exports = router;

