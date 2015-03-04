var loopback = require('loopback');

module.exports = function(SiteModel){

  SiteModel.observe('access', function logQuery(ctx, next) {
    // If there's a siteId in the request, only show related models
    var site = loopback.getCurrentContext().active.http.req.site;
    if(site){
      if(!ctx.query.where){
        ctx.query.where = {};
      }
      ctx.query.where.siteId = site;
    }
    next();
  });
}
