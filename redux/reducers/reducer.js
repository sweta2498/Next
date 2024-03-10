import { GET_SAMPLE, SAMPLE_ERROR, NAV_DATA, SET_STORE } from "../types";
import { HYDRATE } from "next-redux-wrapper";
const initialState = {
  store: [],
  loading: true,
};

const sampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state,
        ...action.payload.categoryData,
      };
    case SET_STORE:
      return {
        ...state,
        store: action.payload,
      };
    case SAMPLE_ERROR:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default sampleReducer;
