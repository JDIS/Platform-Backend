const Challenge = require('../models/challenge');
const Code = require('../models/code');
const Language = require('../models/language');
const Result = require('../models/result');
const Test = require('../models/test');
const User = require('../models/user');
const Tester = require('../services/tester/tester');
const { writeFileAsync } = require('../utils');

const saveCode = async (ctx) => {
  const user = ctx.state.user.id;
  const newCode = ctx.request.body;
  newCode.user = user;

  await User.update({ user }, { $set: { 'data.language': newCode.language } });
  await Code.save(newCode);

  ctx.status = 200;
};

const getChallengeCodes = async (ctx) => {
  if (!ctx.query.challenge) {
    ctx.throw(400, 'Must specify a challenge');
  }

  const user = ctx.state.user.id;

  ctx.status = 200;
  ctx.body = await Code.getChallenge(user, ctx.query.challenge);
};

const submit = async (ctx) => {
  const user = ctx.state.user.id;
  const cip = ctx.state.user.data.cip;
  const code = ctx.request.body;

  // make sure we are using an allowed language
  const challenge = await Challenge.findById(code.challenge);
  const { blacklist, whitelist } = challenge.languagesAllowed;
  if ((blacklist.length && blacklist.includes(code.language)) ||
     (whitelist.length && !whitelist.includes(code.language))) {
    ctx.throw(403, 'Language not allowed');
  }

  // remove current result
  await Result.remove({ challenge: code.challenge, user });

  // prepare code file
  const language = await Language.findById(code.language);
  const filename = `${cip}_${challenge.name}_${Math.floor(new Date() / 1000)}${language.fileExtension}`;
  await writeFileAsync(`${global.__basedir}/data/codes/${filename}`, code.code);

  // test code
  const tests = await Test.find({ challenge: code.challenge });
  const tester = new Tester(filename, language, challenge);
  tester.setTests(tests);
  const result = await tester.run();

  // save result
  result.user = user;
  result.challenge = code.challenge;
  result.points = Math.floor(challenge.points * result.percent);
  const resp = await Result.save(result);

  if (resp.ok) {
    ctx.status = 200;
  } else {
    ctx.body = { error: resp };
    ctx.status = 500;
  }
};

module.exports = {
  saveCode,
  getChallengeCodes,
  submit
};
