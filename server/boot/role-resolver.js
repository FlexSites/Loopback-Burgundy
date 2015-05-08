var async = require('async')
  , loopback = require('loopback');

module.exports = function(app) {

  var Role = app.models.Role
    , User = app.models.FlexUser;

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
          if(context.method === 'create'){
            var ctx = loopback.getCurrentContext();

            // TODO: If its top level handle this way, still need a reliable solution for nested belongsTo
            // if(!parentMap[modelName] && siteId){
            //   return cb(null, siteId);
            // }

            return cb(null,(ctx.get('site')||{}).id);
          }
          context.model.findById(context.modelId, function(err,obj){
            if(err || !obj){
              return cb(context.modelName + ' not found with id ' + context.modelId);
            }
            getSiteId(context.modelName, obj, cb);
          });
        }
      },
      function(err, results) {
        if(err || !results.user || !results.siteId) return next(err,false);
        results.user.sites.exists(results.siteId, next);
      });
  });

  function getSiteId(type, obj, cb){
    var parent = parentMap[type];
    if(obj && obj.siteId){
      cb(null, obj.siteId);
    }
    else if(obj && type === 'Site'){
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
