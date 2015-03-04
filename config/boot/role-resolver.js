var async = require('async');

module.exports = function(app) {

  var Role = app.models.Role
    , User = app.models.User;

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
        obj: function(cb) {
          context.model.findById(context.modelId, cb);
        }
      },
      function(err, results) {
        if(results.user || results.obj){
          results.user.sites.exists(results.obj.siteId, next);
        }
        else {
          next(err,false);
        }
      });
  });
}
