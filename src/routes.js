const Router = require('koa-router');

const accessRights = require('../lib/access-rights');

const authController = require('./controllers/auth');
const categoryController = require('./controllers/category');
const challengeController = require('./controllers/challenge');
const codeController = require('./controllers/code');
const languageController = require('./controllers/language');
const resultController = require('./controllers/result');
const testController = require('./controllers/test');
const userController = require('./controllers/user');

const API_PREFIX = '/api';

module.exports = function (app, passport) {
  // register routers
  const router = new Router({ prefix: API_PREFIX });
  const securedRouter = new Router({ prefix: API_PREFIX });
  const adminRouter = new Router({ prefix: API_PREFIX });

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
  securedRouter.get('/users', userController.getAll);
  securedRouter.get('/users/me', authController.getCurrentUser);

  securedRouter.get('/challenges', challengeController.getAll);
  securedRouter.get('/challenges/:id', challengeController.get);
  securedRouter.get('/challenges/:id/result', resultController.get);
  securedRouter.get('/challenges/:id/tests', testController.getAll);
  securedRouter.get('/results', resultController.getAll);

  securedRouter.get('/codes', codeController.getChallengeCodes);
  securedRouter.post('/codes', codeController.saveCode);
  securedRouter.post('/codes/submit', codeController.submit);

  securedRouter.get('/languages', languageController.getSupported);

  securedRouter.get('/categories', categoryController.getAll);

  // admin routes
  adminRouter.use(accessRights.isConnected, accessRights.isAdmin);
  adminRouter.post('/users/:id/makeadmin', userController.makeAdmin);

  adminRouter.post('/languages/seed', languageController.seed);
  adminRouter.post('/categories/seed', categoryController.seed);
  adminRouter.post('/challenges/seed', challengeController.seed);

  adminRouter.post('/challenges', challengeController.create);
  adminRouter.put('/challenges/:id', challengeController.update);
  adminRouter.delete('/challenges/:id', challengeController.remove);
  adminRouter.post('/challenges/:id/tests', testController.createAll);
  adminRouter.put('/challenges/:id/tests', testController.updateAll);
};
