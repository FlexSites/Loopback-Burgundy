var braintree = require('braintree');

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'vxhgmrf9q54jcf8b',
    publicKey:    'fdhf932xzbww7wnb',
    privateKey:   '08e99b95f6221e4a68b4fa778b8c87c7'
});

// gateway.customer.find('5518b349a75a2abb810ebfc3', function(err, customer){
//   console.log('CUSTOMER', err, customer);
// })

module.exports = {
  generateToken: function(customerID, cb){
    gateway.clientToken.generate({}, function (err, response) {
      cb(err, response.clientToken);
    });
  },
  createTransaction: function(nonce, amount, cb){
    gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
    }, cb);
  },
  subscribe: function(nonce, cb){
    gateway.subscription.create({
      paymentMethodToken: nonce,
      planId: "4d22",
      neverExpires: true,
    }, cb);
  }
}
