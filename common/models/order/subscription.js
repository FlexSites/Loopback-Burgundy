var loopback = require('loopback');
var aws = require('aws-sdk');
var crypto = require('crypto');
var PaymentService = require('../../../server/services/PaymentService');

module.exports = function(Subscription){

  Subscription.create = function(nonce, cb) {
    // PaymentService.subscribe(nonce, cb);
    PaymentService.createTransaction(nonce, '10.00', cb);
  };

  Subscription.remoteMethod(
    'create',
    {
      http: {path: '/', verb: 'POST'},
      accepts: [{arg: 'payment_method_nonce', type: 'string', required: true}],
      returns: {arg: 'create', type: 'string'}
    }
  );
};

function random(cb){
  return crypto.randomBytes(16, function(ex, buf) {
    cb(ex, buf.toString('hex'));
  });
}
