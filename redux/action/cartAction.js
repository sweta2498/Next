import { useRouter } from "next/router";
import axiosApi from "../../axios_instance";
import { SET_CARTDATA } from "../types";
import { setToast } from "./toastAction";

export const setCartAction = (payload, callBackFun) => (dispatch) => {
  if (payload?.cartID || payload?.cartID == "") {
    try {
      axiosApi
        .get(
          `/cart/all${Boolean(payload?.cartID) ? "/" : ""}` + payload?.cartID
        )
        .then((response) => {
          dispatch({
            type: SET_CARTDATA,
            payload: response?.data,
          });

          if (response?.data?.cart_id) {
            if (typeof callBackFun === "function") {
              callBackFun({
                cart_id: response?.data?.cart_id,
                success: true,
              });
            } else {
              dispatch({
                type: SET_CARTDATA,
                payload: response?.data,
              });
            }
          } else {
            dispatch({
              type: SET_CARTDATA,
              payload: response?.data,
            });
          }
        })
        .catch((err) => {
          // console.log(err);
          // console.log(err?.response?.data?.error);
          if (err?.response?.data?.error) {
            let errors = err?.response?.data?.error;
            if (typeof errors == "string") {
              dispatch({
                type: SET_CARTDATA,
                payload: err?.response?.data,
              });
              dispatch(
                setToast({
                  open: true,
                  type: "danger",
                  message: errors,
                })
              );
            }
          }
          if (err?.response?.data?.message) {
            let errors = err?.response?.data?.message;
            // console.log(error);
            if (typeof errors == "string") {
              dispatch({
                type: SET_CARTDATA,
                payload: err?.response?.data,
              });
              dispatch(
                setToast({
                  open: true,
                  type: "danger",
                  message: errors,
                })
              );
            }
          } else {
            dispatch({
              type: SET_CARTDATA,
              payload: err?.response?.data,
            });
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: "There has been an error.",
              })
            );
          }
          if (err?.response?.data?.result === false) {
            dispatch({
              type: SET_CARTDATA,
              payload: err?.response?.data,
            });
          }
        });
    } catch (err) {}
  } else if (payload?.result?.length == 0) {
    dispatch({
      type: SET_CARTDATA,
      payload: "",
    });
  } else if (payload?.result?.length) {
    dispatch({
      type: SET_CARTDATA,
      payload: payload,
    });
  } else if (payload == "") {
    dispatch({
      type: SET_CARTDATA,
      payload: payload,
    });
  }

  // if (payload == undefined) {
  //      dispatch({
  //     type: SET_CARTDATA,
  //     payload: ""
  //   })
  // }
};

export const setCartRemove = () => (dispatch) => {
  dispatch({
    type: SET_CARTREMOVE,
    payload: {},
  });
};

export const setCartUpdate = (payload) => (dispatch) => {
  try {
    axiosApi
      .get("/cart/all/" + payload)
      .then((response) => {
        dispatch({
          type: SET_CARTDATA,
          payload: response?.data,
        });
      })
      .catch((err) => {});
  } catch (err) {}
};
