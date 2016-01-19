// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var objectId    = require('mongoose').Types.ObjectId;
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
var City		= require('./app/models/city');



var corsOptions = {
  origin: 'http://localhost:8100'
};

// ADD em Libs ... :     
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
//appointmentStatusEnum = function(param){
	/* -------------- Status ------------|
  | Cod | Desc          | by who?      |
  |  00 | marcada       | Admin/user   |
  |  01 | Confirmada    | Admin        |
  |  02 | Cancelada     | User         |
  |  03 | Realizada     | User/Admin   | 
  |  04 | Não Realizada | User/Admin   |56040e7a9569d76c06456d2e
  |------------------------------------|*/
	var statusEnum = {HIT: 0,
			    CONFIRMED: 1,
			     CANCELED: 2,
			     REALIZED: 3,
			  NOTREALIZED: 4, 
			   properties: {
						0: {description: "Marcada",       value: 0, code: "H"},
						1: {description: "Confirmada",    value: 1, code: "C"},
						2: {description: "Cancelada",     value: 2, code: "D"},
						3: {description: "Realizada",     value: 3, code: "R"},
						4: {description: "Não Realizada", value: 4, code: "N"}
				  }
				};
/*
	//Get by Desc
	if(!isNaN(param)){
		return statusEnum.properties[param].description;
	}else{
		return statusEnum;
	}
}*/


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

app.use(express.static(__dirname + '/public'));  // set the static files location /public/img will be /img for users
app.set('superSecret', config.secret);          // secret variable

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
 	res.header("Access-Control-Allow-Methods", "GET,POST,PUT");
 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


// Rotas autenticadas...... 

apiRoutes.get('/conn', function(req, res, next){
	res.json({ success: true,
			   connected: connStatus });
});

apiRoutes.get('/setupSchedule', function(req, res, next){

   var year       = 2015,
       month      = 12, 
       inicialDay = 1,
       finalDay   = 31,
       appointmenDuration = 15,
       startMorningTime = 8,
       endMorningTime = 12,
       startAfteernoonTime = 14,
       endAfteernoonTime = 18
       newSchedule = new Schedule();
	   newSchedule.doctor = objectId("55dfb017e1b6cb7c11d1c29f"), //mongoose.Schema.Types.ObjectId('55c3eeb240c3f93c13faa201'); // Pompeu Schema.Types.ObjectId,
       newSchedule.month  = month;
       newSchedule.year   = year
       hoursPerDay  = [],
       time    = startMorningTime,
       minutes = 0,
       fullTime = time,
       hours = [],
       appointmentDate = Date(),
       specialityAux = []; 

     var query = Speciality.find().where({'description' : 'Ortopedia E Traumatologia'});
     query.exec(function(err, result){
        	//specialityAux = result; 
        	newSchedule.speciality = result;
        

        //res.json(specialityAux);

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
          //Atribui horas.
          hoursPerDay.push(hours);
       }	
    } //While 
    
    for (currenteDay = 1; currenteDay <= 31; currenteDay++){
        appointmentDate = new Date(year,month-1,currenteDay);
       //somente dias de semana
        if (appointmentDate.getDay () > 0 && appointmentDate.getDay () < 6){

        	//Atribui dias.
            newSchedule.scheduleDate.push({day : currenteDay,
            							   scheduleTime: hoursPerDay});
	    }
	}   
	newSchedule.save(function(err){
		res.json(newSchedule);
	});	

	}); // especialidade
});

/**
* ===================================================================================================
* ======================================= USERS ROUTES ==============================================
* ===================================================================================================
*/
// Add novos Users no DB
apiRoutes.route('/person')
	.post(function(req, res, next) {		
		
		var newPerson = new Person(req.body);		
		Person.findOne({'userId': newPerson.userId}, function(err, user){
			//console.log(err);
			if(user){				
				//console.log("Atualzia user");
				user.verfifyID = newPerson.verfifyID;
				user.save(function(err){
					if(err)
						res.json(err);				
					res.json(user);
				});

			}
			else saveNewUser();
		});

		saveNewUser = function(){
			//console.log("SALVA user");
			newPerson.save(function(err) {
				if (err) 
					res.json(err);				
				res.json(newPerson);
			});
		};		

		
	}); //Post person

apiRoutes.route('/person/:id')
	.put(function(req, res, next) {
		Person.findById(req.params.id, function(err, person){
			if(err)
				res.send(err);
			//Atualiza campos
			person.name     = req.body.name;
			person.lastname = req.body.lastname;

			person.save(function(err){
				if(err)
					res.send(err);

				res.json(person);
			});
		});		
	}); //Post person

/**
* ===================================================================================================
* ================================ APPOINTMENTS ROUTES ==============================================
* ===================================================================================================
*/
// Pega todos os horarios no DB
apiRoutes.post('/schedule', function(req, res, next) {

	if(!req.body)
		res.json({success: false});

	var schdlGetFree = req.body, //JSON.parse(req.query.param),	
		iniPer       = new Date(schdlGetFree.perIni),
		endPer       = new Date(schdlGetFree.perEnd),
		parShearch = {'dayIni' : iniPer.getDate(),
				    'dayEnd'   : endPer.getDate(),
					'monthIni' : iniPer.getMonth() + 1,
					'monthEnd' : endPer.getMonth() + 1,
					'yearIni'  : iniPer.getFullYear(),
					'yearEnd'  : endPer.getFullYear(),
					'doctor'   : schdlGetFree.doctorId},			
	    freeHours = [],
	    schFree   = [],
		testeReg = 0,
		lgPaciente = 0,
		freeTime = new Schedule()
		today = new Date();

	//console.log("@POA 1 " + today.getDate());

	//Filtra horarios disponiveis by DoctorId
	Schedule.find({'month'  : {$gte: parShearch.monthIni, $lte: parShearch.monthEnd},
				   'year'   : parShearch.yearIni,
				   'doctor' : parShearch.doctor}, function(err, scheduleFind){	
			// Varre a agenda do medico para verificar disponibilidade de horario
			scheduleFind.forEach(function(scheduleFind){			   					
			   	scheduleFind.scheduleDate.forEach(function(result){
			   		//Verifica intervalo de dias selecionado.			   					   		
			   		if(result.day >= parShearch.dayIni 
			   				&& result.day <= parShearch.dayEnd){
			   				//&& result.day >= today.getDate()){		   		 
			   		 	// Limpa lista de horarios do dia anterior....
			   		 	freeHours = [];
			   		 	// Varre as os horarios disponivels para retorno
			   			result.scheduleTime.forEach(function(hours){			   				
			   				if(!hours.pacient){
			   					//console.log("@PASSO 1:  Hora: " + hours.hour);
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
			//console.log(schFree);
			res.json(schFree); //Retorna horaris disponivel para seleção de consulta
	}); // Find	

}); //GET Schedule

// Get by Id Benef
apiRoutes.get('/schedule/:userId', function(req, res, next) {

	if(!req.params.userId)
		res.json({success: false});

	var dateTime     = new Date,
		month        = dateTime.getMonth() + 1,
		appointments = [],
		appmtHours   = [],
		lastDoctor   = objectId(), 
		query;
	
	//Filtra horarios disponiveis by userId
	Schedule.find({'month'  : {$gte: month},
				   'year'   : {$gte: dateTime.getFullYear()} }, function(err, scheduleFind){
			scheduleFind.forEach(function(scheduleFindSec){	
				   	scheduleFindSec.scheduleDate.forEach(function(result){	
				   		 	appmtHours = []; // Limpa lista de horarios do dia anterior....			   		 	
				   			result.scheduleTime.forEach(function(hours){ // Varre as os horarios disponivels para retorno
				   				if(hours.pacient
				   					&& hours.pacient == req.params.userId //"55c7f83a3edd7aa419da4fc9"
				   					&& hours.status  == statusEnum.HIT
				   					|| hours.status  == statusEnum.CONFIRMED ){ // !=2
				   					appmtHours.push(hours);			   					
				   				} 						   				
				   			});
				   			if(appmtHours.length > 0){			   	
					   				appointments.push({'date' : scheduleFindSec.month+'/'+result.day+'/'+scheduleFindSec.year,
					   						     'screenDate' : result.day+'/'+scheduleFindSec.month+'/'+scheduleFindSec.year,
					   							   'doctorId' : scheduleFindSec.doctor,					   							 
					   							 'doctorName' : scheduleFindSec.docName,  // Paliativo
					   							 'speciality' : scheduleFindSec.specdesc, // Paliativo
					   							        '_id' : result._id,				   						  
					   		 	    		   'scheduleTime' : appmtHours});				   				
				   			}
			   		}); //Foreach do dia
			}); // Foreach do Find		

			res.json(appointments); // teste MMenegat 
			
	}); // Find	
});
/*-----------------------------------------------------------------------*/
/*---------------- ROTA TEMPORARIA ------------------------------------- */
/*-----------------------------------------------------------------------*/
// Get by Id Benef
apiRoutes.get('/scheduleold/:userId', function(req, res, next) {

	if(!req.params.userId)
		res.json({success: false});

	var dateTime     = new Date,
		month        = dateTime.getMonth() + 1,
		appointments = [],
		appmtHours   = [];
	
	//Filtra historico by userId
	Schedule.find({'month'  : {$lte: month},
				   'year'   : {$lte: dateTime.getFullYear()}}, function(err, scheduleFind){
			scheduleFind.forEach(function(scheduleFindSec){	
				   	scheduleFindSec.scheduleDate.forEach(function(result){	
				   		 	appmtHours = []; // Limpa lista de horarios do dia anterior....			   		 	
				   			result.scheduleTime.forEach(function(hours){ // Varre as os horarios disponivels para retorno
				   				if(hours.pacient
				   			    	&& hours.pacient == req.params.userId //"55c7f83a3edd7aa419da4fc9"
				   					&& hours.status  != statusEnum.HIT
				   					&& hours.status  != statusEnum.CONFIRMED ){
				   					appmtHours.push(hours);			   					
				   				} 						   				
				   			});
				   			if(appmtHours.length > 0){			   	
					   				appointments.push({'date' : scheduleFindSec.month+'/'+result.day+'/'+scheduleFindSec.year,
					   						     'screenDate' : result.day+'/'+scheduleFindSec.month+'/'+scheduleFindSec.year,
					   							   'doctorId' : scheduleFindSec.doctor,					   							 
					   							 'doctorName' : scheduleFindSec.docName,  // Paliativo
					   							 'speciality' : scheduleFindSec.specdesc, // Paliativo
					   							        '_id' : result._id,				   						  
					   		 	    		   'scheduleTime' : appmtHours});				   				
				   			}
			   		}); //Foreach do dia
			}); // Foreach do Find		

			res.json(appointments); // teste MMenegat 
			
	}); // Find	
});



//Salva Consulta
apiRoutes.post('/appointment', function(req, res, next) {
    //console.log(req.body);
    var param  =  req.body,
        result = {};          
    //Solução Cav, funciona....     ObjectId("55dfb017e1b6cb7c11d1c499") Dia 22 - 15:45
    Schedule.find({'scheduleDate.scheduleTime._id': param._hourId}, //objectId("55dfb017e1b6cb7c11d1c499")}, //param._hourId }, 
                  {"scheduleDate.scheduleTime.$"  : true }, function(err, schedule){      
       if(!err){
           schedule.forEach(function(schdlDate){
                schdlDate.scheduleDate.forEach(function(schdlTime){
                    schdlTime.scheduleTime.forEach(function(freeHours){                        
                        if(freeHours._id == param._hourId){ //'55dfb017e1b6cb7c11d1c499'
                            freeHours.pacient = param._userId; // Menegat 55e3720e46d781a2480f80e2 - Cav - objectId("55c7f83a3edd7aa419da4fc9");
                            freeHours.status  = 0;
                            freeHours.ranking = 0;
                            //Gera update na base de dados...
                            Schedule.update({ '_id' : schdlDate._id,
                                    //'scheduleDate._id' : ObjectId("55dbbfaaa6f1da981dd0a527"),
                                     'scheduleDate.scheduleTime._id' : param._hourId}, //objectId("55dfb017e1b6cb7c11d1c499")
                                      {$set : {'scheduleDate.$.scheduleTime' : schdlTime.scheduleTime }}, function(err, isUpdated){
                                      res.send(isUpdated)
                                });
                        }
                    });
                });
           });
        }else{
            result = {success: false,
                        error: handleError(err)};
        } // else !err       
    });
});//Post Schedule

//Altera Registro de Consulta
apiRoutes.put('/appointment', function(req, res, next) {
    //console.log(req.body);
    var param  =  req.body,
        result = {};          

    console.log(param);
    
    Schedule.find({'scheduleDate.scheduleTime._id': param._hourId}, //objectId("5604010a778521840de5f883")}, //}, 
                  {"scheduleDate.scheduleTime.$"  : true }, function(err, schedule){      
       if(!err){
           schedule.forEach(function(schdlDate){
                schdlDate.scheduleDate.forEach(function(schdlTime){
                    schdlTime.scheduleTime.forEach(function(freeHours){                        
                        if(freeHours._id == param._hourId){ //'5604010a778521840de5f883'  param._hourId                           
                        	freeHours.status  = param.status; // 
                            freeHours.ranking = param.rating; // 
                            //Gera update na base de dados...
                            Schedule.update({ '_id' : schdlDate._id,                               
                                     'scheduleDate.scheduleTime._id' : param._hourId}, //objectId("5604010a778521840de5f883")  param._hourId
                                      {$set : {'scheduleDate.$.scheduleTime' : schdlTime.scheduleTime }}, function(err, isUpdated){
                                      res.send(isUpdated);
                            });
                        }
                    });
                });
           });
        }else{
            result = {success: false,
                        error: handleError(err)};
        } // else !err       
    });
});//Post Schedule

/**
* ===================================================================================================
* ================================ DORCTORS ROUTES ==================================================
* ===================================================================================================
*/

apiRoutes.get('/sync', function(req, res){

var getDoctorByID = function(idList) { // <-- no callback here 


	/*
.where({'name': "55bad6f4059e307c146de7fd"})
		.where({'_id': "55f03979b5036ee01b8b5df1"}).exec(function(err, docResult){
	*/

	doctorsAvail = [];
	var limit = idList.length - 1;
	//for(var i = 0; i <= limit; i++){		
		//Person.findOne({'_id' : idList[i]._idDoc},
		Person.find({})
		//.where({'name': "Carlos"})
		.and({'name': "Leonardo", 'name': "Carlos"}).exec(function(err, docResult){
	    	console.log('@PASSO 2');
	    	res.send(docResult);
	    	//return docResult;
	    	doctorsAvail.push(docResult);
	    });
	//}

	console.log('@PASSO 3');
	console.log(doctorsAvail);
    
    //return a + b; // just return a value 
    
}
 
 var medicos = [],
 	 appmtHours = []
 	 wait       = true;


    Schedule.find({}, function(err, scheduleResult){

    	//console.log('schedule 1');
    	
    	scheduleResult.forEach(function(scheduleResult){	

    		//console.log('schedule 2');
								
			   	scheduleResult.scheduleDate.forEach(function(result){	

			   		//console.log('schedule 3');
			   		/*------------------------------------------------------------------*/
			   		/*---------------- DEIXAR COMENTADO POR EM QUANTO ------------------*/	   		
			   		/*------------------------------------------------------------------*/
			   		//if(result.day >= dateTime.getDate()){
			   		 	appmtHours = []; // Limpa lista de horarios do dia anterior....			   		 	
			   			result.scheduleTime.forEach(function(hours){ // Varre as os horarios disponivels para retorno
			   				if(hours.pacient
			   					&& hours.pacient == "55c7f83a3edd7aa419da4fc9"
			   					&& hours.status  != 2 ){
			   					appmtHours.push(hours);			   					
			   				} 						   				
			   			});
			   			//console.log(scheduleFind);
			   			if(appmtHours.length > 0){

			   				medicos.push({'_idDoc': scheduleResult.doctor});
			   				console.log('@PASSO 1');
			   				/*query = Person.findOne({ _id: scheduleFind.doctor}).select('name lastname');
			   				query.exec(function (err, doctor) {*/
			   					
  								//if (err) return handleError(err);
				   				/*appointments.push({'date' : result.day+'/'+scheduleFind.month+'/'+scheduleFind.year,
				   							  'doctorId' : scheduleFind.doctor,
				   							 'doctorName': doctor.name + ' ' + doctor.lastname,
				   							       '_id' : result._id,				   						  
				   					      'scheduleTime' : appmtHours});*/				   			
			   				//}); //Query Doctor			   				
			   			}
			   		//} // Teste intervalo de dias			   		
			   		//console.log('@WATI 3');
		   		}); //Foreach do dia

				//Retorna horaris disponivel para seleção de consulta			
				//res.json(appointments); 
				//console.log('@WATI 2');
				
		}); //foreach 1

		//console.log(medicos);
		//Busca medicos
		getDoctorByID(medicos);
	}); // Schedule

})

apiRoutes.get('/mene', function(req, res, next) {

	var doctor = new Person();	

	Schedule.find({'year' : 2015, 
                  'month' : 9, 
      //'scheduleDate.day': {$gte:7} , 
              'speciality': { $elemMatch: {_id : objectId('55a84c02eee7dd1819305471') } }
            //'speciality': { $elemMatch: {"description" : "ANGIOLOGIA"}}
                    }, function(err, scheduleFind){
                    	;
         // Varre a agenda do medico para verificar disponibilidade de horario
			scheduleFind.forEach(function(scheduleFind){			   	
				
			   	scheduleFind.scheduleDate.forEach(function(result){
			   		//Verifica intervalo de dias selecionado.			   		
			   					   		
			   		if(result.day >= parShearch.dayIni 
			   				&& result.day <= parShearch.dayEnd){		   		 
			   		 	// Limpa lista de horarios do dia anterior....
			   		 	freeHours = [];
			   		 	// Varre as os horarios disponivels para retorno
			   			result.scheduleTime.forEach(function(hours){			   				
			   				if(!hours.pacient){
			   					//console.log("@PASSO 1:  Hora: " + hours.hour);
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
			
			res.json(schFree); //Retorna horaris disponivel para seleção de consulta         
    });

	/*
	Person.distinct( "doctor", 
                    {'userId': 5499652358 }, function(err, result){
            result.forEach(function(specs){
            	specs.speciality.forEach(function(specialityAux){
            		specialityAux.description = 'Psiquiatria'; //Teste
            		//Atualiza By Id
            		Person.update({'userId': 5499652358},{'doctor.speciality' : specs.speciality}, function(err, isUpdated){
						console.log(isUpdated);
						res.send(isUpdated);
					});
            		//specialityAux.save();
            		//res.json(specialityAux);
            	});
           		//res.json(result); 	
            });
	}); //doctor
	*/
	//res.json(specUpd);

	/*Person.update({'scheduleDate.scheduleTime._id': objectId("55dfb017e1b6cb7c11d1c3a7")},
                		{"scheduleDate.scheduleTime.$"  : true }, update , function(err, isUpdated){
				console.log(isUpdated);
				res.send(isUpdated);
		});*/

});

/*apiRoutes.get('/mene/:perIni:perEnd:id', function(req, res, next) {	
	console.log(req.params.id);
	console.log(req.params.perIni);
	console.log(req.params.perEnd);
	
	res.json({success: false});
});*/


// Pega todos os medicos no DB
apiRoutes.get('/doctors', function(req, res, next) {
	var param = []; 
	
	console.log(req.query);
	if(!req.query.specialityId)
		 param.push({'doctor' : {'$exists': true}});
	else param.push({'doctor' : {'$exists': true},
		  			 'doctor.speciality._id' : req.query.specialityId});

	console.log(param);

	Person.find(param[0], function(err, doctors) {
		res.json(doctors); 
	});

});

apiRoutes.get('/doctorsByIds/:params', function(req, res, next) {
	
	if(req.params.params){

		var param     = req.params.params.split(';'),
			condition = []; 
			//55a84c02eee7dd1819305471
			//ObjectId("55a84c02eee7dd181930549d")		

		if(param[0] != 0 && param[1] != 0){
			condition.push({'doctor' : {'$exists': true},
			 'doctor.address.cityId' : param[1],	
			 'doctor.speciality._id' : objectId(param[0])});			
		}else if(param[0] != 0){			
			condition.push({'doctor' : {'$exists': true},			 
			 'doctor.speciality._id' : objectId(param[0])});
		}else {
			condition.push({'doctor' : {'$exists': true},
			 'doctor.address.cityId' : param[1]});			
		}

		//res.send(condition);


		Person.find(condition[0], function(err, doctors) {
			res.json(doctors); 
		});

	}else{
		res.json({success: false});	
	}
		 

	//console.log(param);
	
	
});


// Add novos medicos no DB
apiRoutes.post('/doctors', function(req, res, next) {
	var doctor = new Person(req.body);
	doctor.save(function(err) {
		if (err){			
			res.json(err);
		} 		
		//console.log(doctor);	
		res.json(doctor);
	});
});

/**
* ===================================================================================================
* ================================ SPECIALITIES ROUTES ==============================================
* ===================================================================================================
*/
// Pega todos as especialidades no DB
apiRoutes.get('/specialities', function(req, res) {
	Speciality.find({}, function(err, specs) {
		res.json(specs);
	});
});

/**
* ===================================================================================================
* ===================================== ADDRESS ROUTES ==============================================
* ===================================================================================================
*http://api.postmon.com.br/v1/cep/95030470
*/
apiRoutes.route('/city')
	.get(function(req, res, next){
		City.find({}, function(err, cities) {
			res.json(cities);
		});
	})
	.post(function(req, res, next) {
		var city = new City(req.body);
					/*new City({city: "Caxias do Sul",           
			         	 city_ibge: 4305108,
			                 state: "RS",
			        	state_ibge: 43
					});*/
		city.save(function(err) {
			if (err){			
				res.json(err);
			} 				
			res.json(city);
		});
	});



app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
