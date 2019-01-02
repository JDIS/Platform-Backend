const fs = require('fs');

const Result = require('mongoose').model('Result');
const _ = require('lodash');

const Category = require('../models/category');
const Challenge = require('../models/challenge');
const Language = require('../models/language');
const Test = require('../models/test');
const { readFileAsync, readdirAsync } = require('../utils');

const challenges = [];

const init = function (languages) {
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

const seed = async (ctx) => {
  const added = [];
  const categoriesFolders = await readdirAsync(`${global.__basedir}/seed/challenges`);

  // challenges are nested inside a category folder
  // we do not care about the names of the folder since the metadata of the challenge contain everything
  for (const categoryFolder of categoriesFolders) {
    const challengesFolders = await readdirAsync(`${global.__basedir}/seed/challenges/${categoryFolder}`);

    for (const challengeFolder of challengesFolders) {
      // read challenge files
      const metadata = JSON.parse(await readFileAsync(
        `${global.__basedir}/seed/challenges/${categoryFolder}/${challengeFolder}/challenge.json`,
        { encoding: 'utf8' }
      ));
      const description = await readFileAsync(
        `${global.__basedir}/seed/challenges/${categoryFolder}/${challengeFolder}/README.md`,
        { encoding: 'utf8' }
      );

      if (await Challenge.findOne({ name: metadata.name })) {
        continue;
      }

      // create the challenge
      const category = await Category.findOne({ name: metadata.category });
      const whitelist = await Language.getByNames(metadata.whitelist || []);
      const blacklist = await Language.getByNames(metadata.blacklist || []);
      const boilerplates = [];
      for (const [languageName, code] of Object.entries(metadata.boilerplates)) {
        const language = await Language.findOne({ name: languageName });
        if (language) {
          boilerplates.push({
            language: language._id,
            code
          });
        }
      }
      const challenge = await Challenge.create({
        name: metadata.name,
        description,
        points: metadata.points,
        category: category._id,
        isCodingChallenge: metadata.isCodingChallenge,
        timeAllowed: metadata.timeAllowed,
        languagesAllowed: {
          blacklist,
          whitelist
        },
        boilerplates
      });

      // create the tests
      for (const test of metadata.tests) {
        await Test.create({
          name: test.name,
          challenge,
          isCode: test.isCode,
          inputs: test.inputs,
          outputs: test.outputs,
          code: test.code
        });
      }

      added.push(challenge);
    }
  }

  ctx.status = 200;
  ctx.body = added;
};

const getAll = async function (ctx) {
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

const getResult = async function (ctx) {
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

const getResults = async function (ctx) {
  const cip = ctx.state.user.data.cip;
  let results = await Result.find({ cip });
  if (!results) {
    results = [];
  }

  ctx.body = { results };
  ctx.status = 200;
};

module.exports = {
  init,
  getAll,
  getResult,
  getResults,
  seed,
  list: challenges
};
