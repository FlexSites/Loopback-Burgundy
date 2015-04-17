/**
 * Remove 'local' and 'test' prefixes and protocol from origin for easier logic later.
 */

module.exports = function(){
  return function(req,res,next){
    var origin = req.get('Origin');
    req.flex = {
      host: req.hostname
    };

    if(origin){
      req.flex.origin = /^(?:https?:\/\/)(.*)$/.exec(origin)[1];
    }

    if(process.env.NODE_ENV !== 'prod'){
      if(req.flex.host === '127.0.0.1'){
        req.flex.host = 'api.flexhub.io';
        req.flex.isAPI = true;
      }
      req.flex.host = removePrefix(req.flex.host);
      if(origin){
        req.flex.origin = removePrefix(req.flex.origin);
      }
    }
    req.flex.isAPI = req.flex.host === 'api.flexhub.io';
    req.flex.isCDN = req.flex.host === 'cdn.flexsites.io';
    req.flex.isAdmin = req.flex.host === 'admin.flexsites.io';
    next();
  };

  function removePrefix(url){
    if(/^(local|test)/.test(url)){
      url = /^(?:local|test)\.?(.*)$/.exec(url)[1];
    }
    return url;
  }
};
