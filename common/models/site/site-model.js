var loopback = require('loopback');

module.exports = function(SiteModel){

  SiteModel.observe('access', function (ctx, next) {
    // If there's a siteId in the request, only show related models
    var context = loopback.getCurrentContext()
      , site = context.get('site');
    if(site){
      if(!ctx.query.where){
        ctx.query.where = {};
      }
      ctx.query.where.siteId = site.id;
    }
    next();
  });
};
