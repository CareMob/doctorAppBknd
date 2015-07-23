// Pega as instancias de mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Seta um modelo ('tabela') atribuindo ao module.exports
module.exports = mongoose.model('Appointment', new Schema({ 	   
	   doctorID: Schema.Types.ObjectId,
	appointments: [{dateTo: Date,
				  isEnable: Boolean,
				   hoursTo: [{hours: Number,
				   	          person: Schema.Types.ObjectId,
			                    name: String,
			              speciality: Schema.Types.ObjectId,
			                realized: Boolean,
			                  raking: Number,
			            isHealthCare: Boolean}]
                  }]
}));
/*
 doctorID: {type: "ObjectID", ref: "doctors" },	
	 appointments: [{ dateHint: Date,
                      isOpen: Boolean,                   
                    hoursHint:[{
                    		beneficiary: {type: "ObjectID", ref : "people"},
                    		namePerson: "Marcelo Menegat",
                    		//speciality: {type: "ObjectID", ref : "specialities"},
                    		realized: Boolean,
                    		raking: Number,
                    		isHealthCare: Boolean}
                      }]
						    }]};

*/
/*
module.exports = mongoose.model('Appointment', new Schema({ 	   
	   doctorID: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
	appointment: [{data: Date,
                 person: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
                   name: String,
             speciality: [{ type: Schema.Types.ObjectId, ref: 'Speciality' }],
               realized: Boolean,
                 raking: Number,
           isHealthCare: Boolean}]
}));
*/
/*
db.schedule.find({consula.benefID: "123456" })

db.schedule.find({medicoID.: "31921"})

*/