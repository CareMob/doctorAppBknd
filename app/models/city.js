// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('City', new Schema({      
       description: String,           
         city_ibge: Number,
             state: String,
        state_ibge: Number
}));