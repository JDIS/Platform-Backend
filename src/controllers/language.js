const fs = require('fs');

const _ = require('lodash');

const Language = require('../models/language');
const { readFileAsync } = require('../utils');

const challenges = require('./challenge').list;

const languages = [];

const init = () => {
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

const seed = async (ctx) => {
  const added = [];
  const languages = JSON.parse(await readFileAsync(`${global.__basedir}/seed/languages.json`, { encoding: 'utf8' }));
  for (const language of languages) {
    if (await Language.findOne({ name: language.name })) {
      continue;
    }
    added.push(await Language.create(language));
  }
  ctx.status = 200;
  ctx.body = added;
};

const getSupported = (ctx) => {
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

const aliases = (name) => {
  const alias = {
    'Python 2.7': ['python'],
    'Python 3.6': ['python'],
    'Javascript': ['javascript'] // eslint-disable-line quote-props
  };
  return [name].concat(alias[name]);
};

module.exports = {
  init,
  seed,
  getSupported,
  aliases,
  supported: languages
};
