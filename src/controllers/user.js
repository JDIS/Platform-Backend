const User = require('mongoose').model('User');
const Result = require('mongoose').model('Result');

exports.readAll = async function (ctx) {
  const result = [];
  const users = await User.find({}).sort('-meta.isAdmin data.cip').exec();
  const usersObj = {};
  for (const user of users) {
    usersObj[user.data.cip] = user;
  }

  const points = await Result.getUsersPoints().exec();
  for (const point of points) {
    if (usersObj[point._id]) {
      usersObj[point._id].data.totalPoints = point.points;
      result.push(usersObj[point._id]);
    }
  }

  ctx.body = { users: result };
};

exports.makeAdmin = async function (ctx) {
  const { id } = ctx.params;
  const user = await User.findById(id).exec();
  if (!user) {
    ctx.throw(404, 'user-not-exist');
  }
  user.meta.isAdmin = true;
  await user.save();

  ctx.body = { user };
};
