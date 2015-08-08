import express from 'express';
import selectn from 'object-path';
import Promise from 'bluebird';
import async from 'async';
// import ACL from '../lib/stormpath/acl';
import injectResource from './resource';

export default function(app) {

  let router = express.Router({ mergeParams: true });

  // let acl = {middleware: () => {}};//new ACL(model.acl);
  // let aclMiddleware = acl.middleware.bind(acl);
  router.use(injectResource(app));
  // router.use(aclMiddleware(app));

  router.route('/')
    .get(({ model, Model }, res, next) => {
      model
        .then(res.json.bind(res))
        .catch(next);
    })
    .post(({ model, body }, res, next) => {
      model.create(body)
        .then(res.json.bind(res))
        .catch(next);
    });

  router.route('/count')
    .get(({ Model, model }, res, next) => {
      model
        .then((count) => res.json({ count }))
        .catch(next);
    });

  router.route('/:id')
    .get(({ Model, params }, res, next) => {
      Model.findOne({ id: params.id })
        .then(res.json.bind(res))
        .catch(next);
    })
    .put(({ model, params, body }, res, next) => {
      model.update({ id: params.id }, body)
        .then(res.json.bind(res))
        .catch(next);
    })
    .delete(({ model, params }, res, next) => {
      model.destroy({ id: params.id })
        .then(res.json.bind(res))
        .catch(next);
    });

  return router;

  function middleware(fn, req, res, next) {
    if (typeof fn === 'function') return fn(req, next);
    if (Array.isArray(fn)) return async.series(fn.map((n) => n.bind(this, req)), next);
    next();
  }

  function promiseMiddleware(fn, obj) {
    if (typeof fn === 'function') return Promise.fromNode(fn.bind(this, obj));
    if (Array.isArray(fn)) return Promise.all(fn.map((n) => promiseMiddleware(n, obj)));
    return Promise.resolve(obj);
  }
}

