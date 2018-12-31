const fs = require('fs');

const mongoose = require('mongoose');

module.exports = function (config) {
  /**
   * Connect to database
   */
  mongoose.connect(config.mongo.url, function (err) {
    if (err) {
      console.error('\x1b[31m', 'Could not connect to MongoDB!');
      console.log(err);
    }
  });
  mongoose.connection.on('error', function (err) {
    console.log('Error Mongo:');
    console.log(err);
  });

  /**
   * Load the models
   */
  const modelsPath = config.app.root + '/src/models';
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('js')) {
      require(modelsPath + '/' + file);
    }
  });
};
