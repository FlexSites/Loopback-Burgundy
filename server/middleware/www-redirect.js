/**
 * Redirect all requests with a host beginning with www => non-www version
 */
module.exports = function(){
  return function(req,res,next){
    var host = req.get('Host');
    if (host.substr(0,3) === 'www') {
      return res.redirect(301, req.protocol + '://' + host.substr(4) + req.url);
    }
    next();    
  };
};
