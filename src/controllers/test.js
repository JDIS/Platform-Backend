const Test = require('../models/test');
const Challenge = require('../models/challenge');

const createAll = async (ctx) => {
  const created = [];
  const challenge = ctx.request.body.challenge;
  const tests = ctx.request.body.tests;

  // Verify if all tests are code or not
  tests.every((t) => t.isCode === tests[0].isCode);

  for (const test of tests) {
    created.push(await Test.create({
      name: test.name,
      challenge,
      isPublic: test.isPublic,
      isCode: test.isCode,
      inputs: test.inputs,
      outputs: test.outputs,
      code: test.code
    }));
  }

  await Challenge.update({ _id: challenge }, { $set: { numberTests: tests.length } });

  ctx.status = 200;
  ctx.body = created;
};

const getAll = async (ctx) => {
  const tests = await Test.find({ challenge: ctx.params.id });
  ctx.status = 200;
  ctx.body = tests;
};

const updateAll = async (ctx) => {
  const updated = [];
  const challenge = ctx.request.body.challenge;
  const tests = ctx.request.body.tests;

  for (const test of tests) {
    updated.push(await Test.findByIdAndUpdate(test.id, {
      name: test.name,
      challenge,
      isPublic: test.isPublic,
      isCode: test.isCode,
      inputs: test.inputs,
      outputs: test.outputs,
      code: test.code
    }));
  }

  await Challenge.update({ _id: challenge }, { $set: { numberTests: tests.length } });

  ctx.status = 200;
  ctx.body = updated;
};

module.exports = {
  createAll,
  getAll,
  updateAll
};
