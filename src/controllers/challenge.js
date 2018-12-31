var fs = require('fs');
var Result = require("mongoose").model("Result");
var _ = require('lodash');

let challenges = [];

exports.init = function(languages) {
  let aliases = require("./language").aliases;
  let path = `${__dirname}/../challenges/descriptions`;
  return new Promise((complete, fail) => {
    fs.readdir(path, function(err, files) {
      if (err)
        fail(err);
      for (var file of files) {
        let name = file.split('.')[0];
        var jsonstring = fs.readFileSync(`${__dirname}/../challenges/tests/${name}.json`);
        let challengeConfig = JSON.parse(jsonstring);
        if(challengeConfig.deactivated)
          continue;
        const challenge = {
          name: name,
          content: fs.readFileSync(`${path}/${file}`, 'utf8'),
          points: challengeConfig.points,
          category: challengeConfig.category,
          isCodingChallenge: challengeConfig.isCodingChallenge,
          blacklist: challengeConfig.blacklist,
          whitelist: challengeConfig.whitelist,
          boilerplates: {}
        };
        for (let language of languages) {
          for (let alias of aliases(language.name)) {
            if (challengeConfig[alias]) {
              challenge.boilerplates[language.name] = challengeConfig[alias];
              break;
            }
          }
        }
        challenges.push(challenge);
      }
      complete(challenges);
    })
  });
}

exports.getAll = async function (ctx) {
  let cip = ctx.state.user.data.cip;
  let result = await Result.findOne({cip: cip, challenge: 'tutoriel'});
  if (result && result.points) {
    ctx.body = {challenges: challenges};
  } else {
    var idx = _.findIndex(challenges, {name: 'tutoriel'});
    ctx.body = {challenges: [challenges[idx]]};
  }

  ctx.status = 200;
};

exports.getResult = async function (ctx) {
  let cip = ctx.state.user.data.cip;
  let challenge = ctx.params.challenge;
  let result = await Result.findOne({cip: cip, challenge: challenge});
  if (result) {
    ctx.body = {result: result};
    ctx.status = 200;
  } else {
  	ctx.body = {error: "Result not found"};
  	ctx.status = 404;
  }
};

exports.getResults = async function (ctx) {
  let cip = ctx.state.user.data.cip;
  let results = await Result.find({cip: cip});
  if  (!results) {
    results = [];
  }

  ctx.body = {results: results};
  ctx.status = 200;
}

exports.list = challenges;
