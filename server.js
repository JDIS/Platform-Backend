const koa = require('koa');
const passport = require('koa-passport');

const config = require('./config/config');
const logger = require('./config/logger');

const app = new koa();

require('./config/database')(config);

require('./config/passport')(passport);

require('./config/koa')(app, passport);

require('./src/routes')(app, passport);

app.listen(config.app.port, '0.0.0.0', function () {
  logger.info('Server started, listening on port:', config.app.port);
  logger.info(`Environment: ${config.app.env}`);
});
