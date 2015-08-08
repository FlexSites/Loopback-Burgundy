import express from 'express';
import bool from 'boolean';
import { singularize } from '../../lib/string-util';
import queryBuilder from './query-builder';



export default function(app) {

  let router = express.Router({ mergeParams: true });

  router.use((req, res, next) => {

    let model = app.get('models')[singularize(req.params.resource)];

    console.log(singularize(req.params.resource), Object.keys(app.get('models')));

    if (!model) return next();


    if (typeof model.beforeAccess !== 'function') model.beforeAccess = (req, res, next) => next();

    req.model = req.Model = model;

    next();
  });

  router.get('/*',
    (req, res, next) => req.model.beforeAccess(req, res, next),
    queryBuilder);

  let methods = [
    'beforeValidate',
    'afterValidate',
    'beforeUpdate',
    'afterUpdate',
    'beforeCreate',
    'afterCreate',
    'beforeDestroy',
    'afterDestroy'
  ];

  router.use((req, res, next) => {
    if (req.Model._attributes.site && !req.body.site) {
      req.body.site = req.flex.site.id;
    }

    next();
  });

  router.put(flattenBody);
  router.post(flattenBody);
  router.patch(flattenBody);

  return router;

  function flattenBody(req, res, next) {
    req.body = flatten(req.body);
    next();
  }

  function flatten(obj) {
    var toReturn = {};

    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;

      if (typeof obj[i] === 'object') {
        var flatObject = flatten(obj[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + '_' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = obj[i];
      }
    }

    return toReturn;
  }
}


