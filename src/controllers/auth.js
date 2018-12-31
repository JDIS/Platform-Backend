exports.getCurrentUser = function (ctx) {
  if (ctx.state.user) {
    ctx.body = { user: ctx.state.user };
  }
  ctx.status = 200;
};

exports.signOut = function (ctx) {
  ctx.logout();
  ctx.session = null;
  ctx.status = 204;
};
