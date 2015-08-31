// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
var scheduleTime = new Schema({hour : String,
                    	     pacient: Schema.Types.ObjectId,
                              status: Number,
                             ranking: Number
        					 });

var scheduleDate = new Schema({day : Number,
 						 scheduleTime  : [scheduleTime]
 						});
module.exports = mongoose.model('Schedule', new Schema({ 
    doctor: String, //Schema.Types.ObjectId,
    month: Number,
    year: Number,
    scheduleDate:[{
        day : Number,
        scheduleTime : [scheduleDate]
   }]
}));
*/

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('Schedule', new Schema({ 
    doctor: String, //Schema.Types.ObjectId,
speciality: [{}],
     month: Number,
      year: Number,
    scheduleDate:[{
        day : Number,
        scheduleTime : [{hour : String,
                    pacient: Schema.Types.ObjectId,
                     status: Number,
                    ranking: Number
        }]
   }]
}));