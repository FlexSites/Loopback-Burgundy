var loopback = require('loopback');

module.exports = function(){
  var hostMap = {}
    , Site = loopback.findModel('Site');

  return function(req,res,next){
    var ctx = loopback.getCurrentContext();
    var host = req.get('X-FlexSite') || req.get('Origin') || req.get('Host')
      , hostMatch = /^(?:https?:\/\/)?(local|test|www)?\.?(.*)$/.exec(host);

    if(!hostMatch || !hostMatch.length) {
      console.warn('Missing or invalid origin header.', host);
      next();
    }
    else if(hostMap[host]) {
      ctx.set('site', hostMap[host]);
      next();
    }
    else {
      Site.findOne({
        where: {
          host: hostMatch[2]
        }
      }, function(err, site) {
        if (!err && site) {
          ctx.set('site', hostMap[host] = {id:site.id, abbr: site.abbr});
        }
        next(err);
      });
    }
  };
};
