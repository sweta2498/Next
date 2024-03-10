import { SET_CARTDATA } from "../types";

const initialState = {
  cart: "",
};

export default function cartReducer(state = initialState, action) {
  // console.log(action);
  switch (action.type) {
    case SET_CARTDATA:
      return { ...action?.payload };
    default:
      return state;
  }
}
