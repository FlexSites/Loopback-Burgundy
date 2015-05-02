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
      origin = /^(?:https?:\/\/)?(?:www|local|test)?\.?(.*)$/.exec(origin)[1];
    }
    req.flex = {
      origin: origin
    };
    next();
  };
};
