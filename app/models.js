var mongoose = require('mongoose');
var schemas  = require('./models');

var models = {};

Object.keys(schemas).foreach(name){
	models[name] = mongoose.model(name, schemas[name]);
});

module.export = models;