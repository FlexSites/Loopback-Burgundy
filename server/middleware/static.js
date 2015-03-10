var httpProxy = require('http-proxy');
var loopback = require('loopback');
var Promise = Promise || require('bluebird');

module.exports = function(){
  var proxy = httpProxy.createProxyServer({
    target: 'http://flex-sites.s3-website-us-west-2.amazonaws.com'
  })
    , abbrMap = {}
    , Site = loopback.findModel('Site');

  return function(req,res,next){
    var host = req.headers.host;

    getAbbr(host)
      .then(function(abbr){
        req.url = '/'+ abbr + req.url;
        req.headers.host = 'flex-sites.s3-website-us-west-2.amazonaws.com';
        proxy.web(req,res,{});
      }, function(err){
        console.log('Error getting abbreviation for static site: %s', host, err);
      });
  };

  function getAbbr(host){
    if(abbrMap[host]){
      return abbrMap[host];
    }
    return abbrMap[host] = new Promise(function(resolve, reject){
      Site.findOne({
        where: {
          host: /^(local|test|www)?\.?(.*)$/.exec(host)[2]
        }
      }, function(err, site) {
        if(err || !site){
          return reject(err);
        }
        resolve(site.abbr);
      });
    });
  }
};