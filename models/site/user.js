module.exports = function(server){
	
	console.log('ran user config');

	// Extend User Object
	  var User = server.models.User;
	  var Site = server.models.Site;
	  
	 Site.hasAndBelongsToMany(User);
	 User.hasAndBelongsToMany(Site);
}