module.exports = function(){
  return function(req,res,next){
    if('api.flexhub.io' === req.flex.host){
      req.url = '/api' + req.url;
    }
    next();
  };
};
