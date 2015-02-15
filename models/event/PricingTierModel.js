
// EventModel

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var path = require('path');

var DbUtil = require('../../utilities/DatabaseUtility.js');
var dateFormat = require('dateformat');

module.exports = {
	date: {type: String},
    sections: [{
    	section: {type: ObjectId, ref: 'Section', required: true},
    	price: {type: Number, required: true}
    }],
    population: 'section',
    virtuals: {}
}