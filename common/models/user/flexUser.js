var crypto = require('crypto')
  , selectn = require('selectn');

module.exports = function(FlexUser){
  FlexUser.afterRemote('*', function (ctx, user, next) {
    var email = selectn('result.email')(ctx) || selectn('result.user.email')(ctx) || user.email;
    console.log('method name', ctx.method.name, 'result', selectn('result.user')(ctx), 'user', JSON.stringify(user.user));
    if(!email) return next();
    if(!Array.isArray(ctx.result)){
      var image = getImage(user.email);
      if(/^log/.test(ctx.method.name)){
        ctx.result.user.image = image;
      } else {
        ctx.result.image = image;
      }
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
  var image = 'http://www.gravatar.com/avatar/';
  if(email){
     image += crypto.createHash('md5').update(email).digest('hex');
  }
  return image;
}
