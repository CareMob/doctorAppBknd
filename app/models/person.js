// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('Person', new Schema({ 
     name: String,
 lastname: String,  
   cardId: Number, //CPF/CNPJ
   userId: Number, //Celular usuario/ID Medico  
verfifyID: String, // Cod verificação do Numero de celular.  
healthCareId: Number,
birthday: Date,
   doctor: { crmId: String,
            ranking: Number,
            address: String,
          cityState: String,    
             cityId: String,             
            contact: Number,
         speciality: {},
         healthCare: {}
         //speciality: {type: "ObjectId", ref: "speciality"},
         //healthCare: {type: "ObjectId", ref: "healthCare" }
         }
	}));