
// Showtime Model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var dateFormat = require('dateformat');

var schema = new Schema({
    event: {type: ObjectId, ref: 'Event', required: true},
	datetime: {type: Date, required: true},
	tickets: [{type: ObjectId, ref: 'Ticket'}]
});

schema.virtual('date').get(function(){
    return dateFormat(this.datetime, 'ddd mmm dS');
});

schema.virtual('date').get(function(){
    return dateFormat(this.datetime, 'ddd mmm dS');
});

schema.virtual('time').get(function(){
    return dateFormat(this.datetime, 'h:MM');
});

module.exports = schema;
