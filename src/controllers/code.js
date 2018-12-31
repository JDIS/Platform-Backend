var Code = require("mongoose").model("Code");
var User = require("mongoose").model("User");
var Result = require("mongoose").model("Result");
var Tester = require('../challenges/tests/tester');
var fs = require('fs');
const languages = require('./language').supported;
const _ = require('lodash');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

let _challenges = {}

exports.init = function (challenges) {
  challenges.forEach(challenge => {
    _challenges[challenge.name] = challenge;
  });
}

exports.saveCode = async function (ctx) {
  let user = ctx.state.user;
  let code = ctx.request.body.code;
  code.cip = user.data.cip;
  user.data.language = code.language;
  user.id = undefined;
  await User.update({cip: user.cip}, {$set: {"data.language": code.language}});
  let resp = await Code.save(code);
  if (resp.ok) {
    ctx.body = { code: code };
    ctx.status = 200;
  } else {
    ctx.body = { error: resp };
    ctx.status = 500;
  }
};

exports.getChallengeCodes = async function (ctx) {
  if (!ctx.query.challenge) {
    ctx.status = 400;
    ctx.body = {error: 'Specify a challenge'};
  }

  let user = ctx.state.user;
  let codes = await Code.getChallenge(user.data.cip, ctx.query.challenge);
  ctx.body = {codes: codes};
}

exports.submit = async function (ctx) {
  let user = ctx.state.user;
  let code = ctx.request.body;
  let cip = user.data.cip;
  if(   (_challenges[code.challenge].blacklist &&  _challenges[code.challenge].blacklist.includes(code.language))
     || (_challenges[code.challenge].whitelist && !_challenges[code.challenge].whitelist.includes(code.language))) {
    ctx.status = 403;
    return;
  }

  let deleteResp = await Result.remove({challenge: code.challenge, cip: cip});
  user.language = code.language;
  await User.update({cip: user.cip}, {$set: {"data.language": code.language}});
  const language = languages[_.findIndex(languages, {name: code.language})];
  const filename = `${cip}_${code.challenge}_${Math.floor(new Date()/1000)}${language.fileExtension}`;
  await writeFileAsync(`${__dirname}/../challenges/codes/${filename}`, code.code);
  const tester = new Tester(filename, language);
  var jsonstring = await readFileAsync(`${__dirname}/../challenges/tests/${code.challenge}.json`);
  tester.setTest(JSON.parse(jsonstring));
  let result = await tester.run();
  result.cip = cip;
  result.challenge = code.challenge;
  result.points = Math.floor(_challenges[code.challenge].points * result.percent);
  let resp = await Result.save(result);
  if (resp.ok) {
    ctx.status = 200;
  } else {
    ctx.body = { error: resp };
    ctx.status = 500;
  }
}
