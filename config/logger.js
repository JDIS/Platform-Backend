const winston = require('winston');

module.exports = function (app) {
  // Add console transport with nice format
  winston.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.splat(),
      winston.format.printf((msg) => {
        const { timestamp, level, message, meta } = msg;
        const ts = timestamp.slice(0, 19).replace('T', ' ');
        return `${ts} [${level}]: ${message} ${meta ? JSON.stringify(meta, null, 2) : ''}`;
      }),
    )
  }));

  // Middleware to log the requests
  app.use(async (ctx, next) => {
    const start = new Date();
    await next(); // eslint-disable-line callback-return
    const ms = new Date() - start;

    let level;
    if (ctx.status >= 500) {
      level = 'error';
    } else if (ctx.status >= 400) {
      level = 'warn';
    } else if (ctx.status >= 100) {
      level = 'info';
    }

    winston.log({
      level,
      message: `${ctx.method} ${ctx.originalUrl} - ${ctx.status} - ${ms}ms`
    });
  });

  // Listener to log the exceptions
  app.on('error', (err, ctx) => {
    winston.error(err.stack ? err.stack : err.message);
  });
};

