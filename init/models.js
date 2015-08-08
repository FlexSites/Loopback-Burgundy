import Waterline from 'waterline';
import mongoAdapter from 'sails-mongo';
import glob from 'glob';
import path from 'path';
import Promise from 'bluebird';
import { merge, clone } from 'lodash';
import { camelFromDash } from '../lib/string-util';

export default function(app) {
  // Instantiate a new instance of the ORM
  var orm = new Waterline();
  var schemas = glob
    .sync(path.join(__dirname, '../model/**/**.js'))
    .reduce((prev, curr) => {
      let base = path.basename(curr, '.js');
      prev[base] = curr;
      return prev;
    }, {});

  Object.keys(schemas)
    .map(getModel)
    .filter(model => model.public)
    .map(model => {
      model.tableName = camelFromDash(model.identity);
      return model;
    })
    .map(model => Waterline.Collection.extend(model))
    .map(orm.loadCollection.bind(orm));

  return Promise.promisify(orm.initialize.bind(orm))({

    // Setup Adapters
    // Creates named adapters that have have been required
    adapters: {
      'default': mongoAdapter,
      disk: mongoAdapter,
      mongo: mongoAdapter
    },

    // Build Connections Config
    // Setup connections using the named adapter configs
    connections: {
      myLocalmongo: {
        adapter: 'mongo',
        url: 'mongodb://heroku_app34616047:76dbhonrp4rk9qe5uonccl6c6m@ds051831.mongolab.com:51831/heroku_app34616047'
      }
    },

    defaults: {
      migrate: 'alter'
    }

  })
    .then((models) => {
      app.set('models', models.collections);
      app.set('connections', models.connections);
      console.log('Waterline is up');
      return models.collections;
    });

  function getModel(name) {
    var obj = schemas[name];
    if (!obj) throw new Error(`Schmemata for model ${name} not found`);

    if (typeof obj === 'string') obj = schemas[name] = require(obj);

    if (obj.base) obj = merge({}, getModel(obj.base), obj);

    return obj;
  }
}





