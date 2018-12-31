var User = require("mongoose").model("User");
var Result = require("mongoose").model("Result");

exports.readAll = async function (ctx) {
  let result = [];
  var users = await User.find({}).sort("-meta.isAdmin data.cip").exec();
  let usersObj = {};
  for (let user of users) {
    usersObj[user.data.cip] = user;
  }

  let points = await Result.getUsersPoints().exec();
  for (let point of points) {
    if(usersObj[point._id]) {
      usersObj[point._id].data.totalPoints = point.points;
      result.push(usersObj[point._id]);
    }
  }

  ctx.body = { users: result };
};

exports.makeAdmin = async function (ctx) {
  const { id } = ctx.params;
  let user = await User.findById(id).exec();
  if (!user) {
    ctx.throw("L'usager n'existe pas", 404);
  }
  user.meta.isAdmin = true;
  await user.save();

  ctx.body = { user };
};
