var crypto = require('crypto');

module.exports = function(FlexUser){
  FlexUser.afterRemote('*', function (ctx, user, next) {
    if(ctx.req.flex.isAdmin) return next();

    if(!Array.isArray(ctx.result)){
      ctx.result.image = getImage(ctx.result.email);
      return next();
    }
    ctx.result = ctx.result.map(function(result, i){
      ctx.result[i].image = getImage(ctx.result[i].email);
      return ctx.result[i];
    });
    next();
  });
};

function getImage(email){
  return 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email).digest('hex');
}
