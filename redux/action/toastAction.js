import { SET_TOAST, SET_SERVER_TOAST } from "../types";

export const setToast =
  (payload, timeout = 5000) =>
  (dispatch, getState) => {
    // console.log("=========================", payload);
    dispatch({ type: SET_TOAST, payload });
    setTimeout(
      () =>
        dispatch({
          type: SET_TOAST,
          payload: {
            open: false,
            type: payload?.type,
            message: "",
          },
        }),
      timeout
    );
  };
