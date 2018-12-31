import FluxComponent from "flummox/component";
import actionsFactory from "./actions";
import Flux from "../shared/Flux";

export default function (koaContext) {
  const currentUser = koaContext.state.user ? koaContext.state.user.toJSON() : null;
  const actions = actionsFactory({ koaContext });
  const flux = new Flux(actions, currentUser);
  if (process.env.NODE_ENV === "development") {
    flux.on("dispatch", (dispatch) => {
      const { actionId, ...payload } = dispatch;
      console.log("Flux dispatch:", dispatch.actionId, payload);
    });
  }

  const DATA = flux.dehydrate();

  return {
    DATA
  };
};
