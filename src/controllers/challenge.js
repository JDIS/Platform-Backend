const fs = require('fs');

const Result = require('mongoose').model('Result');
const _ = require('lodash');

const challenges = [];

exports.init = function (languages) {
  const aliases = require('./language').aliases;
  const path = `${__dirname}/../challenges/descriptions`;
  return new Promise((complete, fail) => {
    fs.readdir(path, function (err, files) {
      if (err) {
        fail(err);
      }

      for (const file of files) {
        const name = file.split('.')[0];
        const challengeConfig = JSON.parse(fs.readFileSync(`${__dirname}/../challenges/tests/${name}.json`));

        if (challengeConfig.deactivated) {
          continue;
        }

        const challenge = {
          name,
          content: fs.readFileSync(`${path}/${file}`, 'utf8'),
          points: challengeConfig.points,
          category: challengeConfig.category,
          isCodingChallenge: challengeConfig.isCodingChallenge,
          blacklist: challengeConfig.blacklist,
          whitelist: challengeConfig.whitelist,
          boilerplates: {}
        };

        for (const language of languages) {
          for (const alias of aliases(language.name)) {
            if (challengeConfig[alias]) {
              challenge.boilerplates[language.name] = challengeConfig[alias];
              break;
            }
          }
        }
        challenges.push(challenge);
      }
      complete(challenges);
    });
  });
};

exports.getAll = async function (ctx) {
  const cip = ctx.state.user.data.cip;
  const result = await Result.findOne({ cip, challenge: 'tutoriel' });
  if (result && result.points) {
    ctx.body = { challenges };
  } else {
    const idx = _.findIndex(challenges, { name: 'tutoriel' });
    ctx.body = { challenges: [challenges[idx]] };
  }

  ctx.status = 200;
};

exports.getResult = async function (ctx) {
  const cip = ctx.state.user.data.cip;
  const challenge = ctx.params.challenge;
  const result = await Result.findOne({ cip, challenge });
  if (result) {
    ctx.body = { result };
    ctx.status = 200;
  } else {
    ctx.body = { error: 'Result not found' };
    ctx.status = 404;
  }
};

exports.getResults = async function (ctx) {
  const cip = ctx.state.user.data.cip;
  let results = await Result.find({ cip });
  if (!results) {
    results = [];
  }

  ctx.body = { results };
  ctx.status = 200;
};

exports.list = challenges;
