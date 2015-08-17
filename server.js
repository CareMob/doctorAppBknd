// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
//var cors 		= require('cors');

var jwt    = require('jsonwebtoken');  // used to create, sign, and verify tokens
var config = require('./config/config');  // get our config file

// get our mongoose models -- Criar novo arquivo :) 
var User        = require('./app/models/user'); 
var Doctor      = require('./app/models/doctor');
var Test	    = require('./app/models/doctor');
var Speciality  = require('./app/models/speciality');
var Person      = require('./app/models/person');
var Appointment = require('./app/models/appointment');
var Schedule    = require('./app/models/schedule');



var corsOptions = {
  origin: 'http://localhost:8100'
};

// Criar uma lib com isso .... :     
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
// =====================================================================================================================


/*var uristring = process.env.MONGOLAB_URI || 
  				process.env.MONGOHQ_URL  || 
  				'mongodb://127.0.0.1/doctordblocal';
*/
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;   // used to create, sign, and verify tokens
var connStatus = "";
// Conecta com base de dados... 
mongoose.connect(config.database, function (err, res) {
  if (err) { 
    connStatus = 'ERROR connecting to: ' + config.database + '. ' + err;
  } else {
    connStatus = 'Succeeded connected to: ' + config.database;
  }
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
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
	res.send(' :) API Aplicativo doctorApp - rodando OK: Conexão: ' + connStatus);
});

// basic route (http://localhost:8080)
app.get('/dashboard', function(req, res) {
	res.sendfile('./public/index.html');
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


apiRoutes.get('/conn', function(req, res, next){
	res.json({ success: true,
			   connected: connStatus });
});


apiRoutes.get('/setup', function(req, res, next){
	var newSpec = {},
	    contadorSpec = 0,
	    contMedico   = 0,
	    specialities = require('./app/setup/speciality.json');

	/*specialities.forEach(function(element, index, array){
		//contadorSpec++;
		newSpec = new Speciality({description: element.description.toProperCase()});
	   	newSpec.save(function(err) {
			if (err){
				res.json(err)
			};		
			contadorSpec++;
			//res.json({Especialides: contadorSpec})
			//console.log('Salvao com sucesso.');
		}); 
	}); */

	//Speciality.findOne({"description": "PSIQUIATRIA"}, function(err, specs) {
		var Medico = new Person({"name": "Mauricio",
			                 "lastname": "Teles Faoro",  
			                   "cardId": 0, //CPF/CNPJ
			                   "userId": 5491001493, //Celular usuario/ID Medico  
			                "verfifyID": "6f60dfe56ee8437a8d16ed8" //,         // Cod verificação do Numero de celular.  
			                   /*"doctor": { "crmId": "014605",
			                             "ranking": 4,
			                              "adress": "Rua Moreira César, 2400",  
			                             "contact": 5432029000,
			                          "speciality": [specs] // embedded document
			                         //"healthCare": hCare // embedded document
			         					}*/
			     		});     

		Medico.save(function(err) {
			res.json(Medico);
			//if (err) throw err;	
			//contMedico++;
		});

	//});

	/*res.json([{Especialides: contadorSpec},
		     {Medicos: contMedico}]);*/

});

apiRoutes.get('/setupSchedule', function(req, res, next){

   var year       = 2015,
       month      = 10, 
       inicialDay = 1,
       finalDay   = 31,
       appointmenDuration = 15,
       startMorningTime = 8,
       endMorningTime = 12,
       startAfteernoonTime = 14,
       endAfteernoonTime = 18
       newSchedule = new Schedule();
	   newSchedule.doctor = '55c3eeb240c3f93c13faa201', //mongoose.Schema.Types.ObjectId('55c3eeb240c3f93c13faa201'); // Pompeu Schema.Types.ObjectId,
       newSchedule.month  = month;
       newSchedule.year   = year
       hoursPerDay  = [],
       time    = startMorningTime,
       minutes = 0,
       fullTime = time,
       hours = [],
       appointmentDate = Date(); 

	while (fullTime <= endAfteernoonTime) {
          
		if ((time + (minutes / 100) + (appointmenDuration / 100)) < (time + 0.6) ){
            minutes += appointmenDuration;

	 	} else {
	 		minutes += appointmenDuration - 60;
    		time++;
	 	}

	 	fullTime = time + (minutes / 100);

	 	if (fullTime >= endMorningTime && fullTime < startAfteernoonTime) {
	 		time = startAfteernoonTime;
	 		minutes = 0;
	 		fullTime = time;
	 	}

		if (fullTime < endAfteernoonTime){
          hours = new Object();
          hours.hour = time + ":" + minutes;
          hoursPerDay.push(hours);
       }
	
    } 

    
    for (currenteDay = 1; currenteDay < 30; currenteDay++){

        appointmentDate = new Date(year,month,currenteDay);
       //somente dias de semana
        if (appointmentDate.getDay () > 0 && appointmentDate.getDay () < 6){

            newSchedule.scheduleDate.push({day : currenteDay,
            							   scheduleTime: hoursPerDay});

	    }
	}
    

	newSchedule.save(function(err){
		res.json(newSchedule);
	});
	
});


// Pega todos os horarios no DB
apiRoutes.post('/schedule', function(req, res, next) {

	/**teste **/
	var schdlGetFree = req.body,
		parShearch = {'dayIni' : 01,
					'dayEnd'   : 31,
					'monthIni' : schdlGetFree.monthIni,
					'monthEnd' : schdlGetFree.monthEnd,
					'yearIni'  : 2015,
					'yearEnd'  : 2015,
					'doctor'   : schdlGetFree.doctorId}
	/* ------------------------------------------- '55c3eeb240c3f93c13faa201' */
	/*Schedule
		scheduleDate
			scheduleTime
		*/
	
	var freeHours = [],
	    schFree   = [],
		testeReg = 0,
		lgPaciente = 0,
		freeTime = new Schedule();
	// console.log("busca horarios");
	

	Schedule.find({'month'  : {$gte: parShearch.monthIni, $lte: parShearch.monthEnd},
				   'year'   : parShearch.yearIni,
				   'doctor' : parShearch.doctor}, function(err, scheduleFind){		   	

			// Varre a agenda do medico para verificar disponibilidade de horario
			scheduleFind.forEach(function(scheduleFind){			   	
			   	scheduleFind.scheduleDate.forEach(function(result){
			   		//console.log('Dia: ' + result.day);

			   		//Verifica intervalo de dias selecionado.
			   		if(result.day >= parShearch.dayIni 
			   				&& result.day <= parShearch.dayEnd){		   		 
			   		 	// Limpa lista de horarios do dia anterior....
			   		 	freeHours = [];
			   		 	// Varre as os horarios disponivels para retorno
			   			result.scheduleTime.forEach(function(hours){			   				
			   				if(!hours.pacient){
			   					//console.log("@PASSO 1: " + teste123.pacient + " Hora: " + teste123.hour);
			   					freeHours.push(hours);
			   				} 						   				
			   			});
			   			schFree.push({'day' : result.day,
			   						'month' : scheduleFind.month,
			   			    		  '_id' : result._id,
			   			    	 'doctorId' : result.doctor,			   						   
			   			     'scheduleTime' : freeHours});
			   		} // Teste intervalo de dicas			   		

		   		}); //Foreach do dia				   	


			}); // Foreach do Finf

			//result.scheduleTime
			//Retorna horaris disponivel para seleção de consulta
			res.json(schFree);

			//Return FreeTime Array.
			//res.json({'DiasLivres' : freeHours});

	}); // Find

	/*Schedule.find({'month' : 9,
				   'year'  : 2015,
				   'doctor' : "55c3eeb240c3f93c13faa201",
				   'scheduleDate.day' 
				   'scheduleDate.scheduleTime.patient' : {'$exists': false}}, function(err, freeTime){
		res.json(freeTime);
	});*/
});




// Add novos medicos no DB
apiRoutes.post('/doctors', function(req, res, next) {

	var doctor = new Person(req.body);
	doctor.save(function(err) {
		if (err){
			//throw err;			
			res.json(err);
		} 		
		console.log(doctor);	
		res.json(doctor);
	});

});


// Pega todos os medicos no DB
apiRoutes.get('/doctors', function(req, res, next) {
	Person.find({'doctor' : {'$exists': true} }, function(err, doctors) {
		res.json(doctors); 
	});
});
/*
// Add novos medicos no DB
apiRoutes.post('/doctors', function(req, res, next) {

	var doctor = new Person(req.body);
	doctor.save(function(err) {
		if (err){
			//throw err;			
			res.json(err);
		} 			
		res.json(doctor);
	});
});*/


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

apiRoutes.get('/consultas', function(req, res){

	/*var _data = new Date(),
		_mes  = _data.getMonth(),
		_dia  = _data.getDay();

	res.json({data: _data,
		      mes: _mes,
		      dia: _dia,
		      teste: now.getTime() });*/




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