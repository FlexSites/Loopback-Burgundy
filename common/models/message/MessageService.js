
// MAIL SERVICE

var Mailgun = require('mailgun-js');
var hogan = require('hogan.js');
var path = require('path');
var fs = require('fs');


module.exports = {
	contactTemplate: function(contact,fn){
		fs.readFile(path.join(__root,'../sites/global/public/html/email.html'),'utf8', function (err,data) {
			fn(err,hogan.compile(data).render(contact));
		});
	},
	send: function(to,from,subject,body,fn){

		var mailgun = new Mailgun({apiKey: 'key-9mv54r-lqncqjm-00-wgd2hdudtwwv-6', domain: 'comedian.io'});

		var data = {
		  from: from,
		  to: to,
		  subject: subject,
		  html: body
		};

		mailgun.messages().send(data, function (error, body) {
		  console.log('Mailgun',body);
		  fn(error,{message: 'Successfully sent message'});
		});

		// // create reusable transporter object using SMTP transport
		// var transporter = nodemailer.createTransport(transport);

		// // NB! No need to recreate the transporter object. You can use
		// // the same transporter object for all e-mails

		// // setup e-mail data with unicode symbols
		// var mailOptions = {
		//     from: from, // sender address
		//     to: to, // list of receivers
		//     subject: subject, // Subject line
		//     text: 'Hello world ✔', // plaintext body
		//     html: body // html body
		// };

		// // send mail with defined transport object
		// transporter.sendMail(mailOptions, function(error, info){
		//     if(error){
		//         console.log(error);
		//     }else{
		//         console.log('Message sent: ' + info.response);
		//     }
		// });
	},
	saveOrUpdateSubscriber: function(subscriber,fn){
		SubscriberDao.saveOrUpdateSubscriber(subscriber,fn);
	}
};

