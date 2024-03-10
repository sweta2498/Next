import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import axiosApi from "../../axios_instance";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { setCartAction } from "../../redux/action/cartAction";
import Head from "next/head";
import { setToast } from "../../redux/action/toastAction";
import LazyLoad from "react-lazy-load";

const ProductFilter = ({
  cartID,
  productData = [],
  productTitle = {},
  allData = {},
}) => {
  const { t: translate } = useTranslation("product");

  const storeData = useSelector((state) => state?.common?.store);
  // const [productData, setProductData] = useState([]);
  // const [productTitle, setProductTitle] = useState({});
  const [loader, setLoader] = useState(true);
  const [loaderCart, setLoaderCart] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const category_slug = router?.query?.category;

  useEffect(() => {
    setLoader(false);
  }, [productData]);

  useEffect(() => {
    document
      ?.getElementById("scrollData")
      ?.scrollIntoView({ behavior: "smooth" });
  }, [productData]);

  const addToCartOpt = (product_id) => {
    setLoaderCart(true);
    axiosApi
      .post(`cart/add`, {
        product_id,
        quantity: 1,
        category_id: allData?.category_id,
      })
      .then((res) => {
        if (res?.data?.status) {
          dispatch(setCartAction({ cartID: res?.data?.result }));
          router?.push("/cart?cart_id=" + res?.data?.result);
        }
      })
      .catch((err) => {
        setLoader(false);
        setLoaderCart(false);
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
  };

  return (
    <>
      <Head>
        <title>
          {productTitle?.category_name + " - " + storeData?.store_name}
        </title>
      </Head>
      {/* {Boolean(loader) && (
                <h2 className="text-center" style={{ padding: "300px" }}></h2>
            )} */}

      {Boolean(loaderCart) && (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      )}

      {
        // Boolean(loader) ? (
        //     <span className="loader-div">
        //         <i className="fa fa-cog fa-spin"></i>
        //     </span>
        // ) :
        Array?.isArray(productData) && Boolean(productData?.length) && (
          <section className="page-content single-wrapper">
            <div className="container" id="scrollData">
              <div className="inner-wrap no-padding">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a>{productTitle?.category_name}</a>
                    </li>
                  </ol>
                </nav>

                <div id="notification"></div>
                <div className="pricing-page-wrap" id="pricing-inr">
                  <h1 style={{ textAlign: "center" }}>
                    {productTitle?.category_name}
                  </h1>
                  <div className="col-sm-12 col-md-12">
                    <div className="panel panel-default">
                      <div className="panel-body product-list1">
                        <div className="container-fluid">
                          {productData?.map((item, index) => (
                            <Fragment key={index}>
                              <div className="row">
                                <div className="col-md-9 col-sm-12 p-0 mb-20 pt-1">
                                  <div className="col-12 mb-30 p-0">
                                    <Link
                                      href={router?.asPath + "/" + item?.slug}
                                      onClick={(e) =>
                                        !Boolean(e?.nativeEvent?.ctrlKey)
                                          ? setLoaderCart(true)
                                          : ""
                                      }
                                    >
                                      <h2>{item?.product_name}</h2>
                                    </Link>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-4 col-sm-6 text-center">
                                      <Link
                                        href={router?.asPath + "/" + item?.slug}
                                        onClick={(e) =>
                                          !Boolean(e?.nativeEvent?.ctrlKey)
                                            ? setLoaderCart(true)
                                            : ""
                                        }
                                      >
                                        <LazyLoad height="100%" offset={120}>
                                          <img
                                            style={{ maxWidth: "100%" }}
                                            className="custom-lazy loaded"
                                            src={
                                              storeData?.image_path + item?.image
                                            }
                                            data-src={
                                              storeData?.image_path + item?.image
                                            }
                                            alt={item?.product_name}
                                            title={item?.product_name}
                                          />
                                        </LazyLoad>
                                      </Link>
                                    </div>
                                    <div className="col-md-4 col-sm-6">
                                      <div className="col-sm-12">
                                        <b className="price-figure">
                                          {item?.prices?.price || 0}{" "}
                                        </b>
                                      </div>
                                      <div className="col-sm-12">
                                        <div className="price1">
                                          {translate("regular_price")}:{" "}
                                          <span className="btn-price1">
                                            <b>
                                              {" "}
                                              {item?.prices?.regular_price || 0}
                                            </b>
                                          </span>
                                          <br />
                                          {translate("you_save")}{" "}
                                          <span className="btn-price1">
                                            <b>
                                              {" "}
                                              {item?.prices?.save_price || "0"}
                                            </b>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4 d-md-block d-none">
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square"></i>
                                        </span>
                                        &nbsp; {translate("free_Shipping")}
                                      </div>
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square"></i>
                                        </span>
                                        &nbsp; {translate("instock")}
                                      </div>
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square"></i>
                                        </span>
                                        &nbsp;{" "}
                                        {translate("shipssamebusinessday")}
                                      </div>
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square">
                                            {" "}
                                          </i>
                                        </span>
                                        &nbsp; {translate("guaranteedfit")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-3 col-sm-12 star-rating-div-left xs-nopad">
                                  <div className="row">
                                    <div className="col-sm-6 d-md-none d-sm-block">
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square"></i>
                                        </span>
                                        &nbsp; {translate("free_Shipping")}
                                      </div>
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square"></i>
                                        </span>
                                        &nbsp; {translate("instock")}
                                      </div>
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square"></i>
                                        </span>
                                        &nbsp;{" "}
                                        {translate("shipssamebusinessday")}
                                      </div>
                                      <div className="col-12">
                                        <span>
                                          <i className="colorgreen fa fa-check-square"></i>
                                        </span>
                                        &nbsp;{translate("guaranteedfit")}
                                      </div>
                                    </div>
                                    <div className="col-sm-6 col-md-12  text-center">
                                      <br />
                                      <Link
                                        onClick={(e) =>
                                          !Boolean(e?.nativeEvent?.ctrlKey)
                                            ? setLoaderCart(true)
                                            : ""
                                        }
                                        href={router?.asPath + "/" + item?.slug}
                                        className="btn btn-primary w-100 mb-2 "
                                        role="button"
                                      >
                                        {translate("view_details")}
                                      </Link>
                                      <br />
                                      <a
                                        // href=""
                                        onClick={(e) =>
                                          addToCartOpt(item?.product_id)
                                        }
                                        className="btn btn-success w-100 btn-addtocart text-white"
                                        role="button"
                                      >
                                        {translate("addtocart")}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
        // : (
        //     <h2 className="text-center" style={{ padding: "300px" }}>
        //         No data Found.
        //     </h2>
        // )
      }
    </>
  );
};

export default ProductFilter;
