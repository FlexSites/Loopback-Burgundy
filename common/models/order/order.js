var loopback = require('loopback');
var aws = require('aws-sdk');
var crypto = require('crypto');
var PaymentService = require('../../../server/services/PaymentService');
var selectn = require('selectn');

module.exports = function(Order){

  Order.observe('before save', function filterProperties(ctx, next) {
    console.log(ctx.instance.payment_method_nonce);

    if(!ctx.instance.amount) return next('No amount specified');

    PaymentService.createTransaction(ctx.instance.payment_method_nonce, ctx.instance.amount, next);
  });

  Order.token = function(name, type, userId, cb) {
    PaymentService.generateToken({
      customerId: userId
    }, cb);
  };

  Order.remoteMethod(
    'token',
    {
      http: {path: '/token', verb: 'get'},
      accepts: [
        {arg: 'name', type: 'string' },
        {arg: 'type', type: 'string' },
        {arg: 'userId', type: 'string', required: true, http: function(ctx){
          var userId = selectn('req.accessToken.userId', ctx);
          if(userId) return userId;
        }}
      ],
      returns: {arg: 'token', type: 'string'}
    }
  );
};

function random(cb){
  return crypto.randomBytes(16, function(ex, buf) {
    cb(ex, buf.toString('hex'));
  });
}
