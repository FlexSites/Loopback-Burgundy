/**
 * Remove 'local' and 'test' prefixes and protocol from origin for easier logic later.
 */

module.exports = function(){
  return function(req,res,next){

    if(req.method === 'OPTIONS'){
      res.set('Access-Control-Allow-Headers', 'X-FlexSite');
    }

    var origin = req.get('Origin');
    if(origin){
      origin = /^(?:https?:\/\/)(.*)$/.exec(origin)[1];
    }
    if(process.env.NODE_ENV !== 'prod' && origin){
      origin = /^(?:local|test)\.?(.*)$/.exec(origin)[1];
    }
    req.flex = {
      origin: origin
    };
    next();
  };
};
