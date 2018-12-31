const Router = require('koa-router');

const userController = require('../src/controllers/user');
const authController = require('../src/controllers/auth');
const challengeController = require('../src/controllers/challenge');
const codeController = require('../src/controllers/code');
const languageController = require('../src/controllers/language');
const accessRights = require('../lib/access-rights');

module.exports = function (app, passport) {
  // TODO: move elsewhere
  languageController.init()
    .then(challengeController.init)
    .then(codeController.init);

  // register routers
  const router = new Router();
  const securedRouter = new Router();
  const adminRouter = new Router();

  app.use(securedRouter.routes());
  app.use(adminRouter.routes());
  app.use(router.routes());
  app.use(router.allowedMethods());

  // public routes
  router.get('/auth/cas', passport.authenticate('cas'));
  router.all('/auth/cas/callback', passport.authenticate('cas', {
    successRedirect: '/',
    failureRedirect: '/a/login?error=cas'
  }));
  router.post('/signout', authController.signOut);

  // secured routes
  securedRouter.use(accessRights.isConnected);
  securedRouter.get('/users', userController.readAll);
  securedRouter.get('/users/me', authController.getCurrentUser);
  securedRouter.get('/challenges', challengeController.getAll);
  securedRouter.get('/challenges/:challenge/result', challengeController.getResult);
  securedRouter.get('/results', challengeController.getResults);

  securedRouter.post('/codes', codeController.saveCode);
  securedRouter.post('/codes/submit', codeController.submit);
  securedRouter.get('/codes', codeController.getChallengeCodes);

  securedRouter.get('/languages', languageController.getSupported);

  // admin routes
  adminRouter.use(accessRights.isConnected, accessRights.isAdmin);
  adminRouter.post('/users/:id/makeadmin', userController.makeAdmin);
};
