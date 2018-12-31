const _ = require('lodash');
const cors = require('kcors');
const session = require('koa-session');
const responseTime = require('koa-response-time');
const logger = require('koa-logger');
const compress = require('koa-compress');
const errorHandler = require('koa-json-error');
const bodyParser = require('koa-bodyparser');

const config = require('./config');

module.exports = function (app, passport) {
  if (!config.app.keys) { throw new Error('Please add session secret key in the config file!'); }
  app.keys = config.app.keys;

  app.proxy = config.app.proxy || false;
  if (config.app.env === 'dev') {
    app.use(logger());
    app.use(cors({
      credentials: true
    }));
  }

  // JSON error handler
  app.use(errorHandler({
    postFormat: (e, obj) => process.env.NODE_ENV === 'prod' ? _.omit(obj, 'stack') : obj
  }));

  // Session management
  app.use(session(app));
  app.use(bodyParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(compress());
  app.use(responseTime());
};
