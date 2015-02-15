
// Ticket Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
    status: {type: String},
    event: {type: ObjectId, ref: 'Event'},
    showtime: {type: ObjectId, ref: 'Showtime'},
    seat: {type: ObjectId, ref: 'Seat'}
});

module.exports = schema;