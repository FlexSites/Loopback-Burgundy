var loopback = require('loopback');

module.exports = function (Entertainer) {
  Entertainer.observe('access', function filterProperties(ctx, next) {
    ctx.query.include = 'media';
    next();
  });
};
