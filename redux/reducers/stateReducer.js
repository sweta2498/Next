import { SET_STARTSTATE,SET_SCROLLSTATE,SET_MOBILESCROLLSTATE } from "../types";

const initialState = {
  start: false,
};
const initialState1 = {
  scrollState: false,
};

export default function stateReducer(state = initialState, action) {
  // console.log(action);
  switch (action.type) {
    case SET_STARTSTATE:
      return { ...action?.payload };
    default:
      return state;
  }
}

export function mobileScrollStateReducer(state = initialState1, action) {
  // console.log(action);
  switch (action.type) {
    case SET_MOBILESCROLLSTATE:
      return { ...action?.payload };
    default:
      return state;
  }
}

export function scrollStateReducer(state = initialState1, action) {
  // console.log(action);
  switch (action.type) {
    case SET_SCROLLSTATE:
      return { ...action?.payload };
    default:
      return state;
  }
}
