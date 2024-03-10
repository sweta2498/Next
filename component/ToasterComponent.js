import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_TOAST } from "../redux/types";

const ToasterComponent = () => {
  const toaster = useSelector((state) => state?.toast);
  const dispatch = useDispatch();
  return (
    <>
      {toaster?.open && (
        <div
          className="toast-container top-0 end-0 position-fixed m-3"
          data-original-class="toast-container"
        >
          <div
            className={`toast fade align-items-center text-bg-${
              toaster?.type ? toaster?.type : "danger"
            } show`}
            role="alert"
            data-bs-autohide="true"
            data-bs-delay="3000"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">{toaster?.message}</div>
              <button
                // style={{marginRight:'0.5rem'}}
                type="button"
                className="btn-close me2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() =>
                  dispatch({
                    type: SET_TOAST,
                    payload: {
                      open: false,
                      type: toaster?.type || "danger",
                      message: "",
                    },
                  })
                }
              ></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToasterComponent;
