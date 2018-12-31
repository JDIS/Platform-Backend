const fs = require('fs');

const _ = require('lodash');

const challenges = require('./challenge').list;

const languages = [];

exports.init = function () {
  return new Promise((complete, fail) => {
    fs.readFile(`${__dirname}/../languages.json`, (err, content) => {
      if (err) {
        fail(err);
      }

      try {
        languages.push(...JSON.parse(content));
      } catch (e) {
        fail(e);
      }

      complete(languages);
    });
  });
};

exports.getSupported = function (ctx) {
  if (ctx.query.challenge) {
    const idx = _.findIndex(challenges, { name: ctx.query.challenge });
    if (idx >= 0) {
      if (challenges[idx].blacklist) {
        const availableLanguages = languages.filter((language) => !challenges[idx].blacklist.includes(language.name));
        ctx.body = { languages: availableLanguages };
        ctx.status = 200;
        return;
      }
      if (challenges[idx].whitelist) {
        const availableLanguages = languages.filter((language) => challenges[idx].whitelist.includes(language.name));
        ctx.body = { languages: availableLanguages };
        ctx.status = 200;
        return;
      }
    } else {
      ctx.status = 400;
      return;
    }
  }
  ctx.body = { languages };
  ctx.status = 200;
};

exports.aliases = function (name) {
  const alias = {
    'Python 2.7': ['python'],
    'Python 3.6': ['python'],
    'Javascript': ['javascript'] // eslint-disable-line quote-props
  };
  return [name].concat(alias[name]);
};

exports.supported = languages;
