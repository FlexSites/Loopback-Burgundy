'use strict';

import { set } from 'object-path';
import queryBuilder from '../../lib/query-builder';

export default function(app) {
  return (req, res, next) => {
    if (!req.model || req.method !== 'GET') return next();

    let isCount = /count/.test(req.originalUrl);

    req.model.beforeAccess(req, res, () => {
      if (req.params.id) set(req, 'query.filter.where.id', req.params.id);
      req.model = queryBuilder(req.model, req.query.filter, isCount);
      next();
    });
  };
}
