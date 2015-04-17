var loopback = require('loopback');

module.exports = function() {

  return function(req,res,next){
    if(req.url !== '/api/template') return next();
    var ctx = loopback.getCurrentContext();
    var site = ctx.get('site');
    if(site){
      var bucket = process.env.S3_BUCKET || 'http://localcdn.flexsites.io';
      return res.send({
        template: bucket + '/' + req.flex.origin + '/public/index.html'
      });
    }
    res.send('pong');
  };
};
