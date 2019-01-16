const User = require('mongoose').model('User');
const Result = require('mongoose').model('Result');

const getAll = async function (ctx) {
  const result = [];
  const users = await User.find({});
  const usersObj = {};
  for (const user of users) {
    usersObj[user._id] = user;
  }

  const points = await Result.getUsersPoints();
  for (const point of points) {
    if (usersObj[point._id]) {
      result.push({ totalPoints: point.points, ...usersObj[point._id].toJSON() });
    }
  }

  ctx.body = result;
};

const makeAdmin = async function (ctx) {
  const { id } = ctx.params;
  const user = await User.findById(id);
  if (!user) {
    ctx.throw(404, 'user-not-exist');
  }
  user.meta.isAdmin = true;
  await user.save();

  ctx.body = { user };
};

module.exports = {
  getAll,
  makeAdmin
};
