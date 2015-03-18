var loopback = require('loopback');

module.exports = function(){
  var siteMap = { host: {}, id: {} }
    , find = loopback.findModel('Site').findOne;
    
  return function(req,res,next){
    
    var siteId = req.get('X-FlexSite')
      , type = siteId?'id':'host'
      , value = siteId || req.flex.origin || !req.flex.isAPI && req.flex.host
      , fn = setSite.bind(loopback.getCurrentContext(), next);

    if(!value){
      return next();
    }
    var site = siteMap[type][value];
    if(site){
      fn(null, site);
    } else {
      var query = { where: {} };
      query[type] = value;
      find(query, fn);
    }
  };

  function setSite(next, err, site){
    if (!err && site) {
      this.set('site', siteMap.host[site.host] = siteMap.id[site.id] = {host: site.host, id:site.id, abbr: site.abbr});
    }
    next(err);
  }
};
