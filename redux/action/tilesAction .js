import { SET_TILESDATA } from "../types";

export const setTilesAction = (payload) => (dispatch) => {
  // console.log(payload, "==================");
  dispatch({
    type: SET_TILESDATA,
    payload: payload,
  });
};
