module.exports = function(){
  var env = process.env.NODE_ENV || 'local';
  var isLocal = env === 'local';
  return function(req,res,next){
    if(!~req.url.split('/').pop().indexOf('.')){
      if(!isLocal){
        // Check if the page should exists
      }
      res.sendfile('/www/sites/'+req.abbr+'/public/index.html');
    }
  };
};
