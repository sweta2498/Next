import { SET_TILESDATA } from "../types";

const initialState = [];

export default function tilesReducer(state = initialState, action) {
  // console.log(action);
  const payloadData = action?.payload;
  switch (action.type) {
    case SET_TILESDATA:
      return payloadData;
    default:
      return state;
  }
}
