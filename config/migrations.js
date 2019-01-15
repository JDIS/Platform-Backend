const logger = require('winston');
const { up } = require('migrate-mongo');
const mongoose = require('mongoose');

module.exports = function () {

  mongoose.connection.createCollection('migrations')
    .then(() => up(mongoose.connection))
    .then((migrations) => {
      migrations.forEach((migration) => logger.info(`Migrated: ${migration}`));
    })
    .catch((err) => {
      logger.error(err.message);
    });
};
