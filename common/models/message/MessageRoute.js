
// Mail Router

var express = require('express');
var router = express.Router({ mergeParams: true });

var async = require('async');

var MailService = require('./MessageService');


router.post('/',function(req,res){
	// TODO: contact messages must come from site ID
	var contact = _.clone(req.body);

	async.waterfall([
		function(callback){
			if(req.params.siteId){
				contact.siteId = req.params.siteId;
			}
			SiteDao.getSite(contact.siteId, callback);
		},
	    function(site, callback){
	    	contact.title = 'New message from '+contact.name;
	    	contact.host = site.host;
	        MailService.contactTemplate(contact,function(err,html){
	        	callback(err,{html: html,site: site});
	        });
	    }
	],
	function(err, results){
		var html = results.html;
		var site = results.site;
		console.log(site, html);
		MailService.send(config.isProduction()?site.contact.email:'sethtippetts@gmail.com','Comedian.io <contact@comedian.io>',contact.title,html,function(err,status){
			res.send({message: err||status.message});
		});
	});
});

module.exports = router;
