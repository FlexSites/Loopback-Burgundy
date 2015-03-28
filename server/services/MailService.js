// MAIL SERVICE

var Mailgun = require('mailgun-js');
var hogan = require('hogan.js');
var path = require('path');
var fs = require('fs');



module.exports = {
  contactTemplate: function(contact,fn){
    fs.readFile('/www/global/html/email.html','utf8', function (err,data) {
      fn(err,hogan.compile(data).render(contact));
    });
  },
  send: function(to,from,subject,body,fn){
    if(process.env.MAILGUN_API_KEY){
      var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY
        , domain: 'comedian.io'});
    
      var data = {
        from: from,
        to: to,
        subject: subject,
        html: body
      };

      mailgun.messages().send(data, function (error, body) {
        fn(error,{message: 'Successfully sent message'});
      });
    }
    else {
      console.log('Missing Mailgun API Key');
    }
  }
};
