import { HYDRATE } from "next-redux-wrapper";
import { SET_BASEURL, SET_NAVDATA, SET_STORE } from "../types";

const initialState = {
  store: {},
  navData: {},
  baseUrl : ""
};

export default function commonReducer(state = initialState, action) {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.common };
    case SET_STORE:
      return { ...state, store: action.payload };
    case SET_NAVDATA:
      return { ...state, navData: action.payload };
    case SET_BASEURL:
      return { ...state, baseUrl: action.payload };
    default:
      return state;
  }
}
