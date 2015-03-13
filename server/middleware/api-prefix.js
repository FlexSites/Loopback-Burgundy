module.exports = function(){
  return function(req,res,next){
    var host = req.headers.host;
    if(/api.flexhub.io$/.test(host) || host === '127.0.0.1'){
      req.url = '/api' + req.url;
    }
    next();
  };
};
