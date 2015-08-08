'use strict';

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
  beforeAccess: (req, res, next) => next(),
};
