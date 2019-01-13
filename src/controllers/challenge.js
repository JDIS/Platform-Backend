const Category = require('../models/category');
const Challenge = require('../models/challenge');
const Language = require('../models/language');
const Result = require('../models/result');
const Test = require('../models/test');
const { readFileAsync, readdirAsync } = require('../utils');

const seed = async (ctx) => {
  const added = [];
  const categoriesFolders = await readdirAsync(`${global.__basedir}/seed/challenges`, { withFileTypes: true });

  // challenges are nested inside a category folder
  // we do not care about the names of the folder since the metadata of the challenge contain everything
  for (const categoryFolder of categoriesFolders) {
    if (!categoryFolder.isDirectory() || categoryFolder.name === '.git') {
      continue;
    }

    const challengesFolders = await readdirAsync(`${global.__basedir}/seed/challenges/${categoryFolder.name}`, { withFileTypes: true });

    for (const challengeFolder of challengesFolders) {
      if (!challengeFolder.isDirectory()) {
        continue;
      }

      // read challenge files
      const metadata = JSON.parse(await readFileAsync(
        `${global.__basedir}/seed/challenges/${categoryFolder.name}/${challengeFolder.name}/challenge.json`,
        { encoding: 'utf8' }
      ));
      const description = await readFileAsync(
        `${global.__basedir}/seed/challenges/${categoryFolder.name}/${challengeFolder.name}/README.md`,
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
      if (metadata.boilerplates) {
        for (const [languageName, code] of Object.entries(metadata.boilerplates)) {
          const language = await Language.findOne({ name: languageName });
          if (language) {
            boilerplates.push({
              language: language._id,
              code
            });
          }
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
      try {
        for (const test of metadata.tests) {
          await Test.create({
            name: test.name,
            challenge,
            isPublic: test.isPublic,
            isCode: test.isCode,
            inputs: test.inputs,
            outputs: test.outputs,
            code: test.code
          });
        }
      } catch (err) {
        // revert the whole insert
        await Test.deleteMany({ challenge: challenge._id });
        await Challenge.findByIdAndDelete(challenge._id);
        throw err;
      }

      added.push(challenge);
    }
  }

  ctx.status = 200;
  ctx.body = added;
};

const create = async (ctx) => {
  const metadata = ctx.request.body;

  const challenge = await Challenge.create({
    name: metadata.name,
    description: metadata.description,
    points: metadata.points,
    category: metadata.category,
    isCodingChallenge: metadata.isCodingChallenge,
    timeAllowed: metadata.timeAllowed,
    languagesAllowed: metadata.languagesAllowed,
    boilerplates: metadata.boilerplates
  });

  ctx.status = 200;
  ctx.body = challenge;
};

const get = async (ctx) => {
  const challenge = await Challenge.findById(ctx.params.id);
  if (!challenge) {
    ctx.throw(404, 'Challenge does not exists');
  }
  ctx.status = 200;
  ctx.body = challenge;
};

const getAll = async (ctx) => {
  const user = ctx.state.user.id;
  const result = await Result.findOne({ user });

  // only show all challenges if the user completed a challenge (will be the tutorial)
  if (result && result.points) {
    ctx.body = await Challenge.find({});
  } else {
    const tutorielCategory = await Category.findOne({ name: 'Tutoriel' });
    ctx.body = await Challenge.find({ category: tutorielCategory });
  }

  ctx.status = 200;
};

const update = async (ctx) => {
  const metadata = ctx.request.body;

  const challenge = await Challenge.findByIdAndUpdate(ctx.params.id, {
    name: metadata.name,
    description: metadata.description,
    points: metadata.points,
    category: metadata.category,
    isCodingChallenge: metadata.isCodingChallenge,
    timeAllowed: metadata.timeAllowed,
    languagesAllowed: metadata.languagesAllowed,
    boilerplates: metadata.boilerplates
  });

  ctx.status = 200;
  ctx.body = challenge;
};

const remove = async (ctx) => {
  await Test.deleteMany({ challenge: ctx.params.id });
  await Challenge.findByIdAndDelete(ctx.params.id);
  ctx.status = 200;
};

module.exports = {
  create,
  get,
  getAll,
  remove,
  seed,
  update
};
