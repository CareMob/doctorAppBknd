// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('Doctor', new Schema({ 	
    name: String,     
    specialityID: String, 
    healthCareID: String,
    contact: String,
    address: String,
    ranking: Number,
    active: Boolean
}));