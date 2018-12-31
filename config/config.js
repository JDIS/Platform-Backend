const path = require('path');

const _ = require('lodash');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const base = {
  app: {
    root: path.normalize(path.join(__dirname, '/..')),
    env
  }
};

const specific = {
  dev: {
    app: {
      port: 3000,
      name: 'Selection CS GAMES - Dev',
      keys: ['super-secret-hurr-durr'],
      proxy: true
    },
    mongo: {
      url: 'mongodb://localhost/csgamesplatform_dev'
    },
    redis: {
      url: 'redis://localhost/'
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
    },
    redis: {
      url: 'redis://localhost/'
    }
  },
  prod: {
    app: {
      port: process.env.PORT || 3000,
      name: 'Selection CS GAMES',
      proxy: true,
      keys: ['super-secret-hurr-durr']
    },
    mongo: {
      url: 'mongodb://database/csgamesplatform' // Running in docker
    },
    redis: {
      url: 'redis://cache/'
    }
  }
};

module.exports = _.merge(base, specific[env]);
