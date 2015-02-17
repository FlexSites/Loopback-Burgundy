module.exports = function(server){
	

	// Extend User Object
	  var User = server.models.User;
	  var Site = server.models.Site;
	  
	 Site.hasAndBelongsToMany(User);
	 User.hasAndBelongsToMany(Site);
}