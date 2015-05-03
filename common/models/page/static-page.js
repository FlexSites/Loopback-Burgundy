var loopback = require('loopback');

module.exports = function (Page) {
  Page.afterRemote('**', function(ctx, instance, next){
    if(instance.media && instance.media.length){
      instance.header = instance.media[0].src;
    }
    next();
  });

  Page.observe('access', function filterProperties(ctx, next) {
    ctx.query.include = 'media';
    next();
  });
};
