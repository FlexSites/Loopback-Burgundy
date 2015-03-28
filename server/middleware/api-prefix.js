module.exports = function(){
  return function(req,res,next){
    if(req.flex.isAPI){
      req.url = '/api' + req.url;
      res.set('Access-Control-Allow-Headers', 'X-FlexSite');
    }
    next();
  };
};
