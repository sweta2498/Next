import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useCallback, useEffect, useState } from "react";
import { wrapper } from "redux/store";
import Header from "./../component/Header/index";
import Head from "next/head";
import Footer from "../component/Footer/Footer";
import {
  setSessionAxios,
  setSessionRes,
} from "../common_function/cookie_helper";
import axiosApi from "../axios_instance";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { setToast } from "../redux/action/toastAction";
import Link from "next/link";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, res, req }) => {
      const language = store?.getState()?.common?.store?.language?.code;

      try {
        const common_headers = await setSessionAxios(req);
        const galleyData = await axiosApi.post(
          "get_gallery_data",
          { token: query?.token },
          {
            headers: {
              ...common_headers,
            },
          }
        );
        setSessionRes(galleyData?.headers, res);

        return {
          props: {
            galleyData: galleyData?.data?.result || {},
            ...(await serverSideTranslations("en", [
              "home",
              "footerpage",
              "store_credit",
              "category",
            ])),
          },
        };
      } catch (e) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
          props: {
            ...(await serverSideTranslations("en", [
              "home",
              "footerpage",
              "store_credit",
              "category",
            ])),
          },
        };
      }
    }
);

const StoreCredit = ({ categoryData = [], galleyData = {} }) => {
  const storeData = useSelector((state) => state?.common?.store);
  const router = useRouter();
  const dispatch = useDispatch();
  const productData = galleyData?.products;
  const { t: translate } = useTranslation("store_credit");
  const [customerUpload, setCustomerUpload] = useState(
    galleyData?.customer_upload
  );
  const [file, setFile] = useState({});
  const [loader, setLoader] = useState(false);
  const getInitialState = useCallback(() => {
    let data = {};
    productData?.map((x, i) => {
      data = {
        ...data,
        [i]: {
          order_product_id: x?._id,
          product_id: x?.product_id,
          product_title: Boolean(Object.keys(x?.tiles_slug)?.length)
            ? Boolean(x?.tiles_slug?.tiles_slug)
              ? x?.tiles_slug?.tiles_name +
                " - " +
                x?.product_slug?.edition?.edition
              : x?.product_name
            : x?.slugs?.category_name +
              ` ${translate("for")} ` +
              x?.slugs?.year +
              " " +
              x?.slugs?.make_name +
              " " +
              x?.slugs?.model_name +
              (Boolean(x?.slugs?.body_name) ? " " + x?.slugs?.body_name : "") +
              " - " +
              x?.product_slug?.edition?.edition,
          comment: "",
        },
      };
    });
    return data;
  }, []);
  const [state, setState] = useState({ ...getInitialState() });
  const [required, setRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (Boolean(customerUpload?.length)) {
      setRequired(false);
    } else {
      setRequired(true);
    }
  }, []);

  const handleCommentChange = (e, i) => {
    let copyState = { ...state };
    copyState[i].comment = e?.target?.value ? e?.target?.value : "";
    setState({ ...copyState });
  };

  const handleFileChange = (e, i) => {
    setFile({ ...file, [i]: e?.target?.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    let copyInitialState = { ...state };
    if (Boolean(Object.values(copyInitialState)?.length)) {
      Object.values(copyInitialState).map((x, i) => {
        if (copyInitialState[i].comment == "") {
          delete copyInitialState[i]?.comment;
        }
      });
      setState({ ...copyInitialState });
    }

    if (Boolean(Object.keys(file)?.length)) {
      if (Boolean(customerUpload?.length)) {
        for (let key in copyInitialState) {
          if (Boolean(file.hasOwnProperty(key) == false)) {
            delete copyInitialState[key];
          }
        }
        setState(copyInitialState);
      }

      let formData = new FormData();
      formData.append("token", router?.query?.token);
      formData.append("product_data", JSON.stringify(copyInitialState));
      for (let key in file) {
        formData.append(`product${key}`, file[key]);
      }
      axiosApi
        .post("add_gallery", formData)
        .then((res) => {
          // console.log(res, "res");
          setFile({});
          setState({ ...getInitialState() });
          setErrorMessage("");
          setCustomerUpload(res?.data?.result?.customer_upload);
          setLoader(false);
          let fileInput = document.querySelectorAll('[type="file"]');
          fileInput.forEach((input) => {
            input.value = "";
          });
          document
            ?.getElementById("scroll")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        })
        .catch((err) => {
          setLoader(false);
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
                message: translate("There has been an error."),
              })
            );
          }
        });
    } else {
      setErrorMessage(translate("error_message"));
      setLoader(false);
      document
        ?.getElementById("scroll")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head>
        <title>Store Credit</title>
      </Head>
      <Header categoryData={categoryData} />
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap">
            <div className="contact-center" id="scroll">
              <div className="row">
                <div className="col-12 m-auto pt-5">
                  <form
                    action=""
                    onSubmit={handleSubmit}
                    className="row pb-5 px-3"
                  >
                    {galleyData?.store_credit_email_sent == 2 && (
                      <div>
                        <div className="alert alert-success">
                          {translate("success_message")}
                        </div>
                      </div>
                    )}
                    {Boolean(errorMessage) && (
                      <div className="col-12">
                        <div
                          className="col-md-8 col-lg-6 ml-auto mr-auto alert response alert-danger"
                          id="error"
                        >
                          {errorMessage}
                        </div>
                      </div>
                    )}
                    {productData?.map((item, index) => {
                      return (
                        <div
                          className="col-md-6 mx-auto"
                          key={index + item?._id}
                        >
                          <div>
                            {Boolean(
                              galleyData?.store_credit_email_sent == 1
                            ) &&
                              (customerUpload?.filter(
                                (x) => x?.product_id == item?.product_id
                              )?.length ? (
                                <div className="alert alert-info" role="alert">
                                  {translate("pending_message")}
                                </div>
                              ) : (
                                <div
                                  className="alert alert-primary"
                                  role="alert"
                                >
                                  {translate("upload_message")}
                                </div>
                              ))}
                            <p>
                              {translate("product_name")}:{" "}
                              <strong>
                                {Boolean(
                                  Object.keys(item?.tiles_slug)?.length
                                ) ? (
                                  <>
                                    {Boolean(item?.tiles_slug?.tiles_slug)
                                      ? item?.tiles_slug?.tiles_name +
                                        " - " +
                                        item?.product_slug?.edition?.edition
                                      : item?.product_name}
                                  </>
                                ) : (
                                  <>
                                    {item?.slugs?.category_name +
                                      ` ${translate("for")} ` +
                                      item?.slugs?.year +
                                      " " +
                                      item?.slugs?.make_name +
                                      " " +
                                      item?.slugs?.model_name}
                                    {Boolean(item?.slugs?.body_name)
                                      ? " " + item?.slugs?.body_name
                                      : ""}
                                    {" - " +
                                      item?.product_slug?.edition?.edition}
                                  </>
                                )}
                              </strong>
                            </p>
                          </div>
                          <div className="pb-3">
                            <label htmlFor="" className="w-100">
                              {translate("upload_image")}:
                            </label>
                            <input
                              type="file"
                              name="file"
                              className="w-100 border p-2 rounded-1"
                              onChange={(e) => handleFileChange(e, index)}
                              required={required}
                            />
                            <div id="emailHelp" className="form-text">
                              <strong>{translate("file_accepted")}: </strong>
                              JPEG, JPG, PNG, GIF, WEBP
                            </div>
                          </div>
                          <div className="pb-3">
                            <label htmlFor="" className="w-100">
                              {translate("feedback_comments")}:
                            </label>
                            <textarea
                              value={state?.[index]?.comment || ""}
                              className="form-control"
                              style={{ height: "80px" }}
                              cols="30"
                              rows="10"
                              onChange={(e) => handleCommentChange(e, index)}
                            ></textarea>
                          </div>
                        </div>
                      );
                    })}
                    <div className="text-center">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={Boolean(loader) ? true : false}
                      >
                        {translate("submit")}
                        {Boolean(loader) ? (
                          <i className="ms-1 spinner spinner-border spinner-border-sm"></i>
                        ) : (
                          <></>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  className="col-md-8 col-lg-6 mt-sm-5 mt-md-4 ml-auto mr-auto mt-4 col-12 border rounded-2 p-2"
                  style={{ maxHeight: "1000px", overflow: "auto" }}
                >
                  <p className="text-center">{translate("upload_logs")}</p>
                  {Boolean(customerUpload?.length) ? (
                    customerUpload?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="border p-2 rounded-3 mb-3"
                          style={{
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                          }}
                        >
                          <p>
                            <strong>{galleyData?.name} :- </strong>
                            {item?.comment}
                          </p>
                          <div>
                            <Link href={storeData?.image_path + item?.image} target="_blank">
                              <img
                                src={
                                  storeData?.image_path +
                                  "fit-in/150x150/" +
                                  item?.image
                                }
                                style={{ maxWidth: "150px" }}
                                alt=""
                              />
                            </Link>
                          </div>
                          <div
                            className="form-text pt-2"
                            style={{ fontSize: "12px" }}
                          >
                            {moment(item?.date).format("YYYY-MM-DD h:mm A")}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center">{translate("no_logs_found")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default StoreCredit;
