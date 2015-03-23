var loopback = require('loopback');
var MailService = require('../../../server/services/MailService.js');

module.exports = function (Message) {

  Message.observe('before save', function (ctx, next) {
    var context = loopback.getCurrentContext()
    , site = context.get('site');

    if(site)
    {
      console.log("ctx: " + JSON.stringify(ctx))

      if(ctx.instance){

        console.log("instance: " + JSON.stringify(ctx.instance))
        var contact = {
          name: ctx.instance.name,
          toEmail: ctx.instance.toEmail,
          subject: ctx.instance.subject,
          body: ctx.instance.body

        }
      }

        // var sendToEmail = site.contact.email;
        // console.log('send and email to: ' + sendToEmail);
        console.log('context: ' + JSON.stringify(context));
        console.log('Site: ' + JSON.stringify(site));
        //if model is contactMessage use contacttemplate, etc.
        // MailService.contactTemplate(contact,function(err, results){
        //   var html = results.html;
        //   console.log('HTML: ' + html)
        // });
    }
    else
    {
        console.log('No Site in context...');
    }
    next();

  });
};
