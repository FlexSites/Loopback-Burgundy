module.exports = function(SiteModel){
  SiteModel.beforeRemote('**', function(ctx, user, next) {
      console.log(ctx.methodString, 'was invoked remotely'); // users.prototype.save was invoked remotely
      next();
    });
  SiteModel.beforeRemote('*', function(ctx, user, next) {
    console.log(ctx.methodString, 'was invoked remotely'); // users.prototype.save was invoked remotely
    next();
  });
  SiteModel.observe('access', function logQuery(ctx, next) {
    console.log(ctx.req);
    console.log('Accessing %s matching %s', ctx.Model.modelName, ctx.query.where);
    next();
  });
}