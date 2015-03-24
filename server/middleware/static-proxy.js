var httpProxy = require('http-proxy')
  , loopback = require('loopback')
  , glob = require('glob');

module.exports = function(){

  var bucket = process.env.S3_BUCKET
    , proxy = httpProxy.createProxyServer({
    target: bucket
  });

  return function(req,res,next){
    var ctx = loopback.getCurrentContext()
      , site = ctx.get('site');

    if(!site){
      return next(new Error('Unrecognized static site.'));
    }
    var abbr = site.abbr;
    if(!bucket){
      if(req.originalUrl === '/'){
        req.url = '/'+glob.sync('/www/sites/' + abbr + '/public/index-*.html')[0].split('/').pop();
      }
      req.url = '/' + abbr + '/public' + req.url;

      return next();
    }
    req.url = '/'+ abbr + req.url;
    req.headers.host = bucket;
    proxy.web(req,res,{});
    proxy.on('error', next);
  };
};
