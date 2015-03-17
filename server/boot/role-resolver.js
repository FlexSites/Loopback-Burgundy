var async = require('async');

module.exports = function(app) {

  var Role = app.models.Role
    , User = app.models.User;

  var parentMap = {
    Section: 'Venue',
    Seat: 'Section',
    Ticket: 'Showtime',
    Showtime: 'Event'
  };

  Role.registerResolver('siteOwner', function(role, context, next) {

    if(context.accessType === 'READ'){
      return next(null,true);
    }
    var userId = context.accessToken.userId;
    if(!userId){
      return next(null, false);
    }
    
    async.parallel({
        user: function(cb) {
          User.findById(userId, cb);
        },
        siteId: function(cb) {
          context.model.findById(context.modelId, function(err,obj){
            getSiteId(context.modelName, obj, cb);
          });
        }
      },
      function(err, results) {
        if(results.user && results.siteId){
          results.user.sites.exists(results.siteId, next);
        }
        else {
          next(err,false);
        }
      });
  });

  function getSiteId(type, obj, cb){
    var parent = parentMap[type];
    if(obj.siteId){
      cb(null, obj.siteId);
    }
    else if(type === 'Site' && obj){
      cb(null, obj.id);
    }
    else if(parent){
      app.models[parent].findById(obj[parent.toLowerCase()+'Id'], function(err, obj){
        getSiteId(parent, obj, cb);
      });
    }
    else {
      cb('Couldn\'t find parent');
    }
  }
};
