import { SET_TOAST } from "../types";

const initialState = {
  open: false,
  type: "danger",
  message: "",
};

export default function toasterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOAST:
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
}
