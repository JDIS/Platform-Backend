import { Actions } from "flummox";

function authActionsFactory({ ctx }) {
  class AuthActions extends Actions {
    async fetchAuthenticatedUser() {
      if (cxt.state.user) {
        return await Promise.resolve(ctx.state.user.toJSON());
      }
      return Promise.reject("No Authenticated User");
    }

    signOut() {
      ctx.logout();
      ctx.session = null;
    }
  }
  return AuthActions;
};

export default authActionsFactory;
