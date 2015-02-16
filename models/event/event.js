module.exports = function (Event) {

  Event.observe('before save', function checkDate(context, next) {
    if (context.instance) {
      if (!context.instance.date) {
        context.instance.date = new Date(Date.now());
      }
    }
    else {
      if (context.data.date) {
        context.data.date = new Date(Date.now());
      }
    }
    next();

  });
};
