var httpProxy = require('http-proxy');
var loopback = require('loopback');

module.exports = function(){

  var bucket = process.env.S3_BUCKET;
  var isLocal = !bucket;
  var proxy = httpProxy.createProxyServer({
    target: bucket
  });

  return function(req,res,next){
    var ctx = loopback.getCurrentContext()
      , abbr = ctx.get('site').abbr;
    if(isLocal){
      abbr += '/public';
    }
    req.url = '/'+ abbr + req.url;
    if(isLocal){
      return next();
    }
    console.log('HITTING AMAZON');
    req.headers.host = bucket;
    proxy.web(req,res,{});
    proxy.on('error', function(e) {
      next(e);
    });
  };
};
