// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('User', new Schema({ 
	appuserID: String,
    name: String,     
    password: String, 
    admin: Boolean,
    active: Boolean
}));