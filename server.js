// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cors 		= require('cors');

var jwt    = require('jsonwebtoken');  // used to create, sign, and verify tokens
var config = require('./app/config');  // get our config file
// get our mongoose models -- Criar novo arquivo :) 
var User        = require('./app/models/user'); 
var Doctor      = require('./app/models/doctor');
var Speciality  = require('./app/models/speciality');
var Person      = require('./app/models/person');
var Appointment = require('./app/models/appointment');



var corsOptions = {
  origin: 'http://localhost:8100'
};

// Criar uma lib com isso .... :     
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
// =====================================================================================================================


var uristring = process.env.MONGOLAB_URI || 
  				process.env.MONGOHQ_URL  || 
  				'mongodb://dctapp_1gg9l9fb:Doctor@pp@123@ds047632.mongolab.com:47632/heroku_1gg9l9fb';

    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;   // used to create, sign, and verify tokens
// Conecta com base de dados... 
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    res.send('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    res.send('Succeeded connected to: ' + uristring);
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
	/*var token = req.body.token || req.param('token') || req.headers['x-access-token'];

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
	}*/

 	res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


// Rotas autenticadas...... 


apiRoutes.get('/api', cors(), function(req, res){
	res.json({ success: true });
});


apiRoutes.get('/setup', cors(), function(req, res){
	var newSpec = {},
	    contadorSpec = 0,
	    contMedico   = 0,
	    specialities = require('./app/setup/speciality.json');

	//specialities.forEach(function(element, index, array){
		contadorSpec++;
		newSpec = new Speciality({description: 'Psiquiatria'});
	   	newSpec.save(function(err) {
			if (err) throw res.json({Error: 'Erro ao salvar especialidades'});		
			contadorSpec++;
			res.json({Especialides: contadorSpec})
			console.log('Salvao com sucesso.');
		});
	//}); 


	/*Speciality.findOne({"description": "Psiquiatria"}, function(err, specs) {		
		var Medico = new Person({"name": "Leonardo",
			                 "lastname": "Prates de Lima",  
			                   "cardId": 27123822000116, //CPF/CNPJ
			                   "userId": 5499652358, //Celular usuario/ID Medico  
			                "verfifyID": "",         // Cod verificação do Numero de celular.  
			                   "doctor": { "crmId": "014605",
			                             "ranking": 4,
			                              "adress": "Rua Moreira César, 2400",  
			                             "contact": 5432029000,
			                          "speciality": spec, // embedded document
			                         //"healthCare": hCare // embedded document
			         					}
			     		});     

		Medico.save(function(err) {
			if (err) throw err;	
			contMedico++;
		});

	});

	res.json([{Especialides: contadorSpec},
		     {Medicos: contMedico}]);*/

});


// Pega todos os medicos no DB
apiRoutes.get('/doctors', cors(), function(req, res, next) {
	Person.find({'doctor': {'$exists': true} }, function(err, doctors) {
		res.json(doctors); 
	});
});

// Pega todos as especialidades no DB
apiRoutes.get('/specialities', function(req, res) {
	Speciality.find({}, function(err, specs) {
		res.json(specs);
	});
});


// Cria nova consulta
apiRoutes.post('/appointment', function(req, res){
	//var _personD = new Person({});
	//var user = Person.find({  , 'doctor': {'$exists': false} });
	var _user = {};
	Person.findOne({'userId': 5499544269 }, function(err, user){
		if(err) _user = {success: false};

		Person.findOne({'doctor': {'$exists': true }}, function(err, doctor){
			//res.json([user, doctor]);
				
			//res.json({nome: doctor.doctor.speciality._id});

					
			var newDoc  = new Appointment({    	
			   doctorID: doctor._id,	
			   //$push : {doctorID: doctor},
			appointments: {dateTo: Date('2015-25-08'),
			 			 isEnable: true,
						   hoursTo: { hours: 0830,	
						   	         person: user._id,
					                   name: user.name,
					             //speciality: specID,
					               realized: false,
					                 raking: 0,
					           isHealthCare: false}
		                }
		            });

			//newDoc.doctorID.$push(doctor);
		    //newDoc.appointment.person.push(user);		    

		    res.json(newDoc);
		    /*newDoc.save(function(err) {
				if (err) res.json(err) ;
				res.json(newDoc);
			});*/
		}); //Doctor		
	}); 

});


app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);