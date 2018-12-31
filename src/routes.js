var Router = require("koa-router");

var viewsController = require("../src/controllers/views");
var userController = require("../src/controllers/user");
var authController = require("../src/controllers/auth");
var challengeController = require("../src/controllers/challenge");
var codeController = require("../src/controllers/code");
var languageController = require("../src/controllers/language");

var accessRights = require("../lib/access-rights");

module.exports = function (app, passport) {
  // register functions
  var router = new Router();
  var securedRouter = new Router();
  var adminRouter = new Router();

  app.use(securedRouter.routes());
  app.use(adminRouter.routes());
  app.use(router.routes());
  app.use(router.allowedMethods());

  router.get("/auth/cas", passport.authenticate("cas"));
  router.all("/auth/cas/callback", passport.authenticate("cas", {
    successRedirect: "/",
    failureRedirect: "/a/login?error=cas"
  }));
  router.post("/signout", authController.signOut);

  languageController.init()
  .then(challengeController.init)
  .then(codeController.init);

  /******** secured routes ********/
  securedRouter.use(accessRights.isConnected);
  securedRouter.get("/users", userController.readAll);
  securedRouter.get("/users/me", authController.getCurrentUser);
  securedRouter.get("/challenges", challengeController.getAll);
  securedRouter.get("/challenges/:challenge/result", challengeController.getResult);
  securedRouter.get("/results", challengeController.getResults);

  securedRouter.post("/codes", codeController.saveCode);
  securedRouter.post("/codes/submit", codeController.submit);
  securedRouter.get("/codes", codeController.getChallengeCodes);

  securedRouter.get("/languages", languageController.getSupported);

  /******** admin routes ********/
  adminRouter.use(accessRights.isConnected, accessRights.isAdmin);
  adminRouter.post("/users/:id/makeadmin", userController.makeAdmin);

  /******** ui routes ********/
  router.get("/admin", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/a/login");
    } else if (!this.passport.user.meta.isAdmin) {
      this.throw("Vous n'avez pas les droits pour accéder à cette page", 403);
    } else {
      yield viewsController.admin.apply(this);
    }
  });

  router.get(/(|^$)/, async (ctx) => {
    await viewsController.index(ctx)
  });

};
