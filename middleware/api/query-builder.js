import bool from 'boolean';

export default (req, res, next) => {
  if (!req.model) return next();

  let isCount = /count/.test(req.originalUrl);

  req.model.beforeAccess(req, res, () => {
    let {
      // Search
      where,

      // Limit
      limit,

      // Relation population
      include,
      populate,

      // Field select
      fields,
      select,

      // Ordering
      order,
      sort,

      // Offset
      offset,
    } = req.query.filter || {};

    // Aliases
    if (sort) order = sort;
    if (populate) include = populate;
    if (fields) select = fields;

    if (typeof select === 'string') select = [select];

    let params = { select };

    let method = 'find';
    if (isCount) method = 'count';
    if (req.params.id) {
      method += 'One';
      params = { id: req.params.id };
    }

    let query = req.model[method](params);

    if (where) query.where(cleanup(where, req.model));
    if (!isCount) {
      if (order) query.sort(order);
      if (include) query.populate(typeof include === 'object' ? Object.keys(include).join(' ') : include);
      if (offset) query.skip(offset);
      if (limit) query.limit(limit);
    }

    req.model = query;
    next();
  });


  function cleanup(where, model) {
    let obj = {};
    Object.keys(where)
      .map((prop) => {

        // TODO: Probably bad practice to reference underscored properties...
        obj[prop] = coerce(where[prop], model._cast._types[prop] || 'string');
      });
    return obj;
  }

  function coerce(val, type) {
    if (Array.isArray(val)) return val.map(v => coerce(v, type));
    if (type === 'string') return (val || '').toString();
    if (type === 'integer') return parseInt(val || 0);
    if (type === 'double' || type === 'float') return parseFloat(val || 0.0);
    if (type === 'boolean') return bool(val);
  }
}
