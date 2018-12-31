const cors = require('kcors');
const session = require('koa-session');
const responseTime = require('koa-response-time');
const logger = require('koa-logger');
const compress = require('koa-compress');
const errorHandler = require('koa-error');
const bodyParser = require('koa-bodyparser');

const config = require('./config');

module.exports = function (app, passport) {
  if (!config.app.keys) { throw new Error('Please add session secret key in the config file!'); }
  app.keys = config.app.keys;

  app.proxy = config.app.proxy || false;
  if (config.app.env === 'dev') {
    app.use(logger());
    app.use(cors());
  }

  app.use(errorHandler({
    template: config.app.root + '/src/views/error.html'
  }));

  app.use(session(app));
  app.use(bodyParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(compress());
  app.use(responseTime());
};
