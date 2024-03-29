var loopback = require('loopback');

module.exports = function(Subscriber){

  Subscriber.observe('access', function (ctx, next) {
    // If there's a siteId in the request, only show related models
    var context = loopback.getCurrentContext()
      , site = context.get('site');
    if(site){
      var addId = true;
      if(!ctx.query.where){
        ctx.query.where = {};
      }
      if(ctx.query.where.and){
        ctx.query.where.and.forEach(function(q){
          if(q.siteId){
            return (addId = false);
          }
        });
      }
      if(addId) ctx.query.where.siteId = site.id;
    }
    next();
  });
  Subscriber.observe('before save', function injectSite(context, next) {
    if (context.instance && !context.instance.id) {
      var site = loopback.getCurrentContext().get('site');
      if(!context.instance.siteId){
        if(!site) return next(new Error('Saving object to undefined site'));
        context.instance.siteId = site.id;
      }
    }
    next();
  });
};
