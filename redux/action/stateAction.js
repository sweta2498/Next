import { SET_STARTSTATE,SET_SCROLLSTATE,SET_MOBILESCROLLSTATE } from "../types";

export const setStateAction = (payload) => (dispatch) => {
  // console.log(payload, "==================");
  dispatch({
    type: SET_STARTSTATE,
    payload: payload,
  });
};

export const setMobileScrollStateAction = (payload) => (dispatch) => {
  // console.log(payload, "==================");
  dispatch({
    type: SET_MOBILESCROLLSTATE,
    payload: payload,
  });
};

export const setScrollStateAction = (payload) => (dispatch) => {
  dispatch({
    type: SET_SCROLLSTATE,
    payload: payload,
  });
};
