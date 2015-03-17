module.exports = function(){
  var env = process.env.NODE_ENV || 'local'
    , isLocal = env === 'local';
  return function(req,res,next){
    if(!~req.url.split('/').pop().indexOf('.')){
      if(!isLocal){
        // TODO: Check if the page should exists, return 404 otherwise
      }
      return res.sendFile('/www/sites/'+req.abbr+'/public/index.html');
    }
    next();
  };
};
