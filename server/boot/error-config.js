
function addError(name,fn) {
  var err = fn;
  err.prototype = Error.prototype;
  global[name] = err;
}

// 401 UNAUTHORIZED
addError('Unauthorized',function(message){
  this.message = message || 'You must login to perform this action';
  this.status = 401;
});

// 405 METHOD NOT ALLOWED
addError('NotAllowed',function(message,allowed){
  this.message = message || 'Method Not Allowed';
  this.allowed = allowed;
  this.status = 405;
});