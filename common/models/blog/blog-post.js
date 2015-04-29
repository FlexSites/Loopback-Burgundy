var loopback = require('loopback');

module.exports = function (BlogPost) {
  BlogPost.observe('access', function filterProperties(ctx, next) {
    ctx.query.include = 'media';
    next();
  });
};
