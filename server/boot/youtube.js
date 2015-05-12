module.exports = function(server) {
  var remotes = server.remotes();
  // modify all returned values
  remotes.after('**', function (ctx, next) {
    if(/medi(a|um)/i.test(ctx.methodString)){
      if(Array.isArray(ctx.result)){
        ctx.result = addVirtuals(ctx.result);
      }
    }
    next();
  });
};

function addVirtuals(media){
  return media.map(function(medium){
    if(medium.type !== 'video') return medium;

    // Youtube matching
    var match = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i.exec(medium.src);
    if(match && match[1]){
      medium.thumbnail = 'http://img.youtube.com/vi/' + match[1] + '/0.jpg';
      medium.embed = 'https://www.youtube.com/embed/' + match[1];
    }
    return medium;
  });
}
