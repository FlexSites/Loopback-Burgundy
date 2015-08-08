
import path from 'path';
import express from 'express';
import { version } from './package.json';
import semver from 'semver';

// Initialization
import initDB from './init/models';
// Middlewares
import swaggerUi from 'swaggerize-ui';
import stormpathInit from './middleware/stormpath-init';
import siteRequired from './middleware/stormpath/site-required';
import wwwRedirect from './middleware/www-redirect';
import staticProxy from './middleware/static-proxy';
import pageRender from './middleware/page-render';
import api from './middleware/api';
import siteInjector from './middleware/site-injector';
import augmentDocs from './middleware/augment-docs';
import { json } from 'body-parser';

var app = express();
const DOCS_PATH = '/docs';
const SWAGGER_PATH = '/api-docs';

global.__root = __dirname;

initDB(app)
  .then((models) => {

    // Redirect Apex domains to www
    app.use(wwwRedirect());

    // Parse JSON requests
    app.use(json({ extended: true }));

    // Swagger Spec
    app.use(SWAGGER_PATH, augmentDocs(models));

    // Swagger UI
    app.use(DOCS_PATH, swaggerUi({ docs: SWAGGER_PATH }));

    // Static Proxy
    app.use(staticProxy());

    // Stormpath Config
    app.use(stormpathInit(app));


    app.use((req, res, next) => {
      if (app.get('models')) return next();
      res.sendStatus(503);
    });

    app.use(siteInjector(app));

    // Check that they're in the right group
    app.use((req, res, next) => {
      if (req.flex.site.host !== 'admin.flexsites.io') return next();
      siteRequired(req, res, next);
    });

    // API
    app.use('/api/:version/:resource', api(app));

    // Page Render
    app.use(pageRender(app));

    app.use((err, req, res, next) => {
      console.log('Found err', err.stack);
      res.send(err);
    });

    app.listen(process.env.PORT || 3000, function(){
      console.log('Startup complete');
    });
  });


