// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken');       // used to create, sign, and verify tokens
var config = require('./app/config');      // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Doctor = require('./app/models/doctor');

var uristring = process.env.MONGOLAB_URI || 
  				process.env.MONGOHQ_URL  || 
  				'mongodb://localhost/HelloMongoose';
  				
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;   // used to create, sign, and verify tokens
//mongoose.connect(config.database);     // Conecta com base de dados... 
mongoose.connect(config.database, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + config.database + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + config.database);
  }
});





app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================
/*app.get('/setup', function(req, res) {

	var newDoc = {};

    newDoc = new Doctor({
	name: 'Leonardo Prates de Lima', 
	contact: '(54)3202-9000', 
	address: 'Rua Moreira César, 2400',
	ranking: 6,
	active: true});
    newDoc.save(function(err) {
		if (err) throw err;
		console.log('Leonardo Prates Salvo com sucesso.');		
	});


    newDoc = new Doctor({
    name: 'Aurea dos Santos Celli',
    contact: '(54)3027-7787', 
    address: 'R Garibaldi, 680 - Sl. 101 (Centro)',
    ranking: 3,
	active: true});
	newDoc.save(function(err) {
		if (err) throw err;
		console.log('Aurea dos Santos Celli Salvo com sucesso.');		
	});


	newDoc = new Doctor({
    name: 'Alvaro Jose Castilhos', 
    contact: '(54)3027-7787', 
    address: '5432214398 Garibaldi, 789 (Exposicao)',
    ranking: 1,
	active: true});
	newDoc.save(function(err) {
		if (err) throw err;
		console.log('Alvaro Jose Castilhos Salvo com sucesso.');		
	});


	newDoc = new Doctor({
    name: 'Cristina Worm Weber', 
    contact: '(54)3027-7787',
    address: '5430272929/5432239909 Rua Ernesto Alves, 1887 - sala 602 (Centro)',
    ranking: 5,
	active: true});
	newDoc.save(function(err) {
		if (err) throw err;
		console.log('Cristina Worm Weber Salvo com sucesso.');		
	});


	newDoc = new Doctor({
    name: 'Dagoberto Vanoni de Godoy',         
    contact: '(54)3027-7787', 
    address: '5432284882 - Rua Arcy Rocha Nóbrega, 401 S 201',
	ranking: 2,
	active: true});
	newDoc.save(function(err) {
		if (err) throw err;
		console.log('Dagoberto Vanoni de Godoy Salvo com sucesso.');		
	});

	res.json({ success: true });

});*/

app.get('/api', function(req, res){
	res.json({ success: true });
});

// Pega todos os medico salvos na apos realzia o SetUp da aplicação
app.get('/doctors', function(req, res) {
	Doctor.find({}, function(err, doctors) {
		res.json(doctors);
	});
});


// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send(' :) API Aplicativo doctorApp - rodando OK ;p ');
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);