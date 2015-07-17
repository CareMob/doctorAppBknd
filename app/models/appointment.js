// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('Appointment', new Schema({ 
	personID: String,
    doctorID: String,     
    isHealthCare: Boolean,
    healthcareID: String,
    dateHit: Date,    
    realized: Boolean,
    raking: Number,
}));