var loopback = require('loopback');
var aws = require('aws-sdk');
var crypto = require('crypto');

module.exports = function(Medium){

  Medium.sign = function(name, type, cb) {
    var ctx = loopback.getCurrentContext();
    if(!process.env.S3_KEY || !process.env.S3_USER_FILES || !process.env.S3_SECRET) return cb('Missing AWS credentials');

    var site = ctx.get('site');
    if(!site || !site.host) return cb('Invalid host');
    random(function(err, hash){
      aws.config.update({accessKeyId: process.env.S3_KEY, secretAccessKey: process.env.S3_SECRET});
      var filename = site.host+'/'+hash+'.'+name.split('.').pop().toLowerCase();
      var s3 = new aws.S3();
      s3.getSignedUrl('putObject', {
        Bucket: process.env.S3_USER_FILES,
        Key: filename,
        Expires: 60,
        ContentType: type,
        ACL: 'public-read'
      }, function(err, data){
        if(err) return cb(err);
        cb(err,data);
      });
    });
  };


  Medium.remoteMethod(
    'sign',
    {
      http: {path: '/sign', verb: 'get'},
      accepts: [{arg: 'name', type: 'string' }, {arg: 'type', type: 'string' }],
      returns: {arg: 'signed_request', type: 'string'}
    }
  );
};

function random(cb){
  return crypto.randomBytes(16, function(ex, buf) {
    cb(ex, buf.toString('hex'));
  });
}
