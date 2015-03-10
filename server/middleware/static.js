var httpProxy = require('http-proxy');

module.exports = function(){

  var env = process.env.NODE_ENV || 'local';
  var isLocal = env === 'local';
  var proxy = httpProxy.createProxyServer({
    target: 'http://flex-sites.s3-website-us-west-2.amazonaws.com'
  });

  return function(req,res,next){
    var abbr = req.abbr;
    if(isLocal){
      abbr += '/public';
    }
    req.url = '/'+ abbr + req.url;
    if(isLocal){
      return next();
    }
    req.headers.host = 'flex-sites.s3-website-us-west-2.amazonaws.com';
    proxy.web(req,res,{});
    proxy.on('error', function(e) {
      next(e);
    });
  };
};
