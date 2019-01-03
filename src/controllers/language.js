const Challenge = require('../models/challenge');
const Language = require('../models/language');
const { readFileAsync } = require('../utils');

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

const getSupported = async (ctx) => {
  const languages = await Language.find({});

  if (ctx.query.challenge) {
    const challenge = await Challenge.findById(ctx.query.challenge);

    if (!challenge) {
      ctx.throw(400, 'Challenge does not exists');
    }

    const { blacklist, whitelist } = challenge.languagesAllowed;
    if (blacklist.length) {
      const availableLanguages = languages.filter((l) => !challenge.languagesAllowed.blacklist.includes(l.name));
      ctx.body = availableLanguages;
      ctx.status = 200;
      return;
    }
    if (whitelist.length) {
      const availableLanguages = languages.filter((l) => challenge.languagesAllowed.whitelist.includes(l.name));
      ctx.body = { languages: availableLanguages };
      ctx.status = 200;
      return;
    }
  }
  ctx.body = languages;
  ctx.status = 200;
};

module.exports = {
  seed,
  getSupported
};
