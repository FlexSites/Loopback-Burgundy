var loopback = require('loopback');
var MailService = require('../../../server/services/MailService.js');

module.exports = function (Message) {

  Message.observe('before save', function (context, next) {
    var ctx = loopback.getCurrentContext()
      , site = ctx.get('site');

    if(site && context.instance)
    {
      var ins = context.instance;
      ins.toEmail = site.contact.email;
      ins.subject = 'New Message from ' + context.instance.name;
      ins.type='contact';
      ins.fromEmail='FlexSites.io <contact@flexsites.io>';
      next();
    }
    else
    {
      next('No Site in context or context had no instance for contact message.');
    }
  });

  Message.observe('after save', function (context, next) {
    var ctx = loopback.getCurrentContext()
      , site = ctx.get('site');

    if(site && context.instance)
    {
      var ins = context.instance;

      var message = {
        name: ins.name,
        email: ins.email,
        phone: ins.phone,
        title: ins.subject,
        body: ins.body,
        host: site.host,
        from: ins.fromEmail,
        to: ins.toEmail,
        subject: ins.subject,
      }
      MailService.contactTemplate(message, function(err,html){
        if(err){
          return next('Template Failed to build, email wasn\'t sent: '
            + JSON.stringify(context.instance));
        }
        message.html = html;
        ins.body = html;
        MailService.send(message,function(err,status){
           console.log('send mail responded: '
            + JSON.stringify({message: err||status.message}));
           next();
        });
      });
    }
    else
    {
      next('No Site in context or context had no instance for contact message.');
    }
  });
};
