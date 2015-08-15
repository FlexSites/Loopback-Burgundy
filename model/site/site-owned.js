'use strict';

import objectPath from 'object-path';

export default {
  identity: 'site-owned',
  base: 'persisted',
  attributes: {
    site: {
      model: 'site',
      required: true
    }
  },
  beforeAccess: function(req, res, next) {
    // If there's a siteId in the request, only show related models
    let site = req.flex.site;
    if (!site) return next();

    objectPath.set(req.query, 'filter.where.site', site.id);

    next();
  }
};
