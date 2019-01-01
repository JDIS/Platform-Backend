const winston = require('winston');

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.splat(),
  winston.format.printf((msg) => {
    const { timestamp, level, message, meta } = msg;
    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${meta ? JSON.stringify(meta, null, 2) : ''}`;
  }),
);

winston.add(new winston.transports.Console({
  level: 'debug',
  format: alignedWithColorsAndTime
}));

module.exports = winston;
