var crypto = require('crypto')
  , selectn = require('selectn')
  , gateway = require('braintree');

module.exports = function(FlexUser){

  FlexUser.beforeRemote('*', function(ctx, user, next){
    console.log('user remote', ctx.methodString);
    // gateway.customer.create({
    //   firstName: "Jen",
    //   lastName: "Smith",
    //   company: "Braintree",
    //   email: "jen@example.com",
    //   phone: "312.555.1234",
    //   fax: "614.555.5678",
    //   website: "www.example.com"
    // }, function (err, result) {
    //   result.success;
    //   // true

    //   result.customer.id;
    //   // e.g. 494019
    // });
    next();
  })

  FlexUser.afterRemote('*', function (ctx, user, next) {
    var email = selectn('result.email')(ctx) || selectn('result.user.email')(ctx) || selectn('email', user);
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
