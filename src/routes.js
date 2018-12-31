const Router = require('koa-router');

const accessRights = require('../lib/access-rights');
const config = require('../config/config');

const userController = require('./controllers/user');
const authController = require('./controllers/auth');
const challengeController = require('./controllers/challenge');
const codeController = require('./controllers/code');
const languageController = require('./controllers/language');

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
    successRedirect: config.app.env === 'dev' ? 'http://localhost:8080/' : '/',
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
