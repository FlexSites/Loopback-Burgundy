
// Seat Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
    section: {type: ObjectId, ref: 'Section'},
    row: {type: String},
    number: {type: Number}
});

module.exports = schema;