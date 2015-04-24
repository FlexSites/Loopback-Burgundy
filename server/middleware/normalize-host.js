/**
 * Remove 'local' and 'test' prefixes and protocol from origin for easier logic later.
 */

module.exports = function(){
  return function(req,res,next){
    var origin = req.get('Origin');
    req.flex = {};

    if(origin){
      req.flex = {
        origin:  /^(?:https?:\/\/)(.*)$/.exec(origin)[1]
      };
    }

    if(req.method === 'OPTIONS'){
      res.set('Access-Control-Allow-Headers', 'X-FlexSite');
    }

    if(process.env.NODE_ENV !== 'prod'){
      if(origin){
        req.flex.origin = /^(?:local|test)\.?(.*)$/.exec(origin)[1];
      }
    }
    next();
  };
};
