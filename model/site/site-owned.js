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
  },

  beforeValidate: function(...args) {
    console.log('beforeValidate', arguments);
    args.map((arg) => {
      if (typeof arg === 'function') {
        arg();
      }
    });
    // if (instance && !instance.id) {
    //   var site = loopback.getCurrentContext().get('site');
    //   if (!instance.siteId) {
    //     if (!site) return next(new Error('Saving object to undefined site'));
    //     instance.siteId = site.id;
    //   }
    // }

    // next();
  }
};

// export default class SiteModal {
//   constructor(obj = {}, props = []){
//     console.log('superclass');

//     this.props = {};

//     Object.keys(obj)
//       .concat(props)
//       .map((prop) => this[prop] = props[prop]);
//   }

//   get slug() {
//     return this.name.replace(/[^a-z]+/gi, '-').toLowerCase();
//   }
// }

// var loopback = require('loopback');

// module.exports = function(site-owned){

//   site-owned.observe('access', function (ctx, next) {
//     // If there's a siteId in the request, only show related models
//     var context = loopback.getCurrentContext()
//       , site = context.get('site');
//     if(site){
//       var addId = true;
//       if(!ctx.query.where){
//         ctx.query.where = {};
//       }
//       if(ctx.query.where.and){
//         ctx.query.where.and.forEach(function(q){
//           if(q.siteId){
//             return addId = false;
//           }
//         });
//       }
//       if(addId) ctx.query.where.siteId = site.id;
//     }
//     next();
//   });
//   site-owned.observe('before save', function injectSite(context, next) {
//     if (context.instance && !context.instance.id) {
//       var site = loopback.getCurrentContext().get('site');
//       if(!context.instance.siteId){
//         if(!site) return next(new Error('Saving object to undefined site'));
//         context.instance.siteId = site.id;
//       }
//     }
//     next();
//   });
// };
