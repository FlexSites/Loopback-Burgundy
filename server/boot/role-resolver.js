var async = require('async');

module.exports = function(app) {

  var Role = app.models.Role
  , User = app.models.User
  , Venue = app.models.Venue
  , Section = app.models.Section
  , Event = app.models.Event
  , Showtime = app.models.Showtime;

  Role.registerResolver('siteOwner', function(role, context, next) {
    console.log('inside role-resolver')
    console.log('Current model: ' + context.modelName)
    if(context.accessType === 'READ')
    {
      console.log('read returning true')
      return next(null,true);
    }
    if(!context.modelId)
    {
      console.log('No modelId, i.e. this is a new object')
      console.log(JSON.stringify(context.venueId,null,2))
      return next(null,true);
    }
    var userId = context.accessToken.userId;
    if(!userId){
     console.log('no userid')
     return next(null, false);
   }
   async.parallel({
    user: function(cb) {
      console.log('user: '+userId)
      User.findById(userId, cb);
    },
    obj: function(cb) {
      console.log('modelId '+context.modelId)
      context.model.findById(context.modelId, cb);
    }
  },
  function(err, results) {
    hasSite(context, results, next);
  });
 });

  function hasSite(context, results, next){
    if(results.user && results.obj){
      console.log('has user and object')
      console.log('Model name: ' + results.obj.modelName)
      if(results.obj.siteId){
        console.log('object has a siteId')
        results.user.sites.exists(results.obj.siteId, next);
      }
      else {
        console.log('object has no siteId')
        nestedModelHasSite(results.user, results.obj, next);
      }
    }
    else
    {
      console.log('user or object udefined')
      {
        next(err,false);
      }
    }
  }
  function nestedModelHasSite(user, obj, next)
  {
    console.log('obj: ' + JSON.stringify(obj,null,2))
    console.log('check nestedModelHasSite')
    if(obj.siteId)
    {//if the current obj has a site id
      console.log('has siteid')
      user.sites.exists(obj.siteId,next);
    }
    if(obj.venueId)
    {
      console.log('obj has venue')
      async.parallel({
        venue: function(cb){
          Venue.findById(obj.venueId,cb)
        }
      },
      function(err, results){
        if(results.venue.siteId){
          console.log('got a venue with a siteId')
          user.sites.exists(results.venue.siteId, next);
        }
      })
    }
    if(obj.eventId)
    {
      console.log('obj has event')
      async.parallel({
        evnt: function(cb){
          Event.findById(obj.eventId,cb)
        }
      },
      function(err, results){
        if(results.evnt.siteId){
          console.log('got a event with a siteId')
          user.sites.exists(results.evnt.siteId, next);
        }
      })
    }
    if(obj.sectionId)
    {
      console.log('obj has section')
      async.parallel({
        section: function(cb){
            Section.findById(obj.sectionId,cb)
        }
      },
      function(err, results){
        nestedModelHasSite(user,results.section,next)
      })
    }
    if(obj.showtime)
    {
      console.log('obj has showtime')
      async.parallel({
        showtime: function(cb){
          Section.findById(obj.sectionId,cb)
        }
      },
      function(err, results){
        nestedModelHasSite(user,results.showtime,next)
      })
    }
  }
}
