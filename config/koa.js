const _ = require('lodash');
const cors = require('@koa/cors');
const session = require('koa-session');
const responseTime = require('koa-response-time');
const compress = require('koa-compress');
const errorHandler = require('koa-json-error');
const bodyParser = require('koa-bodyparser');
const redisStore = require('koa-redis');

const config = require('./config');

module.exports = function (app, passport) {
  if (!config.app.keys) { throw new Error('Please add session secret key in the config file!'); }
  app.keys = config.app.keys;

  app.proxy = config.app.proxy || false;
  if (config.app.env === 'dev') {
    app.use(cors({
      credentials: true
    }));
  }

  // JSON error handler
  app.use(errorHandler({
    preFormat: null,
    postFormat: (e, obj) => process.env.NODE_ENV === 'prod' ? _.pick(obj, 'message', 'name') : obj
  }));

  // Session management
  app.use(session({
    store: redisStore({
      url: config.redis.url
    })
  }, app));
  app.use(bodyParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(compress());
  app.use(responseTime());
};
