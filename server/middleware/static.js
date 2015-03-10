var httpProxy = require('http-proxy');

module.exports = function(){
  var proxy = httpProxy.createProxyServer({
    target: 'http://flex-sites.s3-website-us-west-2.amazonaws.com'
  });

  return function(req,res,next){
    req.headers.host = 'flex-sites.s3-website-us-west-2.amazonaws.com';
    console.log('request headers', req.headers);
    proxy.web(req,res,{});
  };
};