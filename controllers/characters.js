var express = require('express');
var router = express.Router();
var db = require('../models'); //double check this path after draft
const axios = require('axios');
const methodOverride = require('method-override');




//CHARACTER ROUTES

//GET characters
router.get('/', function(req, res) {
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

// GET /characters/new 
router.get('/new', (req, res) => {
	res.render('characters/new');
});

//SHOW route
router.get('/:id', function(req, res) {
	db.character.findOne({
		where:{id: req.params.id},
		include: [db.grimoire]
	}).then(function(character) {
		res.render('characters/show', {character});
	});
});

//DELETE character route
router.delete('/:id', function(req, res) {
  db.character.destroy({
    where: {id: req.params.id}
  }).then(function(){
    res.redirect('/characters');
  });
});

//EDIT character route

//GETit for EDIT
router.get('/:id/edit', function(req, res) {
	db.character.findByPk(parseInt(req.params.id))
		.then(function(character) {
			res.render('characters/edit', {character});
		});
});

//UPDATE DAT SHIT
router.put('/:id', function(req, res) {
	var id = parseInt(req.params.id);
		db.character.update({
			name: req.body.name,
			class: req.body.class,
			level: req.body.level
		},
		{ where: {id: id}
	}).then(function(){
		res.redirect("/characters");
	});
});


//GRIMOIRES ROUTES

// POST grimoire to character   
router.post('/:id/grimoires', function(req, res){
	db.grimoire.create( {
		title: req.body.title,
		description: req.body.description,
		characterId: req.params.id
	}).then(function() {
		res.redirect('/characters/' + req.params.id + '/grimoires');
	});
});

router.get('/:id/grimoires/new', (req, res) => {
	res.render('grimoires/new', {cid: req.params.id});
});

//SHOW route for grimoires 
router.get('/:id/grimoires', function(req, res) {
	db.character.findOne({
		where: {id: req.params.id},
		include: [db.grimoire]
	})
	.then(function(character){
		res.render('grimoires/show', {character});
	})
});



//SPELLS ROUTES
//GET /grimoire/:id - gets one Spell ID from the DATABASE and uses it to look up details about one spell
router.get('/:cid/grimoires/:gid/spells', function(req, res){
	var gid = parseInt(req.params.gid);
	db.grimoire.findOne({
		where: {id: gid},
		include: [db.spell]
	})
	.then(function(grimoire) {
		axios.get(`http://www.dnd5eapi.co/api/spells/`)
		.then(function(apiResponse){
			res.render('spells/index', {spells: apiResponse.data.results, grimoire});
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







module.exports = router;

