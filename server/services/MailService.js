// MAIL SERVICE

var Mailgun = require('mailgun-js')
  , hogan = require('hogan.js')
  , fs = require('fs')
  , mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY, 
    domain: 'comedian.io',
  });


module.exports = {
  contactTemplate: function(contact,fn){
    fs.readFile('/www/global/html/email.html','utf8', function (err,data) {
      fn(err,hogan.compile(data).render(contact));
    });
  },
  send: function(message,fn){
    if(process.env.MAILGUN_API_KEY){
      mailgun.messages().send(message, fn);
    }
    else {
      console.log('Missing Mailgun API Key for: %s to %s from %s message: %s'
        , message.subject, message.to, message.from, message.body);
    }
  }
};
