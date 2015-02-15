
// Venue Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
	venue: {type: ObjectId, ref: 'Venue'},
    name: {type: String, required: true},
    color: {type: String}
});

module.exports = schema;