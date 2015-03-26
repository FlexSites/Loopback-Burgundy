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
      , site = ctx.get('site')
      , err;

    if(!site || !site.abbr){
      return next(new Error('Unrecognized static site.'));
    }
    var abbr = site.abbr;
    if(!bucket){
      if(req.originalUrl === '/'){
        var idx = glob.sync('/www/sites/' + abbr + '/public/index-*.html');
        if(idx && idx[0]){
          req.url = '/'+idx[0].split('/').pop();
        }
      } else if(!~req.originalUrl.indexOf('.')){
        return res.redirect('http://' + req.get('host') + '/#' + req.originalUrl, 301);
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
