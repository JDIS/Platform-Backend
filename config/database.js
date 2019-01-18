const fs = require('fs');

const logger = require('winston');
const cachegoose = require('cachegoose');
const mongoose = require('mongoose');

module.exports = function (config) {
  // connect
  // Remove options when able to (see #1)
  mongoose.connect(config.mongo.url, { useNewUrlParser: true, useCreateIndex: true });

  mongoose.connection.on('error', function (err) {
    logger.error('Error Mongo:', err);
  });

  cachegoose(mongoose, {
    engine: 'redis',
    url: config.redis.url
  });

  // TODO: remove and move to direct imports
  const modelsPath = config.app.root + '/src/models';
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('js')) {
      require(modelsPath + '/' + file);
    }
  });
};
