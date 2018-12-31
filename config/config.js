const path = require('path');

const _ = require('lodash');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const base = {
  app: {
    root: path.normalize(path.join(__dirname, '/..')),
    env
  }
};

const specific = {
  development: {
    app: {
      port: 3000,
      name: 'Selection CS GAMES - Dev',
      keys: ['super-secret-hurr-durr'],
      proxy: true
    },
    mongo: {
      url: 'mongodb://localhost/csgamesplatform_dev'
    }
  },
  test: {
    app: {
      port: 3001,
      name: 'Selection CS GAMES - Test realm',
      keys: ['super-secret-hurr-durr']
    },
    mongo: {
      url: 'mongodb://localhost/csgamesplatform_test'
    }
  },
  production: {
    app: {
      port: process.env.PORT || 3000,
      name: 'Selection CS GAMES',
      proxy: true,
      keys: ['super-secret-hurr-durr']
    },
    mongo: {
      url: 'mongodb://database/csgamesplatform' // Running in docker
    }
  }
};

module.exports = _.merge(base, specific[env]);
