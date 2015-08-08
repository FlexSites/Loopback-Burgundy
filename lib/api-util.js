import Hogan from 'hogan.js';
import Promise from 'bluebird';
import marked from 'marked';
import glob from 'glob';
import path from 'path';
import queryBuilder from '../middleware/api/query-builder';
import { singularize } from './string-util';
let requestAsync = Promise.promisify(require('request'));


var prefix = process.env.NODE_ENV || 'local';
if (prefix === 'prod') prefix = '';

var bucket = process.env.S3_BUCKET || 'http://localcdn.flexsites.io'
  , isDynamic = /^\/(events|entertainers|venues|posts|media)\/*([a-f0-9]{24}\/*)*/
  , templates = {}
  , filterMap = {}//require('./filters.json')
  , options = {
  delimiters: '[[ ]]',
  disableLambda: false
};

var formatters = glob
  .sync(path.join(__dirname, 'formatters/**'))
  .reduce(function(prev, curr) {
    var name = curr.split('/').pop()
      , idx = name.indexOf('.');
    if (!~idx) return prev;
    prev[name.substr(0, idx)] = require(curr);
    return prev;
  }, {});

export default function(app) {

  return {
    getPage,
    getTemplate,
    clearTemplate,
    getData,
    getRouteData,
    getSiteFile,
    parseMarkdown,
  };

  function getResource(name) {
    let resource = app.get('models')[name];
    if (!resource) throw new Error(`Resource ${name} not found`);
    return resource;
  }

  function getPage({ url, flex }) {
    var apiPath = isDynamic.test(url) ? 'dynamicpage' : 'page';
    url = url.replace(/[a-f0-9]{24}.*/, ':id');
    return getResource(apiPath)
      .findOne()
      .where({ url, site: flex.site.id })
      .then((page = {}) => {
        if (!page.templateUrl) return page;
        return getSiteFile(page.templateUrl, flex.site.host)
          .then((body) => {

            // Parse Markdown
            if (page.format === 'MarkDown') body = marked(body);
            page.content = body;
            delete page.templateUrl;
            page.url = url.substr(1, url.length - 1);
            return page;
          });
      });
  }

  function clearTemplate({ hostname }) {
    delete templates[hostname];
  }

  function getTemplate({ hostname }) {
    if (templates[hostname]) return templates[hostname];
    var promise = getSiteFile('/index.html', hostname)
      .then(function(file) {
        return { layout: Hogan.compile(file, options) };
      });
    if (process.env.NODE_ENV === 'prod') {
      templates[hostname] = promise;
    }

    return promise;
  }

  function getSiteFile(path, host) {
    return request({ url: bucket + '/' + removePrefix(host) + '/public' + path });
  }

  function removePrefix(url) {
    return /^(?:https?:\/\/)?(?:www|local|test)?\.?(.*)$/.exec(url)[1];
  }

  function formatter(type, data) {
    var fn = formatters[type];
    if (!fn) return data;
    if (Array.isArray(data)) return data.map(fn);
    return fn(data);
  }

  function getRouteData({ params: { resource, id }, hostname }) {
    return getData(resource, id, hostname);
  }

  function getData(resource, id, req, res, parent = {}) {
    var isList = !id;
    if (!resource) return Promise.resolve({});
    // filterMap[resource] || [];

    req.model = getResource(singularize(resource));
    req.params = { resource, id };

    return Promise.fromNode((cb) => queryBuilder(req, res, cb))
      .then(() => req.model
        .then((data) => {
          var name = resource;
          if (!isList) name = name.replace(/s$/, '').replace(/ia$/, 'ium');
          parent[name] = formatter(resource, data);
          return parent;
        }));

  }

  function parseMarkdown(field, data) {
    if (!data) return {};
    data[field] = marked(data[field]);
    return data;
  }



  function request(opts) {
    return requestAsync(opts)
      .spread(function(res, body) {
        if (res.statusCode === 404) return '';
        if (res.statusCode > 399) {
          var err = new Error();
          err.status = res.statusCode;
          throw err;
        }

        return body;
      });
  }

}
