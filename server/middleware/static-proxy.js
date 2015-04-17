var httpProxy = require('http-proxy')
  , loopback = require('loopback');

module.exports = function(){

  var bucket = process.env.S3_BUCKET
    , proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    target: bucket
  });

  return function(req,res,next){
    var ctx = loopback.getCurrentContext()
      , site = ctx.get('site');

    if(!site){
      return next(new Error('Unrecognized static site.'));
    }
    req.url = '/' + site.host + '/public' + req.url;

    if(!bucket){
      return next();
    }
    proxy.web(req,res,{});
    proxy.on('error', next);
  };
};
