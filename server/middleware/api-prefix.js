module.exports = function(){
  return function(req,res,next){
    if(req.flex.isAPI){
      req.url = '/api' + req.url;
    }
    next();
  };
};
