
// Event Model
var path = require('path');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var dateFormat = require('dateformat');

var schema = new Schema({
    site: {type: ObjectId, ref: 'Site', required: true},
    enabled: {type: Date, default: Date.now},
    dayofshow: {type: Number, default: 0},
    _name: {type: String},
    entertainer: {type: ObjectId, ref: 'Entertainer'},
    showtimes: [require('./ShowtimeModel')],
    _type: {type: String, default: 'general'},
    venue: {type: ObjectId, required: true, ref: 'Venue'},
    pricingTiers: [{
        date: {type: String},
        sections: [{
            section: {type: ObjectId, ref: 'Section', required: true},
            price: {type: Number, required: true}
        }]
    }],
    _description: {type: String},
    _facebook: {type: String},
    link: {type: String},
    _video: {type: String}
});
    
    schema.virtual('name').get(function(){
        return this._name||this.entertainer&&this.entertainer.name;
    });

    schema.virtual('slug').get(function(){
        return StringUtil.slugify(this._name||this.entertainer&&this.entertainer.name);
    });

    schema.virtual('snippet').get(function(){
        return StringUtil.truncate(this.entertainer ? this.entertainer.credits || this.entertainer.description : this._description,100);
    });

    schema.virtual('type').get(function(){
        var typeMap = {
            'general': 'General Admission',
            'special': 'Special Event'
        };
        return typeMap[this._type];
    });

    schema.virtual('credits').get(function(){
        return this.entertainer&&this.entertainer.credits;
    });

    schema.virtual('description').get(function(){
        return this._description||this.entertainer&&this.entertainer.description;
    });

    schema.virtual('hero').get(function(){
        var heroes = this._hero||this.entertainer&&this.entertainer.hero||[{}];
        return heroes[0];
    });

    schema.virtual('start').get(function(){
        var srtd = _.sortBy(this.showtimes,'datetime');
        if(srtd.length){
            return dateFormat(srtd[0].datetime, 'm/d');
        }
    });

    schema.virtual('end').get(function(){
        var srtd = _.sortBy(this.showtimes,'datetime');
        if(srtd.length){
            return dateFormat(srtd[srtd.length-1].datetime, 'm/d');
        }
    });

    schema.virtual('endDate').get(function(){
        var srtd = _.sortBy(this.showtimes,'datetime');
        if(srtd.length){
            return srtd[srtd.length-1].datetime;
        }
    });

    schema.virtual('range').get(function(){
        var list = _.sortBy(this.showtimes,'datetime');
        if(list.length){
            return DateUtil.formatDateRange(list[0].datetime,list[list.length-1].datetime);
        }
    });

    schema.virtual('image').get(function(){
        var dir = this.entertainer&&this.entertainer.name?'/media/entertainer':'/media/event/';
        return {
            thumb: path.join(dir,StringUtil.slugify(this._name||this.entertainer&&this.entertainer.name),'thumb.jpg'),
            profile: path.join(dir,StringUtil.slugify(this._name||this.entertainer&&this.entertainer.name),'profile.jpg')
        }
    });

    module.exports = schema;
