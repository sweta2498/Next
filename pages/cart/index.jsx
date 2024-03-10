import React, { useCallback, useRef } from "react";
import Header from "../../component/Header/index";
import Footer from "../../component/Footer/Footer";
import CartBanner from "../../component/cartbanner/CartBanner";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import axiosApi from "../../axios_instance";
import { useDispatch, useSelector } from "react-redux";
import { setCartAction } from "../../redux/action/cartAction";
import Link from "next/link";
import Head from "next/head";
import { debounce } from "../../common_function/functions";
import { setToast } from "../../redux/action/toastAction";
import LazyLoad from "react-lazy-load";
let abortController;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context }) => {
      const language = store?.getState()?.common?.store?.language?.code;
      return {
        props: {
          ...(await serverSideTranslations(language || "en", [
            "home",
            "category",
            "footerpage",
            "cartpage",
            "checkoutpage",
          ])),
        },
      };
    }
);

const Cart = ({ categoryData = [] }) => {
  const cartReduxData = useSelector((state) => state?.cart);
  const storeData = useSelector((state) => state?.common?.store);
  const [cartData, setCartData] = useState(cartReduxData?.result || []);
  const [cartTotalsData, setCartTotalsData] = useState(
    cartReduxData?.carts_total || []
  );
  const [selectDate, setSelectDate] = useState(
    cartReduxData?.delivery_date || {}
  );

  const [coupon_code, setCouponCode] = useState(cartReduxData?.coupon || "");
  const [couponRespose, setCouponResponse] = useState("");
  const [error, setError] = useState("");
  const [cartError, setCartError] = useState("");
  const [deliveryDate, setDeliveryDate] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [disable, setDisable] = useState(false);

  const [chooseDate, setChooseDate] = useState({});
  const [deliveryDateError, setDeliveryDateError] = useState("");
  const [cartTotalsLoader, setCartTotalsLoader] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updateLoader, setUpdateLoader] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const cartDataRef = useRef(cartData);
  const cartRef = useRef();
  const cart_id = router?.query?.cart_id;
  const { t: translate } = useTranslation("cartpage");

  //   useEffect(() => {
  // setLoading(false)
  //   }, [router?.isReady]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setUpdateLoader(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [updateLoader]);

  useEffect(() => {
    if (cartReduxData?.status === false && cartReduxData?.result === false) {
      setLoading(false);
    }
  }, [cartReduxData]);

  useEffect(() => {
    if (router?.asPath == "/cart") {
      dispatch(setCartAction({ cartID: "" }));
      setLoading(false);
    }
  }, [router?.isReady]);

  useEffect(
    (e) => {
      if (cart_id === "") {
        setLoading(false);
      }
    },
    [router?.isReady]
  );

  useEffect(
    (e) => {
      if (Boolean(Object.keys(cartReduxData)?.length == 3))
        if (!cartReduxData?.status) {
          setLoading(false);
        }
    },
    [cartReduxData]
  );

  useEffect(() => {
    if (cartReduxData?.cart === "") {
      dispatch(
        setCartAction({ cartID: cart_id }, (res) => {
          if (res.success) {
            if (res?.cart_id != router?.query?.cart_id) {
              router?.push("cart?cart_id=" + res?.cart_id);
              cartRef.current = res?.cart_id;
            }
          }
        })
      );
      // setLoading(false)
    } else if (Boolean(cartReduxData?.error)) {
      setLoading(false);
    } else if (Boolean(cartReduxData?.result == false)) {
      setLoading(false);
    } else if (!Boolean(cartReduxData?.status)) {
      setLoading(false);
    } else {
      setLoading(false);
      dispatch(setCartAction({ cartID: "" }));
    }
    setCartTotalsData(cartReduxData?.carts_total);
    //  return dispatch(setCartAction({ cartID: cart_id }))
  }, []);

  useEffect(() => {
    if (Boolean(cartRef?.current)) {
      dispatch(setCartAction({ cartID: cartRef.current }));
      setLoading(false);
      deliveryDateFun();
    }
  }, [Boolean(cartRef?.current)]);

  useEffect(() => {
    // if(!cartReduxData?.result){
    //   setLoading(false)
    // }
    setCartData(cartReduxData?.result);
    cartDataRef.current = cartReduxData?.result;
    setCartTotalsData(cartReduxData?.carts_total);
    setSelectDate(cartReduxData?.delivery_date);
    setCouponCode(cartReduxData?.coupon);
    // setLoading(false);
    // deliveryDateFun();
  }, [cartReduxData]);

  useEffect(() => {
    if (cartReduxData?.result?.length) {
      setLoading(false);
      setCartTotalsLoader(false);
    }
  }, [cartData]);

  useEffect(() => {
    deliveryDateFun();
  }, []);

  useEffect(() => {
    if (Array?.isArray(deliveryDate)) {
      setChooseDate(
        deliveryDate?.find((st) => st?.id === cartReduxData?.delivery_date) ||
          {}
      );
    }
  }, [deliveryDate]);

  useEffect(() => {
    // getCoupon();
  }, [router?.isReady]);

  const getCoupon = async () => {
    await axiosApi
      .get("coupon/get")
      .then((response) => {
        // dispatch(setCartAction({ cartID: cart_id }));
        setCouponCode(response?.data?.result?.coupon);
      })
      .catch((err) => {});
  };

  const couponHandle = async (e) => {
    setUpdateLoader(true);
    setCartError("");
    // setCouponResponse("");
    e?.preventDefault();
    try {
      if (coupon_code != "") {
        await axiosApi
          .post("coupon/apply", { coupon_code })
          .then((res) => {
            dispatch(setCartAction({ cartID: cart_id }));
            if (res?.data?.status) {
              // setCouponResponse(res?.data?.result || res?.data?.message);
              setCouponResponse(translate("coupon_success_message"));
              setError("");
              setUpdateLoader(false);
            } else {
              // setError(res?.data?.result);
              setError(translate("coupon_invalid_message"));
              setCouponResponse("");
              setUpdateLoader(false);
            }
          })
          .catch((err) => {
            // console.log(err?.response?.data);
            // setError(err?.response?.data?.message);
            setError(translate("coupon_invalid_message"));
            setCouponResponse("");
            setUpdateLoader(false);
          });
      } else {
        setCouponResponse("");
        setUpdateLoader(false);
        setError(translate("coupon_provide_message"));
      }
    } catch (error) {}
  };

  const updateproduct = async (id, quantity) => {
    setCouponResponse("");
    setCartError("");
    setUpdateLoader(true);
    setCartTotalsLoader(true);
    try {
      await axiosApi
        .post(`cart/update/${id}`, { quantity })
        .then((response) => {
          dispatch(setCartAction(response?.data));
          setChooseDate({});
          deliveryDateFun();
          setError("");
          setCartTotalsLoader(false);
          setUpdateLoader(false);
        })
        .catch((err) => {
          // console.log(err);
          if (err?.response?.data?.message) {
            setCartError(err?.response?.data?.message);
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: err?.response?.data?.message,
              })
            );
          } else {
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: "There has been an error.",
              })
            );
          }
          document
            ?.getElementById("cartError")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
          setCartTotalsLoader(false);
          setUpdateLoader(false);
        });
    } catch (err) {
      // console.log(err);
      dispatch(
        setToast({
          open: true,
          type: "danger",
          message: "There has been an error.",
        })
      );
      setCartTotalsLoader(false);
      setUpdateLoader(false);
    }
  };

  const deleteProduct = async (id) => {
    setCartError("");
    setCouponResponse("");
    setUpdateLoader(true);
    setCartTotalsLoader(true);
    try {
      await axiosApi
        .delete(`cart/delete/${id}`)
        .then((response) => {
          dispatch(setCartAction(response?.data));
          setChooseDate({});
          setError("");
          deliveryDateFun();
          setCartTotalsLoader(false);
          setUpdateLoader(false);
        })
        .catch((err) => {
          setCartTotalsLoader(false);
          setUpdateLoader(false);
          if (err?.response?.data?.message) {
            setCartError(err?.response?.data?.message);
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: err?.response?.data?.message,
              })
            );
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
    } catch (err) {
      setCartTotalsLoader(false);
      setUpdateLoader(false);
      dispatch(
        setToast({
          open: true,
          type: "danger",
          message: "There has been an error.",
        })
      );
    }
  };

  const deliveryDateFun = () => {
    setCartError("");
    setCouponResponse("");
    setDeliveryDate([]);
    axiosApi
      .get(`cart/delivery_data`)
      .then((response) => {
        setDeliveryDate(response?.data?.result);
      })
      .catch((err) => {});
  };

  const getDeliveryDate = async (id) => {
    setUpdateLoader(true);
    setCartError("");
    setCouponResponse("");
    if (abortController) {
      abortController?.abort();
    }

    abortController = new AbortController();
    await axiosApi
      .post("cart/delivery_date", { id }, { signal: abortController?.signal })
      .then((response) => {
        setDeliveryDateError("");
        setCouponResponse("");
        setUpdateLoader(false);
        setError("");
        dispatch(setCartAction({ cartID: cart_id }));
        // setCartTotalsLoader(false)
      })
      .catch((err) => {
        setUpdateLoader(false);
        setCartTotalsLoader(false);
        if (err?.response?.data?.message) {
          setCartError(err?.response?.data?.message);
          dispatch(
            setToast({
              open: true,
              type: "danger",
              message: err?.response?.data?.message,
            })
          );
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
  };

  const handleCheckout = (e) => {
    setCouponResponse("");
    setCartError("");
    setUpdateLoader(true);

    e.preventDefault();
    if (selectDate) {
      router?.push(`/checkout`);
      // setUpdateLoader(false);
      setDisable(true);
    } else {
      setDisable(false);
      setDeliveryDateError(translate("deliverydate_error"));
      setUpdateLoader(false);
      document?.getElementById("ship_warning")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // axiosApi
    //   .post("cart/cart_checkout", { package_protection: "false" })
    //   .then((res) => {
    //     if (res?.data?.status) {
    //       router?.push(`/checkout`);
    //       // setUpdateLoader(false);
    //     }
    //   })
    //   .catch((err) => {
    //     setUpdateLoader(false);
    //     if (err?.response?.data?.status === false) {
    //       setDeliveryDateError(err?.response?.data?.message);
    //       // setDeliveryDateError(Please Select the Delivery Date);
    //     }
    //   });
  };

  const debouncedUpdateProduct = debounce(updateproduct, 700);

  const handleChangeCartQuantity = (index, id, value) => {
    let tempData = cartDataRef.current;
    tempData[index].quantity = parseInt(value);
    setCartData([...tempData]);
    cartDataRef.current = [...tempData];
    debouncedUpdateProduct(id, parseInt(value));
  };

  const debouncedQunatityChange = useCallback(handleChangeCartQuantity, []);

  return (
    <>
      <Head>
        <title>{translate("shopping_cart")}</title>
      </Head>
      <Header categoryData={categoryData} />

      {Boolean(cartData?.length) && <CartBanner />}

      {updateLoader && (
        <div id={"cartError"}>
          <span className="loader-div">
            <i className="fa fa-cog fa-spin"></i>
          </span>
        </div>
      )}

      {loading ? (
        <>
          {/* <h2 className="text-center" style={{ padding: "300px" }}>
            <span className="loader-div">
              <i className="fa fa-cog fa-spin"></i>
            </span>
          </h2> */}
          <div className="single-wrapper-glob cart-wrapper">
            <div className="container">
              <div className="information-wrap" aria-hidden="true">
                {/* <div className="card"> */}
                <div
                  className="row pt-2 pb-3"
                  style={{
                    borderTop: "1px dotted",
                    borderBottom: "1px dotted",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <div className="col-lg-2 col-md-3 col-4 text-center placeholder-glow">
                    <span className="placeholder col-10"></span>
                  </div>
                  <div className="col-lg-4 col-md-6 col-8 text-center placeholder-glow">
                    <span className="placeholder col-lg-5 col-11"></span>
                  </div>
                  <div className="col-lg-2 placeholder-glow d-none d-lg-block">
                    <span className="placeholder col-6"></span>
                  </div>
                  <div className="col-lg-2 placeholder-glow d-none d-lg-block">
                    <span className="placeholder col-6"></span>
                  </div>
                  <div className="col-lg-2 placeholder-glow d-none d-lg-block">
                    <span className="placeholder col-6"></span>
                  </div>
                </div>
                <div className="row row-cols-1">
                  <div className="col-12">
                    <div className="card border border-0">
                      <div
                        className="row"
                        style={{ borderBottom: "1px dotted" }}
                      >
                        <div className="col-lg-2 col-md-3 col-4">
                          <img
                            src="https://m.media-amazon.com/images/I/518T4v5PC6L._SX425_.jpg"
                            className="img-fluid"
                            alt="..."
                          />
                        </div>
                        <div className="col-lg-10 col-md-9 col-8">
                          <div className="card-body">
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-lg-4 col-sm-6 col-12"></span>
                            </h5>
                            <ul className="card-text placeholder-glow col-lg-3 col-sm-5 col-10">
                              <li className="placeholder col-12"></li>
                              <li className="placeholder col-12"></li>
                              <li className="placeholder col-12"></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card border border-0">
                      <div className="row">
                        <div className="col-lg-2 col-md-3 col-4">
                          <img
                            src="https://m.media-amazon.com/images/I/518T4v5PC6L._SX425_.jpg"
                            className="img-fluid"
                            alt="..."
                          />
                        </div>
                        <div className="col-lg-10 col-md-9 col-8">
                          <div className="card-body">
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-lg-4 col-sm-6 col-12"></span>
                            </h5>
                            <ul className="card-text placeholder-glow col-lg-3 col-sm-5 col-10">
                              <li className="placeholder col-12"></li>
                              <li className="placeholder col-12"></li>
                              <li className="placeholder col-12"></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </>
      ) : Boolean(cartData?.length) ? (
        <section className="single-wrapper-glob cart-wrapper">
          <div className="container">
            <div className="information-wrap ">
              {Boolean(cartError) && (
                <div class="alert alert-danger" role="alert">
                  {cartError}
                </div>
              )}

              <div id="content">
                <div className="holder">
                  <div className="inner-wrapper">
                    {/* <form> */}
                    <table className="product-listing cart-info">
                      <thead>
                        <tr>
                          <th>{translate("image")}</th>
                          <th>{translate("product Name")}</th>
                          <th className="td-model">{translate("Model")}</th>
                          <th className="entry-quantity">
                            {translate("Quantity")}
                          </th>
                          <th className="entry-price">
                            {translate("Unit price")}
                          </th>
                          <th className="entry-total">{translate("Total")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartData?.map((item, i) => {
                          return (
                            <tr key={i + "row"}>
                              <td>
                                {Boolean(
                                  Boolean(Object.keys(item?.slugs)?.length)
                                ) ? (
                                  Boolean(item?.slugs) &&
                                  Boolean(Object.keys(item?.slugs)?.length) && (
                                    <Link
                                      onClick={(e) =>
                                        !Boolean(e?.nativeEvent?.ctrlKey)
                                          ? setUpdateLoader(true)
                                          : ""
                                      }
                                      href={`/${item?.slugs?.category}/${
                                        item?.slugs?.year
                                      }/${item?.slugs?.make}/${
                                        item?.slugs?.model
                                      }/${
                                        item?.slugs?.body
                                          ? item?.slugs?.body + "/"
                                          : ""
                                      }${item?.product_slug}`}
                                    >
                                      <LazyLoad height="100%" offset={120}>
                                        <img
                                          className="img-fluid"
                                          src={
                                            storeData?.image_path +
                                            "fit-in/100x100/" +
                                            item?.image
                                          }
                                          alt={item?.product_name}
                                          title={item?.product_name}
                                        />
                                      </LazyLoad>
                                    </Link>
                                  )
                                ) : Boolean(item?.f_product_image) ? (
                                  <Link
                                    onClick={(e) =>
                                      !Boolean(e?.nativeEvent?.ctrlKey)
                                        ? setUpdateLoader(true)
                                        : ""
                                    }
                                    href={`/f-product/${item?.product_slug}`}
                                  >
                                    <LazyLoad height="100%" offset={120}>
                                      <img
                                        className="img-fluid"
                                        src={item?.f_product_image}
                                        alt={item?.product_name}
                                        title={item?.product_name}
                                      />
                                    </LazyLoad>
                                  </Link>
                                ) : (
                                  Object.keys(item?.tiles_slug)?.length && (
                                    <Link
                                      onClick={(e) =>
                                        !Boolean(e?.nativeEvent?.ctrlKey)
                                          ? setUpdateLoader(true)
                                          : ""
                                      }
                                      href={`${
                                        Boolean(item?.image)
                                          ? `/${
                                              item?.tiles_slug?.category_slug
                                            }/${
                                              item?.tiles_slug?.tiles_slug
                                                ? item?.tiles_slug?.tiles_slug +
                                                  "/"
                                                : ""
                                            }${item?.product_slug}`
                                          : `/f-product/${item?.product_slug}`
                                      }`}

                                      // href={`/${
                                      //   item?.tiles_slug?.category_slug
                                      // }/${
                                      //   item?.tiles_slug?.tiles_slug
                                      //     ? item?.tiles_slug?.tiles_slug + "/"
                                      //     : ""
                                      // }${item?.product_slug}`}
                                    >
                                      <LazyLoad height="100%" offset={120}>
                                        <img
                                          className="img-fluid"
                                          src={
                                            Boolean(item?.image)
                                              ? storeData?.image_path +
                                                "fit-in/100x100/" +
                                                item?.image
                                              : storeData?.image_path +
                                                "fit-in/100x100/" +
                                                item?.tiles_slug?.image
                                          }
                                          alt={item?.product_name}
                                          title={item?.product_name}
                                        />
                                      </LazyLoad>
                                    </Link>
                                  )
                                )}

                                {/* <Link href="#">
                                    <img
                                      className="img-fluid"
                                      src={storeData?.image_path + item?.image}
                                      alt="Premium Edition Car Cover"
                                      title="Premium Edition Car Cover"
                                    />
                                  </Link> */}
                              </td>
                              <td className="product-name">
                                <div>
                                  {Boolean(Object.keys(item?.slugs)?.length)
                                    ? Boolean(item?.slugs) &&
                                      Boolean(
                                        Object.keys(item?.slugs)?.length
                                      ) && (
                                        <Link
                                          onClick={(e) =>
                                            !Boolean(e?.nativeEvent?.ctrlKey)
                                              ? setUpdateLoader(true)
                                              : ""
                                          }
                                          href={`/${item?.slugs?.category}/${
                                            item?.slugs?.year
                                          }/${item?.slugs?.make}/${
                                            item?.slugs?.model
                                          }/${
                                            item?.slugs?.body
                                              ? item?.slugs?.body + "/"
                                              : ""
                                          }${item?.product_slug}`}
                                        >
                                          <h4>{item?.product_name}</h4>
                                        </Link>
                                      )
                                    : Object.keys(item?.tiles_slug)?.length && (
                                        <Link
                                          onClick={(e) =>
                                            !Boolean(e?.nativeEvent?.ctrlKey)
                                              ? setUpdateLoader(true)
                                              : ""
                                          }
                                          href={`${
                                            item?.image
                                              ? `/${
                                                  item?.tiles_slug
                                                    ?.category_slug
                                                }/${
                                                  item?.tiles_slug?.tiles_slug
                                                    ? item?.tiles_slug
                                                        ?.tiles_slug + "/"
                                                    : ""
                                                }${item?.product_slug}`
                                              : `/f-product/${item?.product_slug}`
                                          } `}
                                        >
                                          <h4>{item?.product_name}</h4>
                                        </Link>
                                      )}

                                  <ul className="entry-list">
                                    {Boolean(item?.option) &&
                                      Object.keys(item?.option)?.map(
                                        (ot, i) => (
                                          <li key={i + "otp"}>
                                            {ot + " : " + item?.option[ot]}
                                          </li>
                                        )
                                      )}
                                  </ul>
                                </div>
                              </td>
                              <td className="td-model">
                                <div>{item?.model}</div>
                              </td>

                              <td
                                className="quantity entry-quantity"
                                style={{ minWidth: "140px" }}
                              >
                                <div
                                  className="input-group quantityp"
                                  style={{ maxWidth: "140px" }}
                                >
                                  <span className="input-group-btn">
                                    <button
                                      style={{
                                        textShadow: "0 1px 0 #fff",
                                        backgroundImage:
                                          "linear-gradient(to bottom,#fff 0,#E0E0E0 100%)",
                                        backgroundRepeat: "repeat-x",
                                        borderColor: "#ccc",
                                      }}
                                      className="btn btn-default minus"
                                      id="minus1095102"
                                      type="button"
                                      onClick={() => {
                                        item?.quantity !== 1 &&
                                          updateproduct(
                                            item?._id,
                                            item?.quantity - 1
                                          );
                                      }}
                                    >
                                      <span className="fa fa-minus"></span>
                                    </button>
                                  </span>

                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    pattern="\d*"
                                    className="form-control txtQuanity text-center p-0"
                                    name="quantity"
                                    value={item?.quantity || ""}
                                    onChange={(e) => {
                                      debouncedQunatityChange(
                                        i,
                                        item?._id,
                                        e?.target?.value
                                      );
                                      // item?.quantity !== 1 &&
                                      //   updateproduct(
                                      //     item?._id,
                                      //     e?.target?.value
                                      //   );
                                      // setQuantity(e?.target?.value);
                                    }}
                                  />
                                  {/* ===
                                  <span className="input-group-btn">
                                    <button className="btn btn-default minus" id="minus1095116" type="button">
                                      <span className="fa fa-minus"></span></button>
                                  </span>== */}

                                  <span className="input-group-btn">
                                    <button
                                      style={{
                                        textShadow: "0 1px 0 #fff",
                                        backgroundImage:
                                          "linear-gradient(to bottom,#fff 0,#E0E0E0 100%)",
                                        backgroundRepeat: "repeat-x",
                                        borderColor: "#ccc",
                                      }}
                                      className="btn btn-default add"
                                      id="add964139"
                                      type="button"
                                      onClick={() => {
                                        updateproduct(
                                          item?._id,
                                          item?.quantity + 1
                                        );
                                      }}
                                    >
                                      <span className="fa fa-plus"></span>
                                    </button>
                                  </span>
                                  <a
                                    className="delete_product"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <input
                                      type="hidden"
                                      value="remove=964139"
                                    />
                                    <i
                                      className="fa fa-times-circle text-danger fa-lg"
                                      onClick={() => deleteProduct(item?._id)}
                                    ></i>
                                  </a>
                                </div>
                                <div className="price-model d-none">
                                  <div>
                                    <strong className="head-label">
                                      {translate("Unit price")}
                                    </strong>{" "}
                                    :{" "}
                                    <big>
                                      {/* {storeData?.currency?.symbol || "$"} */}
                                      {item?.price || 0}
                                    </big>
                                  </div>
                                  <div>
                                    <strong className="head-label">
                                      {translate("Total")}
                                    </strong>{" "}
                                    :{" "}
                                    <big>
                                      {/* {storeData?.currency?.symbol || "$"} */}
                                      {item?.total || 0}
                                    </big>
                                  </div>
                                </div>
                              </td>
                              <td className="entry-price">
                                {item?.price || storeData?.currency?.symbol + 0}
                              </td>
                              <td className="entry-total">
                                {item?.total || storeData?.currency?.symbol + 0}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* </form> */}
                  </div>

                  <div id="coupon" className="coupon-wrap">
                    <form className="form-inline" onSubmit={couponHandle}>
                      <input type="hidden" name="next" value="coupon" />
                      <input
                        type="text"
                        className="form-control"
                        name="coupon"
                        value={coupon_code || ""}
                        placeholder={translate("enter_coupon")}
                        onChange={(e) => setCouponCode(e?.target?.value)}
                      />
                      <button
                        type="submit"
                        className="btn btn-blue btnCoupon"
                        // onClick={couponHandle}
                      >
                        {translate("Apply")}
                      </button>
                    </form>
                  </div>
                  {Boolean(couponRespose) ? (
                    <div style={{ clear: "both" }}>
                      <span style={{ color: "green" }}>
                        {couponRespose ||
                          "Coupon has successfully been applied to your order."}
                      </span>
                    </div>
                  ) : (
                    <div style={{ clear: "both" }}>
                      <h6 style={{ color: "red" }}>{error}</h6>
                    </div>
                  )}

                  <div className="cart-footer">
                    <div className="row">
                      <div className="col-md-7 ">
                        {/* {console.log(deliveryDate?.length == 0)} */}
                        <div id="guaranteed-shipping-holder">
                          <p className="dtitle">
                            {" "}
                            {storeData?.store_id == "30" ? (
                              <>Choose Your Estimated Delivery Date</>
                            ) : (
                              <>
                                {translate(
                                  "Choose Your Guaranteed Delivery Date"
                                )}
                              </>
                            )}
                            :{" "}
                          </p>
                          {deliveryDate?.length == 0 ? (
                            <div className="placeholder-glow">
                              {/* <span className="dtitle placeholder placeholder-sm w-50"></span> */}
                              <div className="date_select_wrp">
                                <ul className="dselects">
                                  <li className={`delivery-day-box-dev `}>
                                    <div className="delivery_date placeholder-glow">
                                      <div className="placeholder placeholder-sm w-25"></div>
                                      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                                        <span className="placeholder placeholder-sm mt-2 mb-2 w-50"></span>
                                      </div>
                                      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                                        <span className="placeholder placeholder-sm w-50"></span>
                                      </div>
                                    </div>
                                    <div className="delivery_price placeholder-glow">
                                      <span className="placeholder placeholder-sm w-25 bg-dark"></span>
                                      {/* <p className="placeholder bg-dark mb-0"></p> */}
                                    </div>
                                  </li>
                                  <li className={`delivery-day-box-dev `}>
                                    <div className="delivery_date placeholder-glow">
                                      <div className="placeholder placeholder-sm w-25"></div>
                                      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                                        <span className="placeholder placeholder-sm mt-2 mb-2 w-50"></span>
                                      </div>
                                      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                                        <span className="placeholder placeholder-sm w-50"></span>
                                      </div>
                                    </div>
                                    <div className="delivery_price placeholder-glow">
                                      <span className="placeholder placeholder-sm w-25 bg-dark"></span>
                                      {/* <p className="placeholder bg-dark mb-0"></p> */}
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="date_select_wrp">
                                <ul className="dselects">
                                  {deliveryDate?.map((date) => (
                                    <li
                                      className={`delivery-day-box-dev ${
                                        selectDate === date?.id && "selected"
                                      }`}
                                      key={date?.id + "d"}
                                      onClick={() => {
                                        setSelectDate(date?.id);
                                        setChooseDate(date);
                                        getDeliveryDate(date?.id);
                                      }}
                                    >
                                      <span className="check">
                                        <i className="fa fa-check"></i>
                                      </span>
                                      <div className="delivery_date">
                                        {/* {console.log(date?.day?.toString().length)} */}
                                        {date?.day?.toString().length == 1
                                          ? "0" + date?.day
                                          : date?.day}
                                        <span>
                                          {translate(date?.monthName) +
                                            ", " +
                                            date?.year}
                                        </span>
                                        <span>{translate(date?.dayName)}</span>
                                      </div>
                                      <div
                                        className="delivery_price"
                                        style={{
                                          color:
                                            date?.Delivery_fee === 0 &&
                                            "#0b9f13",
                                        }}
                                      >
                                        {date?.Delivery_fee === 0
                                          ? translate("free")
                                          : storeData?.currency?.symbol +
                                            date?.Delivery_fee}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {Boolean(Object?.keys(chooseDate)?.length) && (
                                <div className="guaranteeBox">
                                  <i className="fa fa-check-circle"></i>{" "}
                                  {translate(
                                    "We Guarantee Products to be Delivered On:"
                                  )}{" "}
                                  <strong id="guaranteed-delivery-date-span">
                                    {translate(chooseDate?.dayName) +
                                      ", " +
                                      translate(chooseDate?.monthName) +
                                      " " +
                                      chooseDate?.day +
                                      ", " +
                                      chooseDate?.year}
                                  </strong>
                                </div>
                              )}
                              {deliveryDateError && (
                                <div id="ship_warning">
                                  <div className="alert alert-danger">
                                    {deliveryDateError}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div id="ship_warning"></div>
                        <div className="clearfix"></div>
                        {storeData?.store_id == "15" && (
                          <div className="add_charge_message mb-3">
                            Note: An extra Shipping Fee of $30 will be required
                            to the states of Hawaii, Alaska, & Puerto Rico.
                          </div>
                        )}
                        {storeData?.store_id == "25" && (
                          <div className="add_charge_message mb-3">
                            An additional of $45 shipping fee may apply if FedEx
                            determines your address is in a remote part of the
                            country.
                          </div>
                        )}
                      </div>
                      <div className="col-md-5">
                        <div
                          className="cart-total"
                          style={
                            storeData?.language?.code == "en"
                              ? { maxWidth: "320px" }
                              : { maxWidth: "430px" }
                          }
                        >
                          <h4
                            className={`${
                              (translate("Cart") + " " + translate("Totals"))
                                ?.length > 15
                                ? "entry-title1"
                                : "entry-title"
                            } `}
                          >
                            {translate("Cart") + " " + translate("Totals")}
                            {/* <strong>{translate("Cart")}</strong>{" "}
                            {translate("Totals")} */}
                          </h4>
                          <table
                            id="total"
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                          >
                            <tbody>
                              {cartTotalsData?.map((item, i) => (
                                <tr key={i + "cart_totoals"}>
                                  <td>
                                    {storeData?.store_id == "30" ? (
                                      <b
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            item?.key == "shipping"
                                              ? "Estimated " +
                                                item?.text?.replace(
                                                  " - ",
                                                  " <br/> - "
                                                ) +
                                                ":"
                                              : item?.text + ":",
                                        }}
                                      ></b>
                                    ) : (
                                      <b
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            item?.key == "shipping"
                                              ? item?.text?.replace(
                                                  " - ",
                                                  " <br/> - "
                                                ) + ":"
                                              : item?.text + ":",
                                        }}
                                      ></b>
                                    )}
                                  </td>
                                  <td>{item?.value_text || 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div
                            className="entry-footer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Link
                              className="btn-grey"
                              style={{ marginRight: "3px" }}
                              href="#"
                            >
                              {translate("continue_shopping")}
                            </Link>

                            <button
                              type="button"
                              id="btncheckout"
                              className="btn-blue border-0"
                              onClick={handleCheckout}
                              disabled={disable}
                            >
                              {translate("checkout")}&nbsp;&nbsp;
                              <span
                                className="fa fa-share-square-o"
                                style={{ fontSize: "1.3em" }}
                              ></span>
                            </button>
                          </div>
                          {Boolean(cartTotalsLoader) && (
                            <span className="">
                              &nbsp;
                              <img
                                src="https://d68my205fyswa.cloudfront.net/loading.gif"
                                alt="loading"
                              />
                            </span>
                          )}
                        </div>
                      </div>
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
            <div className="inner-wrap">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">{translate("home")}</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/cart?cart_id=">
                      {translate("shopping_cart")}
                    </Link>
                  </li>
                </ol>
              </nav>
              <div>
                <h1>{translate("shopping_cart")}</h1>
                <div className="holder">
                  <div className="content">
                    {translate("shopping_cart_empty")}!
                  </div>
                  <div className="buttons">
                    <div className="right">
                      <Link href="/" className="orange_button">
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
      <Footer />
    </>
  );
};

export default Cart;
