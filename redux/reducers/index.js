import { combineReducers } from "redux";
import commonReducer from "./commonReducer";
import cartReducer from "./cartReducer";
import stateReducer, {
  mobileScrollStateReducer,
  scrollStateReducer,
} from "./stateReducer";
import tilesReducer from "./tilesReducer";
import toasterReducer from "./toasterReducer";

export default combineReducers({
  common: commonReducer,
  cart: cartReducer,
  state: stateReducer,
  tiles: tilesReducer,
  scroll: scrollStateReducer,
  mobilescroll: mobileScrollStateReducer,
  toast: toasterReducer,
});
