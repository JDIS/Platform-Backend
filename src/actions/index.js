import authActionsFactory from "./AuthActions";

export default context => ({
  AuthActions: authActionsFactory(context)
});
