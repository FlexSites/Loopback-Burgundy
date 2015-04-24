var loopback = require('loopback');

module.exports = function(){
  var siteMap = { host: {}, id: {} }
    , Site = loopback.findModel('Site')
    , find = Site.findOne.bind(Site);

  return function(req,res,next){

    var siteId = req.get('X-FlexSite')
      , type = siteId?'id':'host'
      , value = siteId || req.flex.origin
      , fn = setSite.bind(loopback.getCurrentContext(), next);
    if(!value){
      return next();
    }
    var site = siteMap[type][value];
    if(site){
      fn(null, site);
    } else {
      var query = { where: {} };
      query.where[type] = value;
      find(query, fn);
    }
  };

  function setSite(next, err, site){
    if (!err && site) {
      this.set('site', siteMap.host[site.host] = siteMap.id[site.id] = {host: site.host, id:site.id, email: site.contact && site.contact.email});
    }
    next(err);
  }
};
