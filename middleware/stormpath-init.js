import path from 'path';
import { init as stormpath } from 'express-stormpath';

export default function(app) {
  return stormpath(app, {
    apiKeyFile: path.join(__root, 'apiKey-5G330HYMRQFVRSF6GEYKQWRH8.properties'),
    application: 'https://api.stormpath.com/v1/applications/1tjbfPboEjf2Oqd7qW0XNb',
    secretKey: 'some_long_random_string',
    expandGroups: true,
    registrationView: path.join(__root, 'views/register.jade'),
    loginView: path.join(__root, 'views/login.jade'),
  });
}

