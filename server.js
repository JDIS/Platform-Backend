const koa = require('koa');
const passport = require('koa-passport');
const logger = require('winston');

const config = require('./config/config');

// helper to root directory
global.__basedir = __dirname;

const app = new koa();

require('./config/logger')(app);

require('./config/database')(config);

require('./config/passport')(passport);

require('./config/koa')(app, passport);

require('./src/routes')(app, passport);

require('./config/migrations')();

app.listen(config.app.port, '0.0.0.0', function () {
  logger.info('Server started, listening on port:', config.app.port);
  logger.info(`Environment: ${config.app.env}`);
});
