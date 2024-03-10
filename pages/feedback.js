import React, { useEffect, useState } from "react";
import Header from "./../component/Header/index";
import Head from "next/head";
import Footer from "../component/Footer/Footer";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axiosApi from "../axios_instance";
import { useRouter } from "next/router";
import { setToast } from "../redux/action/toastAction";
import { useDispatch } from "react-redux";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async ({ context, query }) => {
    const language = store?.getState()?.common?.store?.language?.code;
    if (Boolean(query?.order_id && query?.name)) {
      return {
        props: {
          ...(await serverSideTranslations(language || "en", [
            "home",
            "footerpage",
            "category",
          ])),
        },
      };
    }
    else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
        props: {
          ...(await serverSideTranslations(language || "en", [
            "home",
            "footerpage",
            "category",
          ])),
        },
      };
    }
  }
);

const Feedback = ({ categoryData = [] }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [feedbackValue, setFeedbackValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const feedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackValue != "") {
      axiosApi
        .post("feedback", { order_id: router?.query?.order_id || "", name: router?.query?.name || "", feedback: feedbackValue })
        .then((res) => {
          setFeedbackValue("");
          setSuccessMessage("Thank you for your feedback.");
          document?.getElementById("feedback")?.scrollIntoView({ behavior: "smooth", block: "start" });
        })
        .catch((err) => {
          if (err?.response?.data?.message) {
            let errors = err?.response?.data?.message;
            if (typeof errors == "string") {
              dispatch(
                setToast({
                  open: true,
                  type: "danger",
                  message: errors,
                })
              );
            }
          } else {
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: "There has been an error.",
              })
            );
          }
        });
    }
  };

  return (
    <>
      <Head>
        <title>Feedback</title>
      </Head>
      <Header categoryData={categoryData} />
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap" id="feedback">
            {
              Boolean(successMessage) && (<div class="alert alert-success text-center" role="alert">
                {successMessage}
              </div>)
            }
            <h1 className="head text-center">Feedback</h1>
            <div className="holder">
              <form action="" onSubmit={feedbackSubmit}>
                <div className="contact-center">
                  <div className="row">
                    <div className="col-md-6 m-auto">
                      <div className="contact-page">
                        <div className="full-input message-area mt-5">
                          <div className="input-inr form-group">
                            <h2>Please tell us your concern:</h2>
                            <textarea
                              placeholder="Feedback"
                              name="feedback"
                              className="form-control"
                              style={{ height: "140px" }}
                              value={feedbackValue || ""}
                              onChange={(e) =>
                                setFeedbackValue(e?.target?.value)
                              }
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="cntc-btm float-right">
                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Feedback;
