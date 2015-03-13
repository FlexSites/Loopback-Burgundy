module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();

  var User = server.models.User;
  var Site = server.models.Site;
   
  Site.hasAndBelongsToMany(User);
  User.hasAndBelongsToMany(Site);

};