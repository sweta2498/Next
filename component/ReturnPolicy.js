import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Head from "next/head";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../redux/action/toastAction";
import axiosApi from "../axios_instance";
import { Fragment } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { debounce } from "../common_function/functions";

const ReturnPolicy = () => {
  const [loading, setLoading] = useState(false);
  const storeData = useSelector((state) => state?.common?.store);
  const { t: translate } = useTranslation("returnpolicy");
  const [date, setDate] = useState(new Date());
  const handleChange = (date) => setDate(date);
  const dispatch = useDispatch();
  const [verifyReturnOrder, setVerifyReturnOrder] = useState({});
  const [product, setProduct] = useState([]);
  const [type, setType] = useState({ type: "exchange" });
  const [opened, setOpened] = useState("No");
  const [comments, setComments] = useState("");
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);
  const returnDataRef = useRef(verifyReturnOrder);

  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  const isDateSelectable = (date) => {
    return date >= oneMonthAgo && date <= today;
  };

  // console.log(returnExchangeButton);

  useEffect(
    (e) => {
      if (typeof verifyReturnOrder == "object") {
        if (Object?.keys(verifyReturnOrder)?.length) {
          verifyReturnOrder?.products?.map((item) => {
            setProduct((prev) => [
              ...prev,
              { product_name: item?.product_name, quantity: item?.quantity },
            ]);
          });
        }
      }
    },
    [verifyReturnOrder]
  );

  useEffect(() => {
    returnDataRef.current = verifyReturnOrder;
  }, [verifyReturnOrder]);

  // console.log(product);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      telephone: "",
      order_id: "",
    },

    validationSchema: Yup.object({
      first_name: Yup.string().required(translate("e_fname")),
      last_name: Yup.string().required(translate("e_lname")),
      telephone: Yup.string().required(translate("e_telephone")),
      email: Yup.string().email().required(translate("e_email")),
      order_id: Yup.string().required(translate("e_orderid")),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      // console.log(values);
      /////api call

      axiosApi
        .post(`verify_return_order`, {
          first_name: values?.first_name,
          last_name: values?.last_name,
          order_id: parseInt(values?.order_id),
          telephone: values?.telephone,
          email: values?.email,
          date: date,
        })
        .then((res) => {
          // console.log("========", res);
          setLoading(false);
          setVerifyReturnOrder(res?.data?.result);
          document?.getElementById("verifyReturnOrder")?.scrollIntoView({
            behavior: "smooth",
          });
        })
        .catch((err) => {
          // console.log("=====", err);
          setLoading(false);
          if (err?.response?.data?.message) {
            let errors = err?.response?.data?.message;
            setError(true);
            document.documentElement.scrollTop = 0;
            // document
            // ?.getElementById("error")
            // ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    },
  });

  // console.log(product?.filter());

  const handleCheckedProduct = (e, item) => {
    // console.log("=---------------------",Boolean(product?.find((pt) => pt?.product_name == item?.product_name)));
    // console.log(e?.target?.checked, item);
    if (!e?.target?.checked) {
      setProduct(
        product?.filter((pt) => pt?.product_name != item?.product_name)
      );
    } else {
      setProduct([
        ...product,
        { product_name: item?.product_name, quantity: item?.quantity },
      ]);
    }
  };

  const handleFinalSubmit = () => {
    setLoading(true);
    const data = {
      first_name: formik?.values?.first_name,
      last_name: formik?.values?.last_name,
      telephone: formik?.values?.telephone,
      date: selectedDate,
      type: type?.type,
      comments,
      order_id: verifyReturnOrder?.order_id,
      opened,
      products: product,
    };

    axiosApi
      .post(`return_order`, data)
      .then((res) => {
        // console.log("========", res);
        setLoading(false);
        setReturnSuccess(true);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          let errors = err?.response?.data?.message;
          document.documentElement.scrollTop = 0;
          if (typeof errors == "string") {
            setError(true);
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
  };

  const handleChangeQuantity = (index, value) => {
    let tempData = returnDataRef.current;
    tempData.products[index].quantity = parseInt(value);
    // console.log("==========", tempData);
    setProduct([]);
    setVerifyReturnOrder({ ...tempData });

    // returnDataRef.current = [tempData];
    // debouncedUpdateProduct(tempData);
  };

  const debouncedQunatityChange = useCallback(handleChangeQuantity, []);

  // console.log(formik?.values);

  return (
    <>
      {Boolean(returnSuccess) && (
        <section class="page-content single-wrapper">
          <div class="container">
            <div class="inner-wrap">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">{translate("home")}</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/return">{translate("returnpolicy")}</Link>
                  </li>
                </ol>
              </nav>
              <div id="content">
                {" "}
                <h1>{translate("returnpolicy")}</h1>
                <div class="holder">
                  <p>{translate("thanku_msg")}</p>
                  <p>
                    You will be notified vie e-mail as to the status of your
                    request.
                  </p>

                  <div class="buttons">
                    <div class="right">
                      <Link href="/" class="btn btn-warning text-white">
                        {translate("continue")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="loader-div">
          <div className="text-center">
            <span className="spinner-border text-light"></span>
            <p className="fw-bold text-light fs-5"> </p>
          </div>
        </div>
      )}

      {!Boolean(returnSuccess) && (
        <section className="page-content single-wrapper">
          <div className="container">
            <div className="inner-wrap">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">{translate("home")}</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/return">{translate("returnpolicy")}</Link>
                  </li>
                </ol>
              </nav>

              {Boolean(error) && (
                <div class="alert alert-danger" id={"error"}>
                  No Record found: Invalid Order ID or email
                </div>
              )}

              <div id="content">
                <h1 className="text-center">{translate("returnpolicy")}</h1>
                <div className="holder">
                  {/* <p>{translate('return_form')}</p>  */}
                  {storeData?.store_id == "15" && (
                    <p>
                      Please complete the form below to request an RMA number.
                    </p>
                  )}
                  <form id="return-form">
                    <h2>{translate("orderinfo")}</h2>
                    <div className="content row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label className="required">
                            * {translate("firstname")}:
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="form-control"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.first_name}
                          />

                          {formik?.errors?.first_name &&
                            formik?.touched?.first_name && (
                              <span className="text-danger">
                                {formik?.errors?.first_name}
                              </span>
                            )}
                        </div>

                        <div className="form-group">
                          <label className="required">
                            * {translate("lastname")}:
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="form-control"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.last_name}
                          />

                          {formik?.errors?.last_name &&
                            formik?.touched?.last_name && (
                              <span className="text-danger">
                                {formik?.errors?.last_name}
                              </span>
                            )}
                        </div>

                        <div className="form-group">
                          <label className="required">
                            * {translate("email")}:
                          </label>
                          <input
                            type="text"
                            name="email"
                            className="form-control"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.email}
                          />
                          {formik?.errors?.email && formik?.touched?.email && (
                            <span className="text-danger">
                              {formik?.errors?.email}
                            </span>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="required">
                            * {translate("telephone")}:
                          </label>
                          <input
                            type="text"
                            name="telephone"
                            className="form-control"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.telephone}
                          />

                          {formik?.errors?.telephone &&
                            formik?.touched?.telephone && (
                              <span className="text-danger">
                                {formik?.errors?.telephone}
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label className="required">
                            * {translate("orderid")}:
                          </label>
                          <input
                            type="text"
                            name="order_id"
                            id="order_id"
                            className="form-control"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.order_id}
                          />

                          {formik?.errors?.order_id &&
                            formik?.touched?.order_id && (
                              <span className="text-danger">
                                {formik?.errors?.order_id}
                              </span>
                            )}
                        </div>

                        <div className="form-group">
                          <label className="required">
                            {translate("orderdate")}:
                          </label>

                          {/* <input
                          type="text"
                          name="orderdate"
                          className="form-control date hasDatepicker"
                          id="datepicker"
                          onChange={formik?.handleChange}
                          onBlur={formik?.handleBlur}
                          value={formik?.values?.orderdate}
                        /> */}

                          <DatePicker
                            name="date"
                            id="date"
                            className="form-control date hasDatepicker"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            // onChange={handleChange}
                            minDate={oneMonthAgo}
                            maxDate={today}
                            filterDate={isDateSelectable}
                            showDisabledMonthNavigation
                          />
                          {/* <DatePicker
                            selected={date}
                            name="date"
                            id="date"
                            type="date"
                            onChange={handleChange}
                            className="form-control date hasDatepicker"
                          /> */}

                          {formik?.errors?.date && formik?.touched?.date && (
                            <span className="text-danger">
                              {formik?.errors?.date}
                            </span>
                          )}
                          <span style={{ float: "right" }}>
                            *{translate("return_error")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {Boolean(Object.keys(verifyReturnOrder)?.length) && (
                      <div id={"verifyReturnOrder"}>
                        <h2 className="select-products">
                          {translate("Product Information") +
                            " & " +
                            translate("Reason for Return")}
                        </h2>

                        <div id="return-product" className="select-products">
                          <div className="content">
                            <table
                              style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                borderTop: "1px solid #DDDDDD",
                                borderLeft: "1px solid #DDDDDD",
                                marginBottom: "20px",
                              }}
                            >
                              <thead>
                                <tr>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      backgroundColor: "#EFEFEF",
                                      fontWeight: "bold",
                                      textAlign: "left",
                                      padding: "7px",
                                      color: "#222222",
                                    }}
                                  >
                                    {translate("Product Name")}:
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      backgroundColor: "#EFEFEF",
                                      fontWeight: "bold",
                                      textAlign: "left",
                                      padding: "7px",
                                      color: "#222222",
                                    }}
                                  >
                                    {translate("Model")}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      backgroundColor: "#EFEFEF",
                                      fontWeight: "bold",
                                      textAlign: "right",
                                      padding: "7px",
                                      color: "#222222",
                                    }}
                                  >
                                    {translate("Ordered Quantity")}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      backgroundColor: "#EFEFEF",
                                      fontWeight: "bold",
                                      textAlign: "right",
                                      padding: "7px",
                                      color: "#222222",
                                    }}
                                  >
                                    {translate("Return Quantity")}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      backgroundColor: "#EFEFEF",
                                      fontWeight: "bold",
                                      textAlign: "left",
                                      padding: "7px",
                                      color: "#222222",
                                    }}
                                  ></td>
                                </tr>
                              </thead>
                              <tbody>
                                {/* <tr> */}
                                {verifyReturnOrder?.products?.map((item, i) => (
                                  <tr key={i + "veryfyreturnOrder"}>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        borderRight: "1px solid #DDDDDD",
                                        borderBottom: "1px solid #DDDDDD",
                                        textAlign: "left",
                                        padding: "7px",
                                      }}
                                    >
                                      {item?.product_name} <br />
                                      {/* &nbsp; */}
                                      {typeof item?.option == "object" &&
                                        !Array?.isArray(item?.option) &&
                                        Object.keys(item?.option)?.map(
                                          (ot, i) => (
                                            <Fragment key={i + "otp"}>
                                              &nbsp;
                                              <small>
                                                {" "}
                                                - &nbsp;
                                                {ot + " : " + item?.option[ot]}
                                              </small>
                                              <br />
                                            </Fragment>
                                          )
                                        )}
                                      {/* <small> - path_id: 2:150020</small> */}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        borderRight: "1px solid #DDDDDD",
                                        borderBottom: "1px solid #DDDDDD",
                                        textAlign: "left",
                                        padding: "7px",
                                      }}
                                    >
                                      {item?.model}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        borderRight: "1px solid #DDDDDD",
                                        borderBottom: "1px solid #DDDDDD",
                                        textAlign: "right",
                                        padding: "7px",
                                      }}
                                    >
                                      {item?.quantity}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        borderRight: "1px solid #DDDDDD",
                                        borderBottom: "1px solid #DDDDDD",
                                        textAlign: "right",
                                        padding: "7px",
                                        width: "70px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        name="returns[2]"
                                        value={item?.quantity || ""}
                                        required="required"
                                        id="product_2"
                                        onChange={(e) => {
                                          debouncedQunatityChange(
                                            i,
                                            e?.target?.value
                                          );
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        borderRight: "1px solid #DDDDDD",
                                        borderBottom: "1px solid #DDDDDD",
                                        textAlign: "right",
                                        padding: "7px",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        name="products[]"
                                        value="2"
                                        checked={Boolean(
                                          product?.find(
                                            (pt) =>
                                              pt?.product_name ==
                                              item?.product_name
                                          )
                                        )}
                                        onChange={(e) =>
                                          handleCheckedProduct(e, item)
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="return-detail">
                              <b>{translate("Return/Exchange")}</b>
                              <br />
                              <input
                                type="radio"
                                name="type"
                                // value="1"
                                id="return"
                                checked={
                                  type.type == "retudrn" ? `checked` : null
                                }
                                onChange={(e) => setType({ type: "retudrn" })}
                              />
                              <label htmlFor="return">
                                {translate("Return")}
                              </label>
                              <input
                                type="radio"
                                name="type"
                                // value="0"
                                id="exchange"
                                checked={
                                  type.type == "exchange" ? `checked` : null
                                }
                                onChange={(e) => setType({ type: "exchange" })}
                              />
                              <label htmlFor="exchange">Exchange</label>
                              <br />
                              <br />
                              <div className="return-opened">
                                <b>{translate("Product is opened")}:</b>
                                <br />
                                <input
                                  type="radio"
                                  name="opened"
                                  // value="1"
                                  id="opened"
                                  checked={opened == "Yes" ? `checked` : null}
                                  onChange={(e) => setOpened("Yes")}
                                />
                                <label htmlFor="opened">Yes</label>
                                <input
                                  type="radio"
                                  name="opened"
                                  // value="0"
                                  id="unopened"
                                  checked={opened == "No" ? `checked` : null}
                                  onChange={(e) => setOpened("No")}
                                />
                                <label htmlFor="unopened">No</label>
                                <br />
                                <br />
                                {translate("Faulty or other details")}:
                                <br />
                                <textarea
                                  name="comment"
                                  className="form-control"
                                  cols="150"
                                  rows="6"
                                  onChange={(e) =>
                                    setComments(e?.target?.value)
                                  }
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="content">
                      {storeData?.store_id == "15" ? (
                        <>
                          We allow customers to return their products within a
                          30 day period from the date of purchase. If you wish
                          to exchange the product out, you may do so at no cost.
                          If you wish to return it, your order will be refunded
                          back in full when we receive it back.
                          <div className="mt-2">
                            <b>Holiday Season Return Policy: </b>
                            During the Holiday Season, we extend our return
                            policy on orders placed between Thanksgiving Day and
                            December 25th. Orders placed between that time frame
                            are eligible for a return up until January 25th.
                          </div>
                        </>
                      ) : (
                        <>{translate("return_note")}</>
                      )}
                    </div>
                    <div className="row mt-2">
                      <div className="col-sm-6">
                        <Link href="/login" className="btn btn-default">
                          {translate("back")}
                        </Link>
                      </div>
                      <div className="col-sm-6">
                        <button
                          type="button"
                          value={translate("continue")}
                          disabled={Boolean(loading) ? true : false}
                          onClick={
                            Boolean(Object?.keys(verifyReturnOrder)?.length)
                              ? handleFinalSubmit
                              : formik?.handleSubmit
                          }
                          className="btn btn-primary float-right"
                        >
                          {translate("continue")}
                          {Boolean(loading) && (
                            <span className="wait d-inline-block">
                              &nbsp;&nbsp;
                              <img
                                src="https://d68my205fyswa.cloudfront.net/loading.gif"
                                alt="loading"
                                style={{ marginTop: "-5px" }}
                              />
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ReturnPolicy;
