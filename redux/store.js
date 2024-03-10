import { applyMiddleware, createStore, compose } from "redux";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducers/index";
import thunk from "redux-thunk";
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const initalState = {};
const middleware = [thunk];

export const store = createStore(
  rootReducer,
  initalState,
  composeEnhancers(applyMiddleware(...middleware))
);
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
