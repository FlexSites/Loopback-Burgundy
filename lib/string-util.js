
/** OrderService **/
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var url = require('url');

let youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

export function slugify(str='') {
  str = coerceStr(str);
  return str.replace(/[^-a-z0-9._~]{1,}/gi, '-').toLowerCase();
}

export function capitalize(str) {
  str = coerceStr(str);
  if (typeof str !== 'string') str = '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getHostFromURL(str) {
  str = coerceStr(str);
  if (str) return url.parse(str).hostname;
}

export function getBaseHost(host) {
  host = coerceStr(host);
  host = host.replace(/https*:\/\//, '');
  return host.split('.').slice(-2).join('.');
}

export function formatPhoneNumber(tel) {
  tel = coerceStr(tel);
  return tel.substr(0, 3) + '.' + tel.substr(3, 3) + '.' + tel.substr(6, 4);
}

export function stripTags(str) {
  str = coerceStr(str);
  multiArgs(arguments.length ? arguments : [''], function() {
    str = str.replace(RegExp('<\/?[^<>]*>', 'gi'), '');
  });
  return str;
}

export function camelFromDash(str='') {
  str = coerceStr(str);
  return str.split('-')
    .map(capitalize)
    .join('');
}

export function camelFromSnake(str='') {
  str = coerceStr(str);
  return str.replace(/(^[a-z]|-[a-z])/g, function(m, m1) {
    if (m1.charAt(0) === '-') m1 = m1.charAt(1);
    return m1.toUpperCase();
  });
}

export function pluralize(str) {
  str = coerceStr(str);
  if (str.slice(-3) === 'ium') {
    str = str.substr(0, str.length - 3) + 'ia';
  } else if (str.charAt(str.length - 1) === 'y') {
    str = str.substr(0, str.length - 1) + 'ies';
  } else {
    str += 's';
  }

  return str;
}

export function singularize(str) {
  str = coerceStr(str);
  if (/s$/.test(str)) return str.substr(0, str.length - 1);
  return str;
}

export function truncate(str, length) {
  str = coerceStr(str);
  return (str || '').length > length ? str.substr(0, length - 3) + '...' : str;
}

export function getYoutubeId(url) {
  url = coerceStr(url);
  try {
    return youtubeRegex.exec(url)[1];
  } catch (ex) {
    return 'Invalid Youtube URL';
  }
}

function multiArgs(args, fn) {
  var result = []
    , i;
  for (i = 0; i < args.length; i++) {
    result.push(args[i]);
    if (fn)fn.call(args, args[i], i);
  }

  return result;
}

function coerceStr(str) {
  if (typeof str === 'string') return str;
  if (typeof str.toString === 'function') return str.toString();
  return '';
}

