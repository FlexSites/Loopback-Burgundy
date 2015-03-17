var loopback = require('loopback');

module.exports = function(){
  var hostMap = {}
    , idMap = {}
    , Site = loopback.findModel('Site');

  return function(req,res,next){
    
    var siteId = req.get('X-FlexSite')
      , origin = req.flex.origin
      , query = {where:{}}
      , fn = setSite.bind(loopback.getCurrentContext(), next);

    if(origin && !siteId) {
      if(hostMap[origin]){
        return fn(null, hostMap[origin]);
      }
      query.where.host = origin;
    }
    else if(siteId){
      if(idMap[siteId]){
        return fn(null, idMap[siteId])
      }
      query.where.id = siteId;
    }
    Site.findOne(query, fn);
  };

  function setSite(next, err, site){
    if (!err && site) {
      this.set('site', hostMap[site.host] = idMap[site.id] = {host: site.host, id:site.id, abbr: site.abbr});
    }
    next(err);
  }
};
