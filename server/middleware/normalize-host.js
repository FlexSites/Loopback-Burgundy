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

    if(req.method === 'OPTIONS'){
      res.set('Access-Control-Allow-Headers', 'X-FlexSite');
    }

    if(process.env.NODE_ENV !== 'prod'){
      req.flex.host = removePrefix(req.flex.host);
      if(origin){
        req.flex.origin = removePrefix(req.flex.origin);
      }
    }
    next();
  };

  function removePrefix(url){
    return /^(?:local|test)\.?(.*)$/.exec(url)[1];
  }
};
