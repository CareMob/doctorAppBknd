// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
/*module.exports = mongoose.model('Doctor', new Schema({ 	
    name: String,     
    specialityID: String, 
    healthCareID: String,
    contact: String,
    address: String,
    ranking: Number,
    active: Boolean
}));*/
// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('Test', new Schema({ 
     name: String,
 lastname: String,  
   cardId: Number, //CPF/CNPJ
   userId: Number, //Celular usuario/ID Medico  
verfifyID: String, // Cod verificação do Numero de celular.  
   doctor: { crmId: String,
            ranking: Number,
             adress: String,
          cityState: String,    
             cityId: String,             
            contact: Number,
         speciality: {},
         healthCare: {}
         //speciality: {type: "ObjectId", ref: "speciality"},
         //healthCare: {type: "ObjectId", ref: "healthCare" }
         }
	}));