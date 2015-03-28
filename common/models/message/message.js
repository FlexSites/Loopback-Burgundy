var loopback = require('loopback');
var MailService = require('../../../server/services/MailService.js');

module.exports = function (Message) {

  Message.observe('before save', function (context, next) {
    var ctx = loopback.getCurrentContext()
    , site = ctx.get('site')
    , Site = loopback.findModel('Site');

    if(site)
    {
      if(context.instance){
        Site.findById(site.id, function(err,obj){
          context.instance.toEmail = obj.contact.email;
          context.instance.subject = 'New Message from ' + context.instance.name;
          context.instance.type='contact';
          context.instance.fromEmail='Comedian.io <contact@comedian.io>';
          var data = {
            name: context.instance.name,
            email: context.instance.email,
            phone: context.instance.phone,
            title: context.instance.subject,
            message: context.instance.body,
            host: site.host
          }
          MailService.contactTemplate(data, function(err,html){
            if(html){
               MailService.send(context.instance.toEmail,context.instance.fromEmail
                ,context.instance.subject,html,function(err,status){
                 console.log('send mail responded: ' 
                  + JSON.stringify({message: err||status.message}));
               });
            }
            else{
              console.log('Template Failed to Build, email wasn\'t sent: ' 
                + JSON.stringify(context.instance))
            }
          });
          next();
        })
      }
    }
    else
    {
      console.log('No Site in context for message.');
      next();
    }
  });
};
