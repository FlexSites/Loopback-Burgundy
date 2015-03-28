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

    if(!site || !site.abbr){
      return next(new Error('Unrecognized static site.'));
    }

    if(req.originalUrl === '/'){
      req.url = '/index.html';
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', 0);
    }
    else if(!~req.originalUrl.indexOf('.')){
      return res.redirect(301, 'http://' + req.get('host') + '/#' + req.originalUrl);
    }

    req.url = '/' + site.abbr + '/public' + req.url;
    if(!bucket){
      return next();
    }
    proxy.web(req,res,{});
    proxy.on('error', next);
  };
};
