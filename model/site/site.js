import objectPath from 'object-path';

export default {
  identity: 'site',
  base: 'persisted',
  public: true,
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    repo: {
      type: 'string',
      required: true
    },
    host: {
      type: 'string',
      required: true
    },
    analytics: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string'
    },
    styles: {
      type: 'array'
    },
    scripts: {
      type: 'array'
    },
    description: {
      type: 'string',
      required: true
    },
    keywords: {
      type: 'string',
      required: true
    },
    redirects: {
      type: 'array'
    },
    contact: {
      email: {
        type: 'string'
      },
      phone: {
        type: 'string'
      }
    },
    testimonial: {
      collection: 'testimonial',
      via: 'site'
    },
    staticpages: {
      collection: 'dynamic-page',
      via: 'site'
    },
    pages: {
      collection: 'page',
      via: 'site'
    }
  },
  beforeAccess: (req, res, next) => {
    if (!req.user) return next();

    let hosts = req.user.groups.items.map(group => group.name);

    if (!~hosts.indexOf('Admin')) objectPath.set(req, 'query.filter.where.host', hosts);

    next();
  }
};
