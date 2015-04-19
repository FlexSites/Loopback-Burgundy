module.exports = function(Page){

  function removePrefix(url){
    if(/(local|test)/.test(url)){
      url = /^(?:https?:\/\/)?(?:local|test)\.?(.*)$/.exec(url)[1];
    }
    return url;
  }

  Page.afterRemote('find', function (ctx, user, next) {
    if(ctx.req.flex.isAdmin) return next();

    var set = setPrefix.bind(this, process.env.S3_BUCKET, removePrefix(ctx.req.get('origin')));

    if(!Array.isArray(ctx.result)){
      set(ctx.result);
      return next();
    }
    ctx.result = ctx.result.map(function(result, i){
      return set(ctx.result[i]);
    });
    next();
  });
};

function setPrefix(bucket, host, page){
  var template = page._templateUrl || page.templateUrl;
  if(template){
    page.templateUrl = (bucket||'http://localcdn.flexsites.io') + '/' + host + '/public' + template;
  }
  return page;
}
