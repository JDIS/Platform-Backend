const fs = require('fs');
const promisify = require('util').promisify;

const _ = require('lodash');
const Code = require('mongoose').model('Code');
const User = require('mongoose').model('User');
const Result = require('mongoose').model('Result');

const Tester = require('../challenges/tests/tester');

const languages = require('./language').supported;

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const _challenges = {};

exports.init = function (challenges) {
  challenges.forEach((challenge) => {
    _challenges[challenge.name] = challenge;
  });
};

exports.saveCode = async function (ctx) {
  const user = ctx.state.user;
  const code = ctx.request.body.code;
  code.cip = user.data.cip;
  user.data.language = code.language;
  user.id = undefined;
  await User.update({ cip: user.cip }, { $set: { 'data.language': code.language } });
  const resp = await Code.save(code);
  if (resp.ok) {
    ctx.body = { code };
    ctx.status = 200;
  } else {
    ctx.body = { error: resp };
    ctx.status = 500;
  }
};

exports.getChallengeCodes = async function (ctx) {
  if (!ctx.query.challenge) {
    ctx.status = 400;
    ctx.body = { error: 'Specify a challenge' };
  }

  const user = ctx.state.user;
  const codes = await Code.getChallenge(user.data.cip, ctx.query.challenge);
  ctx.body = { codes };
};

exports.submit = async function (ctx) {
  const user = ctx.state.user;
  const code = ctx.request.body;
  const cip = user.data.cip;

  // make sure we are using an allowed language
  if ((_challenges[code.challenge].blacklist && _challenges[code.challenge].blacklist.includes(code.language)) ||
     (_challenges[code.challenge].whitelist && !_challenges[code.challenge].whitelist.includes(code.language))) {
    ctx.status = 403;
    return;
  }

  // remove current result
  await Result.remove({ challenge: code.challenge, cip });

  // update user prefered language
  user.language = code.language;
  await User.update({ cip: user.cip }, { $set: { 'data.language': code.language } });

  // prepare code file
  const language = languages[_.findIndex(languages, { name: code.language })];
  const filename = `${cip}_${code.challenge}_${Math.floor(new Date() / 1000)}${language.fileExtension}`;
  await writeFileAsync(`${__dirname}/../challenges/codes/${filename}`, code.code);

  // test code
  const tester = new Tester(filename, language);
  const jsonstring = await readFileAsync(`${__dirname}/../challenges/tests/${code.challenge}.json`);
  tester.setTest(JSON.parse(jsonstring));
  const result = await tester.run();

  // save result
  result.cip = cip;
  result.challenge = code.challenge;
  result.points = Math.floor(_challenges[code.challenge].points * result.percent);
  const resp = await Result.save(result);

  if (resp.ok) {
    ctx.status = 200;
  } else {
    ctx.body = { error: resp };
    ctx.status = 500;
  }
};
