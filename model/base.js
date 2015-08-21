'use strict';

let passThrough = (req, res, next) => next();

export default {
  identity: 'base',
  attributes: {
    createdAt: function() {
      return new Date(parseInt(this.id.toString().slice(0, 8), 16) * 1000);
    },

    toJSON: function() {
      this.createdAt = this.createdAt();
      return this;
    }
  },
  middleware: {
    beforeAccess: passThrough,
    beforeValidation: passThrough,
  },
  acl: {
    create: 'siteOwner',
    read: '$everyone',
    update: 'siteOwner',
    delete: 'siteOwner'
  }
};

