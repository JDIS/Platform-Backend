const isConnected = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  }
  ctx.throw(401, 'not-connected');
};

const isAdmin = (ctx, next) => {
  const user = ctx.state.user;
  if (user && user.meta.isAdmin === true) {
    return next();
  }
  ctx.throw(403, 'insufficient-rights');
};

module.exports = {
  isConnected,
  isAdmin
};
