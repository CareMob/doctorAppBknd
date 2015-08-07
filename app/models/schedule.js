// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('Schedule', new Schema({ 
    doctor: String, //Schema.Types.ObjectId,
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