var url = require('url');

module.exports = function mountRestApi(server) {

  var restApiRoot = server.get('restApiRoot');
  var hostMap = {};

  server.use(function(req, res, next) {

    var host = req.headers.origin// || 'http://wiseguyscomedy.com';

    if(!host) {
      console.warn('Missing origin header.');
      next();
    }
    else if(req.site = hostMap[host]) {
      next();
    }
    else {
      server.models.Site.findOne({
        where: {
          host: /^https?:\/\/(local|test|www)?\.?(.*)$/.exec(host)[2]
        }
      }, function(err, site) {
        if (!err && site) {
          req.site = hostMap[host] = site.id;
        }
        next(err);
      });
    }
  });
  server.use(restApiRoot, server.loopback.rest());
};
