// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken');  // used to create, sign, and verify tokens
var config = require('./app/config');  // get our config file
// get our mongoose models
var User       = require('./app/models/user'); 
var Doctor     = require('./app/models/doctor');
var Speciality = require('./app/models/speciality');

/*var uristring = process.env.MONGOLAB_URI || 
  				process.env.MONGOHQ_URL  || 
  				'mongodb://127.0.0.1/doctordblocal';
*/
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;   // used to create, sign, and verify tokens
// Conecta com base de dados... 
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

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
	res.send(' :) API Aplicativo doctorApp - rodando OK ;p ');
});

// ---------------------------------------------------------
// Instancia Router para utilizar nas rotas da api
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// Existe temporariamente.......
// Autenticação (não necessita de acesso middleware pois irá gerar um novo TOKEN)
// Existe temporariamente.......
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/auth', function(req, res) {

	var appUserGen = require('./app/doctorapp.json');
	//res.json(appUserGen);

	var token = jwt.sign(appUserGen, app.get('superSecret'), {
		//		expiresInMinutes: 1440 // expires in 24 hours
	});

	res.json({
		success: true,
		message: 'Novo TOKEN (API_KEY)',
		token: token
	});

});


// ---------------------------------------------------------
// route middleware ==> Function para verificação de TOKEN de autenticação da API
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// Verifica no 'header' ou a 'url' ou metodo 'post' para verificar se foi informado o TOKEN
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {
		// Verificar token (api_key)
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Falha na verificação do TOKEN.' });		
			} else {				
				// SE tudo der certo, aqui é salva a 'autenticação' ppara usar nas outras
				req.decoded = decoded;	
				next();
			}
		});
	} else {
		// Se não for enviado token (api_key) retorna erro.		
		return res.status(403).send({ 
			success: false, 
			message: 'TOKEN não informado!'
		});		
	}
});


// Rotas autenticadas...... 

/*
app.get('/api', function(req, res){
	res.json({ success: true });
});
*/

// Pega todos os medicos no DB
apiRoutes.get('/doctors', function(req, res) {
	Doctor.find({}, function(err, doctors) {
		res.json(doctors);
	});
});

// Pega todos as especialidades no DB
apiRoutes.get('/specialities', function(req, res) {
	Speciality.find({}, function(err, specs) {
		res.json(specs);
	});
});


app.use('/api', apiRoutes);




// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);