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
	var cid = parseInt(req.params.cid);

	db.grimoire.findOne({
		where: {id: gid},
		include: [db.spell]
	})
	.then(function(grimoire) {
		axios.get(`http://www.dnd5eapi.co/api/spells/`)
		.then(function(apiResponse){
			res.render('spells/index', {
																		spells: apiResponse.data.results, 
																		grimoire,
																		cid
																	});
		})
	});
});

//SHOW spell 
router.get('/:cid/grimoires/:gid/spells/:id', function(req, res){
	var spellsUrl = 'http://www.dnd5eapi.co/api/spells/' + req.params.id;
	var cid = parseInt(req.params.cid);
	var gid = parseInt(req.params.gid);

	axios.get(spellsUrl)
	.then(function(apiResponse){
    console.log(apiResponse.data)
    var spell = apiResponse.data;
    res.render('spells/showspell',  {
																	spell, 
																	cid,
																	gid
																});
  });
});


//working POST route for SPELLS || THIS NEEDS SOME HELP ||
router.post('/:cid/grimoires/:gid/spells/:sid', function(req, res){
	// TODO: Capture notes during form submission. 
	notes = "";
	
	db.spell.findOrCreate( {
		name: req.body.name,
		url: req.body.url
	});
	
	db.grimorespells.findOrCreate( {
		spellId: req.params.id,
		grimoireId: req.params.gid,
		notes: notes
	} ).then(function() {
		res.redirect('/characters/'+ req.params.cid +'/grimoires/'+ req.params.gid +'/spells'); //fix this path
	});
});





module.exports = router;

