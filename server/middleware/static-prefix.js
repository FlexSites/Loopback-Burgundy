var loopback = require('loopback')
  , Promise = Promise || require('bluebird');

module.exports = function(){
  var abbrMap = {}
    , Site = loopback.findModel('Site');

  return function(req,res,next){
    getAbbr(req.headers.host)
      .then(function(abbr){
        req.abbr = abbr;
        next();
      }, function(err){
        next(err);
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