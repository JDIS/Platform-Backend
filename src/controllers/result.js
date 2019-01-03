const Result = require('../models/result');

const get = async (ctx) => {
  const user = ctx.state.user.id;
  const challenge = ctx.params.id;

  const result = await Result.findOne({ user, challenge });

  if (!result) {
    ctx.throw(404, 'Result not found');
  }

  ctx.status = 200;
  ctx.body = result;
};

const getAll = async (ctx) => {
  const user = ctx.state.user.id;

  let results = await Result.find({ user });

  if (!results) {
    results = [];
  }

  ctx.status = 200;
  ctx.body = results;
};

module.exports = {
  get,
  getAll
};
