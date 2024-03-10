import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import {
  setSessionAxios,
  setSessionRes,
} from "../common_function/cookie_helper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import Header from "../component/Header/index";
import axiosApi from "../axios_instance";
import { useDispatch, useSelector } from "react-redux";
import { setCartAction } from "../redux/action/cartAction";
import Head from "next/head";
import ThankYouTag from "../component/ThankYouTag";
import { env } from "process";
import Footer from "../component/Footer/Footer";
import { setToast } from "../redux/action/toastAction";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;

    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "successpage",
          "footerpage",
          "category",
        ])),
      },
    };
  }
);

const CheckoutSuccess = ({ categoryData = [], data }) => {
  const storeData = useSelector((state) => state?.common?.store);
  // console.log(storeData);
  const dispatch = useDispatch();

  const router = useRouter();
  const [dataOrder, setOrderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState(true);

  const { t: translate } = useTranslation("successpage");

  useEffect(() => {
    setLoading(true);
    checkoutSuccess();
  }, []);

  // useEffect(() => {
  //   return () => {
  //     // console.log("back");
  //     router?.push(
  //       `/cart?cart_id=${
  //         categoryData?.cart_id !== undefined ? categoryData?.cart_id : ""
  //       }`
  //     );
  //   };
  // }, []);

  const paymentData = async () => {
    // if (!router.isReady) return;
    if (router?.query?.PayerID && router?.query?.paymentId) {
      try {
        const response = await axios?.get(
          `${url}/success?PayerID=${router?.query?.PayerID}&paymentId=${router?.query?.paymentId}`,
          {
            withCredentials: true,
          }
        );
        setOrderData(response?.data?.result?.data);
      } catch (error) {}
    }
  };

  const checkoutSuccess = () => {
    axiosApi
      .get(router?.asPath)
      .then((res) => {
        // console.log("====================", res);
        setSuccessData(res?.data?.result);
        setOrderData(res?.data?.result?.data || {});
        setLoading(false);
        dispatch(setCartAction(""));
      })
      .catch((err) => {
        console.log(err);
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
        } else if (typeof err?.message == "string") {
          dispatch(
            setToast({
              open: true,
              type: "danger",
              message: err?.message,
            })
          );
        } else {
          dispatch(
            setToast({
              open: true,
              type: "danger",
              message: translate("There has been an error."),
            })
          );
        }
        // console.log(err?.response?.data?.redirect_urls);
        if (err?.response?.data?.redirect_urls) {
          router?.push(err?.response?.data?.redirect_urls);
        }
        if (err?.response?.data?.redirect_url) {
          router?.push(err?.response?.data?.redirect_url);
        }
        // console.log(err);

        setLoading(false);
      });
  };

  // console.log(dataOrder);

  return (
    <>
      <Head>
        <title>{translate("order_text")}</title>
      </Head>

      {Boolean(Object.keys(dataOrder)?.length) &&
        (process?.env?.NEXT_PUBLIC_ENV == "production" ||
          (router?.isReady && router?.query?.hasOwnProperty("run_tags"))) && (
          <ThankYouTag data={dataOrder} />
        )}

      <Header categoryData={categoryData} />
      {loading ? (
        // <div style={{padding : "300px 0"}}>
        //   <div className="loader-div text-center" >
        //     <img
        //       src={"https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"}
        //       alt="Loading.."
        //       id="page-loading"
        //       height={"30px"}
        //       width={"30px"}
        //     />
        //   </div>
        // </div>
        <div className="page-content single-wrapper">
          <div className="container">
            <div className="inner-wrap" style={{ backgroundColor: "#fff" }}>
              <div className="">
                <h1 className="placeholder col-12"></h1>
              </div>
              <div
                style={{ width: "680px", margin: "0 auto" }}
                className="receipt-table py-3"
              >
                <div className="placeholder-glow pb-2">
                  <h4 className="placeholder col-12"></h4>
                </div>
                <div className="card placeholder-glow mb-4">
                  <div className="card-header">
                    <h5 className="placeholder col-12 mb-1"></h5>
                  </div>
                  <div className="card-body row">
                    <div className="col">
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                    </div>
                    <div className="col">
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                    </div>
                  </div>
                </div>

                <div className="card placeholder-glow mb-4 overflow-hidden">
                  <div className="card-header row">
                    <div className="col">
                      <h5 className="placeholder col-12 mb-1"></h5>
                    </div>
                    <div className="col">
                      <h5 className="placeholder col-12 mb-1"></h5>
                    </div>
                  </div>
                  <div className="card-body row">
                    <div className="col">
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                    </div>
                    <div className="col">
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                      <span className="placeholder col-12 mb-3"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {Boolean(Object.keys(dataOrder)?.length) ? (
            <section className="page-content single-wrapper">
              <div className="container">
                <div className="inner-wrap" style={{ backgroundColor: "#fff" }}>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="/">{translate("home")}</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/cart">{translate("shopping_cart")}</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/checkout">{translate("checkout")}</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/checkout-success">
                          {translate("success")}
                        </Link>
                      </li>
                    </ol>
                  </nav>

                  <div id="content">
                    <h1>{translate("order_text")}</h1>
                    <div className="holder">
                      <div style={{ fontsize: "14px", color: "#000000" }}>
                        <div
                          style={{ width: "680px", margin: "0 auto" }}
                          className="receipt-table"
                        >
                          <p
                            style={{
                              marginTop: "0px",
                              marginBottom: "20px",
                              fontWeight: "bold",
                              fontSize: "14px",
                              fontFamily: "Arial, Helvetica, sans-serif",
                            }}
                          >
                            {storeData?.language?.code == "en" ? (
                              <>
                                Thank you for your interest in{" "}
                                {storeData?.store_name} products. A tracking
                                number will be emailed to you once it has been
                                generated.
                              </>
                            ) : (
                              <>{translate("success_thanks_message")}</>
                            )}
                          </p>
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
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                  }}
                                  colSpan="2"
                                >
                                  {translate("order_details")}
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    textAlign: "left",
                                    padding: "7px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                  }}
                                >
                                  <b>{translate("order_id")}:</b>&nbsp;
                                  {dataOrder?.order_id}
                                  <br />
                                  <b>{translate("date_added")}:</b>&nbsp;
                                  {dataOrder?.date}
                                  <br />
                                  <b>{translate("payment_method")}:</b>&nbsp;
                                  {dataOrder?.payment_method}
                                  <br />
                                  <b>{translate("delivery_date")}:</b>&nbsp;
                                  {dataOrder?.delivery_date}
                                  <br />
                                </td>
                                {
                                  // dataOrder?.billing_address?.map((item) => (
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "left",
                                      padding: "7px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                    }}
                                  >
                                    <b>{translate("email")}:</b>&nbsp;
                                    {dataOrder?.billing_address?.email}
                                    <br />
                                    <b>{translate("telephone")}:</b>&nbsp;
                                    {dataOrder?.billing_address?.phone}
                                    <br />
                                  </td>
                                  // ))
                                }
                              </tr>
                            </tbody>
                          </table>
                          {dataOrder?.payment_method == "CHEQUE" ? (
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
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      backgroundColor: "#EFEFEF",
                                      fontWeight: "bold",
                                      textAlign: "left",
                                      padding: "7px",
                                      color: "#222222",
                                    }}
                                  >
                                    {translate("instructions")}
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "left",
                                      padding: "7px",
                                    }}
                                  >
                                    <b>Make Payable To: </b>
                                    <br />
                                    {storeData?.payable_to}
                                    <br />
                                    <br />
                                    <b>Send To: </b>
                                    <br />
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: storeData?.address,
                                      }}
                                    ></span>
                                    {/* 4000 Greenbriar Dr
                                                                    <br />
                                                                    Ste 200
                                                                    <br />
                                                                    Stafford, TX 77477 */}
                                    <br />
                                    <br />
                                    Your order will not ship until we receive
                                    payment.
                                    <br />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <></>
                          )}
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
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    backgroundColor: "#EFEFEF",
                                    fontWeight: "bold",
                                    textAlign: "left",
                                    padding: "7px",
                                    color: "#222222",
                                  }}
                                >
                                  {translate("billing_address")}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    backgroundColor: "#EFEFEF",
                                    fontWeight: "bold",
                                    textAlign: "left",
                                    padding: "7px",
                                    color: "#222222",
                                  }}
                                >
                                  {translate("shipping_address")}
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    textAlign: "left",
                                    padding: "7px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                  }}
                                >
                                  {dataOrder?.billing_address && (
                                    <>
                                      {dataOrder?.billing_address?.first_name}{" "}
                                      {dataOrder?.billing_address?.last_name}
                                      <br />
                                      {dataOrder?.billing_address
                                        ?.company_name && (
                                        <>
                                          {
                                            dataOrder?.billing_address
                                              ?.company_name
                                          }{" "}
                                          <br />
                                        </>
                                      )}
                                      {
                                        dataOrder?.billing_address?.address
                                          ?.address1
                                      }
                                      <br />
                                      {dataOrder?.billing_address?.address
                                        ?.address2 && (
                                        <>
                                          {
                                            dataOrder?.billing_address?.address
                                              ?.address2
                                          }{" "}
                                          <br />
                                        </>
                                      )}
                                      {dataOrder?.billing_address?.city},{" "}
                                      {dataOrder?.billing_address?.state}{" "}
                                      {dataOrder?.billing_address?.postal_code}
                                      <br />
                                      {dataOrder?.billing_address?.country}
                                    </>
                                  )}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    textAlign: "left",
                                    padding: "7px",
                                  }}
                                >
                                  {
                                    dataOrder?.shipping_address && (
                                      <>
                                        {
                                          dataOrder?.shipping_address
                                            ?.first_name
                                        }{" "}
                                        {dataOrder?.shipping_address?.last_name}
                                        <br />
                                        {dataOrder?.shipping_address
                                          ?.company_name && (
                                          <>
                                            {
                                              dataOrder?.shipping_address
                                                ?.company_name
                                            }{" "}
                                            <br />
                                          </>
                                        )}
                                        {
                                          dataOrder?.shipping_address?.address
                                            ?.address1
                                        }
                                        <br />
                                        {dataOrder?.shipping_address?.address
                                          ?.address2 && (
                                          <>
                                            {
                                              dataOrder?.shipping_address
                                                ?.address?.address2
                                            }{" "}
                                            <br />
                                          </>
                                        )}
                                        {dataOrder?.shipping_address?.city},{" "}
                                        {dataOrder?.shipping_address?.state}{" "}
                                        {
                                          dataOrder?.shipping_address
                                            ?.postal_code
                                        }
                                        <br />
                                        {dataOrder?.shipping_address?.country}
                                      </>
                                    )
                                    // ))
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </table>
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
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    backgroundColor: "#EFEFEF",
                                    fontWeight: "bold",
                                    textAlign: "left",
                                    padding: "7px",
                                    color: "#222222",
                                  }}
                                >
                                  {translate("Product")}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    backgroundColor: "#EFEFEF",
                                    fontWeight: "bold",
                                    textAlign: "left",
                                    padding: "7px",
                                    color: "#222222",
                                  }}
                                >
                                  {translate("model")}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    backgroundColor: "#EFEFEF",
                                    fontWeight: "bold",
                                    textAlign: "right",
                                    padding: "7px",
                                    color: "#222222",
                                  }}
                                >
                                  {translate("quantity")}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    backgroundColor: "#EFEFEF",
                                    fontWeight: "bold",
                                    textAlign: "right",
                                    padding: "7px",
                                    color: "#222222",
                                  }}
                                >
                                  {translate("price")}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    borderRight: "1px solid #DDDDDD",
                                    borderBottom: "1px solid #DDDDDD",
                                    backgroundColor: "#EFEFEF",
                                    fontWeight: "bold",
                                    textAlign: "right",
                                    padding: "7px",
                                    color: "#222222",
                                  }}
                                >
                                  {translate("total")}
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              {dataOrder?.products?.map((item) => (
                                <tr key={item?._id + "success_order"}>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "left",
                                      padding: "7px",
                                    }}
                                  >
                                    {item?.product_name}
                                    <br />
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
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
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
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "right",
                                      padding: "7px",
                                    }}
                                  >
                                    {item?.quantity || 0}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "right",
                                      padding: "7px",
                                    }}
                                  >
                                    {item?.price || 0}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "right",
                                      padding: "7px",
                                    }}
                                  >
                                    {item?.total || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              {dataOrder?.total?.map((item, i) => (
                                <tr key={i + "data_totals_values"}>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "right",
                                      padding: "7px",
                                      fontWeight: "bold",
                                    }}
                                    colSpan="4"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        item?.key == "shipping"
                                          ? item?.text?.replace(
                                              " - ",
                                              " <br/> - "
                                            ) + ":"
                                          : item?.text + ":",
                                    }}
                                  ></td>
                                  <td
                                    style={{
                                      fontSize: "12px",
                                      fontFamily:
                                        "Arial, Helvetica, sans-serif",
                                      borderRight: "1px solid #DDDDDD",
                                      borderBottom: "1px solid #DDDDDD",
                                      textAlign: "right",
                                      padding: "7px",
                                    }}
                                  >
                                    {item?.value_text || 0}
                                  </td>
                                </tr>
                              ))}
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      <p>{translate("success_msg1")}</p>
                      {storeData?.store_id != 15 && (
                        <>
                          <p>
                            {translate("success_msg3") + " "}
                            <Link href="/contact">
                              {translate("store_owner")}
                            </Link>
                            .
                          </p>
                          {storeData?.store_id == "50" && (
                            <p>
                              Uw vraag kunt u ook stellen door op uw
                              bestelbevestiging te reageren.
                            </p>
                          )}
                        </>
                      )}
                      <p>{translate("success_msg2")}</p>

                      <div className="buttons">
                        <div className="right">
                          <Link href="/" className="btn btn-warning text-white">
                            {translate("continue_shopping")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="page-content single-wrapper">
              <div className="container">
                <div className="inner-wrap" style={{ backgroundColor: "#fff" }}>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="/">{translate("home")}</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/cart">{translate("shopping_cart")}</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/checkout">{translate("checkout")}</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/checkout-success">
                          {translate("success")}
                        </Link>
                      </li>
                    </ol>
                  </nav>

                  <div id="content">
                    <h1>{translate("order_text")}</h1>
                    <div className="holder">
                      <p>{translate("success_msg1")}</p>
                      {storeData?.store_id != 15 && (
                        <>
                          <p>
                            {translate("success_msg3") + " "}
                            <Link href="/contact">
                              {translate("store_owner")}
                            </Link>
                            .
                          </p>
                          {storeData?.store_id == "50" && (
                            <p>
                              Uw vraag kunt u ook stellen door op uw
                              bestelbevestiging te reageren.
                            </p>
                          )}
                        </>
                      )}
                      <p>{translate("success_msg2")}</p>
                      <div className="buttons">
                        <div className="right">
                          <Link href="/" className="btn btn-warning text-white">
                            {translate("continue_shopping")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
      <Footer />
    </>
  );
};

export default CheckoutSuccess;
