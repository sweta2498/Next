import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import axiosApi from "../../axios_instance";
import { setCartAction } from "../../redux/action/cartAction";
let productvalues;
import { isBrowser, isMobile } from "react-device-detect";
import Head from "next/head";
import { setToast } from "../../redux/action/toastAction";
import { tagConfig } from "../../common_function/tagConfig";
import LazyLoad from "react-lazy-load";

const Products = ({
  productDatas,
  cartID,
  isBodyExist,
  istilesExist,
  isFilterExist,
  categoryData,
  meta_description,
  breadcrumb = true,
  view_btn = true,
  slugs,
}) => {
  const product_attributes = [
    "type",
    "warranty",
    "breathable",
    "layers",
    "material",
    "soft_fleece",
    "water",
    "snow",
    "uv_protection",
    "dirt_dust_protection",
    "hail",
  ];

  const storeData = useSelector((state) => state?.common?.store);
  const scrollState = useSelector((state) => state?.mobilescroll);

  const [bestSellerIndex, setBestSellerIndex] = useState("");
  const [mostPopularIndex, setMostPopularIndex] = useState("");
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const productData = productDatas?.result;
  const productTitle = productDatas?.tital;
  const year = router?.query?.year || Number(slugs?.year);
  const vehicle_id = productDatas?.vehicle_id;
  const tiles_name = productDatas?.tital?.tiles_name;
  let data = {};

  const { t: translate } = useTranslation("product");

  const [currentStore, setCurrentStore] = useState(
    tagConfig?.find((state) => state?.store_id == storeData?.store_id) || {}
  );

  useEffect(() => {
    setCurrentStore(
      tagConfig?.find((state) => state?.store_id == storeData?.store_id)
    );
  }, [storeData]);

  // console.log(currentStore);

  useEffect(() => {
    document
      ?.getElementById("scrollData")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [productDatas]);

  useEffect(() => {
    if (isMobile) {
      if (scrollState?.scrollState) {
        document
          ?.getElementById("scrollData")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [scrollState]);

  // useEffect(() => {
  //   if(isMobile){
  //     document
  //     ?.getElementById("mobilescroll")
  //     ?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, []);

  const addToCartOpt = (product_id, product_name) => {
    setLoader(true);
    if (istilesExist) {
      data = {
        product_id,
        product_name,
        tiles_name,
        quantity: "1",
        // category_slug: router?.query?.category,
        category_id: productDatas?.category_id,
        // tiles_slug: router?.query?.year,
        tiles_id: productDatas?.tile_image_id,
      };
    } else if (isFilterExist === true) {
      data = {
        product_id,
        year,
        vehicle_id,
        quantity: "1",
        // category_slug: router?.query?.category,
        category_id: productDatas?.category_id,
      };
    } else if (isFilterExist === false) {
      data = {
        product_id,
        quantity: "1",
        // category_slug: router?.query?.category,
        category_id: productDatas?.category_id,
      };
    }

    axiosApi
      .post(`cart/add`, data)
      .then((res) => {
        if (res?.data?.status) {
          dispatch(setCartAction({ cartID: res?.data?.result }));
          router?.push("/cart?cart_id=" + res?.data?.result);
        }
      })
      .catch((err) => {
        console.log(err);
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
  };
  const attributes = [];
  productData?.map((pdata) =>
    pdata?.attribute_group?.map((pattributes) =>
      pattributes?.attributes?.map((ptype) => {
        if (attributes.indexOf(ptype?.name) === -1)
          attributes.push(ptype?.name);
      })
    )
  );

  const isAttributeExist = (item) => {
    return attributes.indexOf(translate(item)) !== -1;
  };

  useEffect(() => {
    productData?.map((pdata, i) => {
      pdata?.attribute_group?.map((pattributes) => {
        if (pattributes?.name === "category") {
          pattributes?.attributes?.map((ptype) => {
            if (ptype?.name == "best_seller_badge") {
              setBestSellerIndex(i);
            } else if (ptype?.name == "most_popular_badge") {
              setMostPopularIndex(i);
            }
          });
        }
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>
          {Boolean(istilesExist)
            ? Boolean(categoryData?.length)
              ? categoryData[0]?.details?.meta_title
              : ""
            : productTitle?.category_name +
              " " +
              translate("for") +
              " " +
              productTitle?.year +
              " " +
              productTitle?.make_name +
              " " +
              productTitle?.model_name +
              " - " +
              storeData?.store_name}
          {!Boolean(isBodyExist) && !Boolean(istilesExist)
            ? " - " + productTitle?.body_name + " - " + storeData?.store_name
            : ""}
        </title>
        <meta
          name="description"
          content={meta_description || "Car Cover Factory"}
        />
      </Head>

      {Boolean(loader) && (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      )}

      {productData?.length > 2 ? (
        <section
          className="page-content single-wrapper"
          // onInvalid={"productData"}
        >
          <div className="container" id="scrollData">
            <div className="inner-wrap no-padding">
              {Boolean(breadcrumb) && (
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href={"/" + router?.query?.category}>
                        {productTitle?.category_name}
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link
                        href={
                          "/" +
                          router?.query?.category +
                          "/" +
                          router?.query?.year
                        }
                      >
                        {productTitle?.year}
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link
                        href={
                          "/" +
                          router?.query?.category +
                          "/" +
                          router?.query?.year +
                          "/" +
                          router?.query?.make
                        }
                      >
                        {productTitle?.make_name}
                      </Link>
                    </li>
                    {Boolean(isBodyExist) ? (
                      <li className="breadcrumb-item">
                        <a> {productTitle?.model_name}</a>
                      </li>
                    ) : (
                      <li className="breadcrumb-item">
                        <Link
                          href={
                            "/" +
                            router?.query?.category +
                            "/" +
                            router?.query?.year +
                            "/" +
                            router?.query?.make +
                            "/" +
                            router?.query?.model
                          }
                        >
                          {productTitle?.model_name}
                        </Link>
                      </li>
                    )}
                    {/* <li className="breadcrumb-item">
                    <Link
                      href={
                        "/" +
                        router?.query?.category +
                        "/" +
                        router?.query?.year +
                        "/" +
                        router?.query?.make +
                        "/" +
                        router?.query?.model
                      }
                    >
                      {productTitle?.model_name}
                    </Link>
                  </li> */}
                    {!Boolean(isBodyExist) && (
                      <li className="breadcrumb-item">
                        <a>{productTitle?.body_name}</a>
                      </li>
                    )}
                  </ol>
                </nav>
              )}

              <div className="pricing-page-wrap" id="pricing-inr">
                <h1 style={{ textAlign: "center" }}>
                  {productTitle?.category_name +
                    " " +
                    translate("for") +
                    " " +
                    productTitle?.year +
                    " " +
                    productTitle?.make_name +
                    " " +
                    productTitle?.model_name}
                  {!Boolean(isBodyExist) && " - " + productTitle?.body_name}
                </h1>

                <div className="pricing-page-inner-wrap table-responsive">
                  <style jsx>{`
                    .table-product-variation
                      tr
                      > td:nth-child(${mostPopularIndex + 2}):not(
                        :first-child
                      ) {
                      border-left: 2px solid #3367c6;
                      border-right: 2px solid #3367c6;
                    }

                    .table-product-variation
                      tr:last-child
                      > td:nth-child(${mostPopularIndex + 2}) {
                      border-bottom: 2px solid #3367c6;
                    }

                    .table-product-variation
                      tr
                      > td:nth-child(${bestSellerIndex + 2}):not(:first-child) {
                      border-left: 2px solid #2dbb4d;
                      border-right: 2px solid #2dbb4d;
                    }

                    .table-product-variation
                      tr:last-child
                      > td:nth-child(${bestSellerIndex + 2}) {
                      border-bottom: 2px solid #2dbb4d;
                    }
                  `}</style>
                  <table
                    style={{ textAlign: "center" }}
                    className={`table  table-striped table-responsive table-product-variation table-row-item${productData?.length}`}
                  >
                    <tbody>
                      <tr></tr>
                      <tr>
                        <td
                          style={{
                            width: "140px",
                            borderTop: "none",
                            borderBottom: "none",
                            borderLeft: "none",
                          }}
                        ></td>
                        {Array?.isArray(productData) &&
                          productData?.map((pimage) => {
                            let editionName = "";
                            let alt =
                              productTitle?.category_name +
                              " " +
                              translate("for") +
                              " " +
                              productTitle?.year +
                              " " +
                              productTitle?.make_name +
                              " " +
                              productTitle?.model_name;
                            let category = pimage?.attribute_group?.find(
                              (item) => item?.name == "category"
                            );
                            let edition = category?.attributes?.find(
                              (item) => item?.name == "edition"
                            );
                            if (Boolean(edition)) {
                              editionName = edition?.value;
                            }
                            if (Boolean(editionName)) {
                              alt += " - " + editionName;
                            }

                            return (
                              <td key={pimage?._id + "image"}>
                                <Link
                                  href={
                                    Boolean(view_btn)
                                      ? router?.asPath + "/" + pimage?.slug
                                      : `/${slugs?.categorySlug}/${
                                          slugs?.year
                                        }/${slugs?.make}/${slugs?.model}/${
                                          slugs?.body != ""
                                            ? slugs?.body + "/"
                                            : ""
                                        }${pimage?.slug}`
                                  }
                                  onClick={(e) =>
                                    !Boolean(e?.nativeEvent?.ctrlKey)
                                      ? setLoader(true)
                                      : ""
                                  }
                                >
                                  <LazyLoad height={"100%"} offset={300}>
                                    <img
                                      className="custom-lazy loaded"
                                      src={
                                        storeData?.image_path +
                                        "fit-in/300x300/" +
                                        pimage?.image
                                      }
                                      data-src={
                                        storeData?.image_path +
                                        "fit-in/300x300/" +
                                        pimage?.image
                                      }
                                      alt={alt}
                                      title={alt}
                                    />
                                  </LazyLoad>
                                </Link>
                              </td>
                            );
                          })}
                      </tr>
                      <tr></tr>
                      <tr className="bg-white">
                        <td style={{ width: "140px", border: "none" }}></td>
                        {Array?.isArray(productData) &&
                          productData?.map((pdata) => (
                            <td
                              key={pdata?._id + "product-list"}
                              style={{
                                border: "none",
                                paddingBottom: "3px",
                                paddingLeft: "0",
                                paddingRight: "0",
                              }}
                            >
                              {pdata?.attribute_group?.map(
                                (pattributes) =>
                                  pattributes?.name === "category" &&
                                  pattributes?.attributes?.map(
                                    (attribute) =>
                                      (attribute?.name ===
                                        "best_seller_badge" ||
                                        attribute?.name ===
                                          "most_popular_badge") && (
                                        <div
                                          key={attribute?._id + "attributes"}
                                          className={`${
                                            translate("best_seller") ==
                                              attribute?.value &&
                                            "bestseller-tab-header"
                                          } 
                                          ${
                                            translate("most_popular") ==
                                              attribute?.value &&
                                            "mostpopular-tab-header mostpopular-tab-border"
                                          }`}
                                        >
                                          {attribute?.value}
                                        </div>
                                      )
                                  )
                              )}
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "140px",
                            borderTop: "none",
                            borderBottom: "none",
                            borderLeft: "none",
                          }}
                        ></td>
                        {Array?.isArray(productData) &&
                          productData?.map((pdata, i) =>
                            pdata?.attribute_group?.map(
                              (pattributes) =>
                                pattributes?.name === "category" &&
                                pattributes?.attributes?.map(
                                  (attribute) =>
                                    attribute?.name === "edition" && (
                                      <td
                                        key={
                                          attribute?._id + "attribute_category"
                                        }
                                        style={
                                          bestSellerIndex == i ||
                                          mostPopularIndex == i
                                            ? {
                                                background:
                                                  bestSellerIndex == i
                                                    ? "#2dbb4d"
                                                    : mostPopularIndex == i
                                                    ? "#3367c6"
                                                    : "",
                                              }
                                            : {}
                                        }
                                        className={`v-align-middle c-pointer ctmcolor
                                        ${
                                          bestSellerIndex == i &&
                                          "bestseller-tab-name"
                                        }
                                        ${
                                          mostPopularIndex == i &&
                                          "mostpopular-tab-namek"
                                        }
                                         `}
                                      >
                                        <h4 className="product-variation-title">
                                          <Link
                                            onClick={(e) =>
                                              !Boolean(e?.nativeEvent?.ctrlKey)
                                                ? setLoader(true)
                                                : ""
                                            }
                                            className={`${
                                              bestSellerIndex == i
                                                ? "text-white"
                                                : "text-black"
                                            }
                                            ${
                                              mostPopularIndex == i
                                                ? "text-white"
                                                : "text-black"
                                            }`}
                                            href={
                                              Boolean(view_btn)
                                                ? router?.asPath +
                                                  "/" +
                                                  pdata?.slug
                                                : `/${slugs?.categorySlug}/${
                                                    slugs?.year
                                                  }/${slugs?.make}/${
                                                    slugs?.model
                                                  }/${
                                                    slugs?.body != ""
                                                      ? slugs?.body + "/"
                                                      : ""
                                                  }${pdata?.slug}`
                                            }
                                            style={{}}
                                          >
                                            {attribute?.value}
                                          </Link>
                                        </h4>
                                      </td>
                                    )
                                )
                            )
                          )}
                      </tr>

                      <tr>
                        <td>{translate("Price")}</td>
                        {Array?.isArray(productData) &&
                          productData?.map((pitem, i) => (
                            <td
                              className={`item${productData?.length}`}
                              key={i + "price"}
                            >
                              <span className="price-figure">
                                {/* <small>$</small> */}
                                {pitem?.prices?.price || "0"}{" "}
                              </span>
                              {Boolean(pitem?.prices?.vat) && (
                                <div
                                  className="mb-1"
                                  style={{ marginTop: "-10px" }}
                                >
                                  (Incl. VAT)
                                </div>
                              )}
                              <div className="price1">
                                {translate("regular_price")}:{" "}
                                <b
                                  style={{ textDecorationLine: "line-through" }}
                                >
                                  {pitem?.prices?.regular_price || 0}
                                </b>
                                <span className="d-none d-sm-inline">
                                  <br />
                                  {translate("you_save")}{" "}
                                  <b>{pitem?.prices?.save_price || "0"}</b>
                                </span>
                              </div>
                              <br />

                              <Link
                                onClick={(e) =>
                                  !Boolean(e?.nativeEvent?.ctrlKey)
                                    ? setLoader(true)
                                    : ""
                                }
                                href={
                                  Boolean(view_btn)
                                    ? router?.asPath + "/" + pitem?.slug
                                    : `/${slugs?.categorySlug}/${slugs?.year}/${
                                        slugs?.make
                                      }/${slugs?.model}/${
                                        slugs?.body != ""
                                          ? slugs?.body + "/"
                                          : ""
                                      }${pitem?.slug}`
                                }
                                className="btn btn-primary w-100 mb-2"
                                role="button"
                              >
                                {translate("view_details")}
                              </Link>

                              <br />
                              <a
                                onClick={(e) =>
                                  addToCartOpt(
                                    pitem?.product_id,
                                    pitem?.product_name
                                  )
                                }
                                className="btn btn-success w-100 btn-addtocart text-white "
                                role="button"
                              >
                                {translate("addtocart")}
                              </a>
                            </td>
                          ))}
                      </tr>
                      {/* {console.log(Boolean(currentStore?.product_attributes) ? currentStore?.product_attributes : product_attributes)} */}
                      {(Boolean(currentStore?.product_attributes)
                        ? currentStore?.product_attributes
                        : product_attributes
                      )?.map(
                        (item, i) =>
                          isAttributeExist(item, productData) && (
                            <tr key={i + "itemrow"}>
                              <td>{translate(item)}</td>
                              {productData?.map((pdata) => (
                                <td
                                  key={pdata?._id + "pa_custome"}
                                  className="align-middle"
                                >
                                  {pdata?.attribute_group?.map((pattributes) =>
                                    pattributes?.attributes?.map(
                                      (ptype) =>
                                        ptype?.name == translate(item) && (
                                          <Fragment key={ptype?._id + "paa"}>
                                            {pattributes?.name === "check" && (
                                              <i className="fa fa-check fa-lg text-success"></i>
                                            )}
                                            {pattributes?.name === "rating" && (
                                              <span className="star-value">
                                                {Boolean(
                                                  parseFloat(ptype?.value)
                                                ) ? (
                                                  <>
                                                    {[
                                                      ...Array(
                                                        parseInt(ptype?.value)
                                                      ),
                                                    ]?.map((st, i) => (
                                                      <span
                                                        className="fa fa-star pr-1"
                                                        key={i + "fss"}
                                                      />
                                                    ))}
                                                    {[
                                                      ...Array(
                                                        5 -
                                                          parseInt(ptype?.value)
                                                      ),
                                                    ]?.map((st, i) => (
                                                      <span
                                                        className="fa fa-star-o pr-1"
                                                        key={i + "nfss"}
                                                      />
                                                    ))}
                                                    {Boolean(
                                                      ptype?.value.includes("+")
                                                    ) && (
                                                      <span className="fa fa-plus-square text-seagreen" />
                                                    )}
                                                  </>
                                                ) : (
                                                  <span>{ptype?.value}</span>
                                                )}
                                              </span>
                                            )}
                                            {pattributes?.name === "text" && (
                                              <span>{ptype?.value}</span>
                                            )}
                                          </Fragment>
                                        )
                                    )
                                  )}
                                </td>
                              ))}
                            </tr>
                          )
                      )}
                      <tr>
                        <td></td>
                        {[...Array(productData?.length)]?.map((pt, i) => (
                          <td key={i + "fst"}>
                            <ul className="price-features">
                              <li>
                                <span>
                                  <i className="colorgreen fa fa-check-square"></i>
                                </span>
                                &nbsp; {translate("free_Shipping")}
                              </li>
                              <li>
                                <span>
                                  <i className="colorgreen fa fa-check-square"></i>
                                </span>
                                &nbsp; {translate("instock")}
                              </li>
                              <li>
                                <span>
                                  <i className="colorgreen fa fa-check-square"></i>
                                </span>
                                &nbsp; {translate("shipssamebusinessday")}
                              </li>
                              <li>
                                <span>
                                  <i className="colorgreen fa fa-check-square"></i>
                                </span>
                                &nbsp; {translate("guaranteedfit")}
                              </li>
                            </ul>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>

                  <div className="div-product-variation">
                    <div className="col-sm-12 col-md-12">
                      <div className="panel panel-default">
                        <div className="panel-body product-list1">
                          <div className="container-fluid">
                            {productData?.map((item) => {
                              const a = item?.attribute_group?.find(
                                (data) => data?.name == "category"
                              );
                              const b = a?.attributes?.find(
                                (data) => data?.name == "edition"
                              );
                              if (b?.value) {
                                productvalues = b?.value;
                              }
                              return (
                                <Fragment key={item?._id + "sm"}>
                                  <div className="row">
                                    <div className="col-sm-12 p-0 mb-20 pt-1">
                                      <div className="col-12  p-0">
                                        <Link
                                          href={
                                            Boolean(view_btn)
                                              ? router?.asPath +
                                                "/" +
                                                item?.slug
                                              : `/${slugs?.categorySlug}/${
                                                  slugs?.year
                                                }/${slugs?.make}/${
                                                  slugs?.model
                                                }/${
                                                  slugs?.body != ""
                                                    ? slugs?.body + "/"
                                                    : ""
                                                }${item?.slug}`
                                          }
                                          onClick={(e) =>
                                            !Boolean(e?.nativeEvent?.ctrlKey)
                                              ? setLoader(true)
                                              : ""
                                          }
                                        >
                                          <h3 className=" m-0">
                                            {productTitle?.product_name_prefix +
                                              " " +
                                              translate("for") +
                                              " " +
                                              productTitle?.year +
                                              " " +
                                              productTitle?.make_name +
                                              " " +
                                              productTitle?.model_name}{" "}
                                            - {productvalues}
                                          </h3>
                                        </Link>
                                      </div>

                                      <div className="row">
                                        <div className="col-sm-6 text-center">
                                          <Link
                                            href={
                                              Boolean(view_btn)
                                                ? router?.asPath +
                                                  "/" +
                                                  item?.slug
                                                : `/${slugs?.categorySlug}/${
                                                    slugs?.year
                                                  }/${slugs?.make}/${
                                                    slugs?.model
                                                  }/${
                                                    slugs?.body != ""
                                                      ? slugs?.body + "/"
                                                      : ""
                                                  }${item?.slug}`
                                            }
                                            onClick={(e) =>
                                              !Boolean(e?.nativeEvent?.ctrlKey)
                                                ? setLoader(true)
                                                : ""
                                            }
                                          >
                                            <LazyLoad
                                              height={"100%"}
                                              offset={300}
                                            >
                                              <img
                                                style={{
                                                  width: "100%",
                                                  maxWidth: "350px",
                                                }}
                                                className="custom-lazy loaded"
                                                src={
                                                  storeData?.image_path +
                                                  "fit-in/700x700/" +
                                                  item?.image
                                                }
                                                data-src={
                                                  storeData?.image_path +
                                                  "fit-in/700x700/" +
                                                  item?.image
                                                }
                                                alt={item?.product_name}
                                                title={item?.product_name}
                                              />
                                            </LazyLoad>
                                          </Link>
                                        </div>

                                        <div className="col-sm-6">
                                          <div className="col-sm-12">
                                            <b className="price-figure">
                                              {/* {"$"} */}
                                              {item?.prices?.price || 0}{" "}
                                            </b>
                                          </div>
                                          <div className="col-sm-12">
                                            <div className="price1">
                                              {translate("regular_price")}:{" "}
                                              <span className="btn-price1">
                                                <b>
                                                  {/* {"$"} */}
                                                  {item?.prices
                                                    ?.regular_price || 0}
                                                </b>
                                              </span>
                                              <br />
                                              {translate("you_save")}{" "}
                                              <span className="btn-price1">
                                                <b>
                                                  {/* {"$"} */}
                                                  {item?.prices?.save_price ||
                                                    "0"}
                                                </b>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-12 star-rating-div-left xs-nopad">
                                      <div className="row">
                                        <div className="col-sm-6 col-12">
                                          <div
                                            className="row"
                                            style={{
                                              margin: "-5px",
                                              fontSize: "13px",
                                            }}
                                          >
                                            <div className="col-sm-12 col-6">
                                              <span>
                                                <i className="colorgreen fa fa-check-square"></i>
                                              </span>
                                              &nbsp;{" "}
                                              {translate("free_Shipping")}
                                            </div>
                                            <div className="col-sm-12 col-6">
                                              <span>
                                                <i className="colorgreen fa fa-check-square"></i>
                                              </span>
                                              &nbsp; {translate("instock")}
                                            </div>
                                            <div className="col-sm-12 col-6">
                                              <span>
                                                <i className="colorgreen fa fa-check-square"></i>
                                              </span>
                                              &nbsp;{" "}
                                              {translate(
                                                "shipssamebusinessday"
                                              )}
                                            </div>
                                            <div className="col-sm-12 col-6">
                                              <span>
                                                <i className="colorgreen fa fa-check-square"></i>
                                              </span>
                                              &nbsp;{" "}
                                              {translate("guaranteedfit")}
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className="col-sm-6 col-12 text-left xs-mt-10"
                                          style={{ width: "100%" }}
                                        >
                                          {item?.attribute_group?.map(
                                            (pattributes) =>
                                              pattributes?.name === "rating" &&
                                              pattributes?.attributes?.map(
                                                (ptype) => (
                                                  <div
                                                    key={ptype?._id + "fsms"}
                                                    className="star-rating"
                                                    style={{ fontSize: "14px" }}
                                                  >
                                                    <div
                                                      style={{
                                                        display: "inline-block",
                                                        width: "50%",
                                                        textAlign: "left",
                                                      }}
                                                    >
                                                      {ptype?.name}
                                                    </div>{" "}
                                                    &nbsp;
                                                    <span className="star-value">
                                                      {Boolean(
                                                        parseFloat(ptype?.value)
                                                      ) ? (
                                                        <>
                                                          {[
                                                            ...Array(
                                                              parseInt(
                                                                ptype?.value
                                                              )
                                                            ),
                                                          ]?.map((st, i) => (
                                                            <span
                                                              className="fa fa-star"
                                                              key={i + "fsup"}
                                                            />
                                                          ))}
                                                          {[
                                                            ...Array(
                                                              5 -
                                                                parseInt(
                                                                  ptype?.value
                                                                )
                                                            ),
                                                          ]?.map((st, i) => (
                                                            <span
                                                              className="fa fa-star-o"
                                                              key={i + "nfsup"}
                                                            />
                                                          ))}
                                                          {Boolean(
                                                            ptype?.value.includes(
                                                              "+"
                                                            )
                                                          ) && (
                                                            <span className="fa fa-plus-square text-seagreen" />
                                                          )}
                                                        </>
                                                      ) : (
                                                        <span>
                                                          {ptype?.value}
                                                        </span>
                                                      )}
                                                    </span>
                                                  </div>
                                                )
                                              )
                                          )}
                                          <br />
                                          <Link
                                            onClick={(e) =>
                                              !Boolean(e?.nativeEvent?.ctrlKey)
                                                ? setLoader(true)
                                                : ""
                                            }
                                            href={
                                              Boolean(view_btn)
                                                ? router?.asPath +
                                                  "/" +
                                                  item?.slug
                                                : `/${slugs?.categorySlug}/${
                                                    slugs?.year
                                                  }/${slugs?.make}/${
                                                    slugs?.model
                                                  }/${
                                                    slugs?.body != ""
                                                      ? slugs?.body + "/"
                                                      : ""
                                                  }${item?.slug}`
                                            }
                                            className="btn btn-primary w-100 mb-2 "
                                            role="button"
                                          >
                                            {translate("view_details")}
                                          </Link>
                                          <br />
                                          <a
                                            onClick={(e) =>
                                              addToCartOpt(
                                                item?.product_id,
                                                item?.product_name
                                              )
                                            }
                                            className="btn btn-success w-100 btn-addtocart text-white "
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
                              );
                            })}
                          </div>
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
          <div className="container" id="scrollData">
            <div className="inner-wrap no-padding">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href={"/" + router?.query?.category}>
                      {productTitle?.category_name}
                    </Link>
                  </li>

                  {Boolean(istilesExist) && (
                    <li className="breadcrumb-item">
                      <a>{productTitle?.tiles_name}</a>
                    </li>
                  )}

                  {!Boolean(istilesExist) && (
                    <>
                      <li className="breadcrumb-item">
                        <Link
                          href={
                            "/" +
                            router?.query?.category +
                            "/" +
                            router?.query?.year
                          }
                        >
                          {productTitle?.year}
                        </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link
                          href={
                            "/" +
                            router?.query?.category +
                            "/" +
                            router?.query?.year +
                            "/" +
                            router?.query?.make
                          }
                        >
                          {productTitle?.make_name}
                        </Link>
                      </li>
                      {!Boolean(isBodyExist) && (
                        <>
                          <li className="breadcrumb-item">
                            <Link
                              href={
                                "/" +
                                router?.query?.category +
                                "/" +
                                router?.query?.year +
                                "/" +
                                router?.query?.make +
                                "/" +
                                router?.query?.model
                              }
                            >
                              {productTitle?.model_name}
                            </Link>
                          </li>
                          <li className="breadcrumb-item">
                            <a>{productTitle?.body_name}</a>
                          </li>
                        </>
                      )}

                      {Boolean(isBodyExist) && (
                        <li className="breadcrumb-item">
                          <a> {productTitle?.model_name}</a>
                        </li>
                      )}
                    </>
                  )}
                </ol>
              </nav>

              <div id="notification"></div>
              <div className="pricing-page-wrap" id="pricing-inr">
                <h1 style={{ textAlign: "center" }}>
                  {Boolean(istilesExist) &&
                    Boolean(categoryData?.length) &&
                    categoryData[0]?.details?.meta_title}
                  {!Boolean(istilesExist) &&
                    productTitle?.category_name +
                      " " +
                      translate("for") +
                      " " +
                      productTitle?.year +
                      " " +
                      productTitle?.make_name +
                      " " +
                      productTitle?.model_name}
                </h1>
                <div className="col-sm-12 col-md-12">
                  <div className="panel panel-default">
                    <div className="panel-body product-list1">
                      <div className="container-fluid">
                        {productData?.map((item) => {
                          const a = item?.attribute_group?.find(
                            (data) => data?.name == "category"
                          );
                          const b = a?.attributes?.find(
                            (data) => data?.name == "edition"
                          );
                          if (b?.value) {
                            productvalues = b?.value;
                          }
                          return (
                            <Fragment key={item?._id + "dt"}>
                              <div className="row">
                                <div className="col-md-9 col-sm-12 p-0 mb-20 pt-1">
                                  <div className="col-12 mb-30 p-0">
                                    <Link
                                      onClick={(e) =>
                                        !Boolean(e?.nativeEvent?.ctrlKey)
                                          ? setLoader(true)
                                          : ""
                                      }
                                      href={
                                        Boolean(view_btn)
                                          ? router?.asPath + "/" + item?.slug
                                          : `/${slugs?.categorySlug}/${
                                              slugs?.year
                                            }/${slugs?.make}/${slugs?.model}/${
                                              slugs?.body != ""
                                                ? slugs?.body + "/"
                                                : ""
                                            }${item?.slug}`
                                      }
                                    >
                                      <h2>
                                        {Boolean(istilesExist) &&
                                          productTitle?.tiles_name}
                                        {!Boolean(istilesExist) &&
                                          productTitle?.product_name_prefix +
                                            " " +
                                            translate("for") +
                                            " " +
                                            productTitle?.year +
                                            " " +
                                            productTitle?.make_name +
                                            " " +
                                            productTitle?.model_name}{" "}
                                        - {productvalues}
                                      </h2>
                                    </Link>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-4 col-sm-6 text-center">
                                      <Link
                                        onClick={(e) =>
                                          !Boolean(e?.nativeEvent?.ctrlKey)
                                            ? setLoader(true)
                                            : ""
                                        }
                                        href={
                                          Boolean(view_btn)
                                            ? router?.asPath + "/" + item?.slug
                                            : `/${slugs?.categorySlug}/${
                                                slugs?.year
                                              }/${slugs?.make}/${
                                                slugs?.model
                                              }/${
                                                slugs?.body != ""
                                                  ? slugs?.body + "/"
                                                  : ""
                                              }${item?.slug}`
                                        }
                                      >
                                        <LazyLoad height={"100%"} offset={300}>
                                          <img
                                            style={{ maxWidth: "100%" }}
                                            className="custom-lazy loaded"
                                            src={
                                              storeData?.image_path +
                                              "fit-in/700x700/" +
                                              item?.image
                                            }
                                            data-src={
                                              storeData?.image_path +
                                              "fit-in/700x700/" +
                                              item?.image
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
                                      {Boolean(item?.prices?.vat) && (
                                        <div
                                          className="mb-1 col-sm-12"
                                          style={{ marginTop: "-10px" }}
                                        >
                                          (Incl. VAT)
                                        </div>
                                      )}
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
                                        &nbsp; {translate("guaranteedfit")}
                                      </div>
                                    </div>
                                    <div className="col-sm-6 col-md-12  text-center">
                                      {item?.attribute_group?.map(
                                        (pattributes) =>
                                          //
                                          pattributes?.name === "rating" &&
                                          pattributes?.attributes?.map(
                                            (ptype) => (
                                              <div
                                                key={ptype?._id + "fsms"}
                                                className="star-rating"
                                                style={{
                                                  width: "100%",
                                                  borderBottom:
                                                    "1px dotted #f45d0178",
                                                }}
                                              >
                                                <div>{ptype?.name}</div> &nbsp;
                                                <span className="star-value">
                                                  {Boolean(
                                                    parseFloat(ptype?.value)
                                                  ) ? (
                                                    <>
                                                      {[
                                                        ...Array(
                                                          parseInt(ptype?.value)
                                                        ),
                                                      ]?.map((st, i) => (
                                                        <span
                                                          className="fa fa-star"
                                                          style={{
                                                            paddingLeft:
                                                              "2.5px",
                                                          }}
                                                          key={i + "fsup"}
                                                        />
                                                      ))}
                                                      {[
                                                        ...Array(
                                                          5 -
                                                            parseInt(
                                                              ptype?.value
                                                            )
                                                        ),
                                                      ]?.map((st, i) => (
                                                        <span
                                                          className="fa fa-star-o"
                                                          style={{
                                                            paddingLeft:
                                                              "2.5px",
                                                          }}
                                                          key={i + "nfsup"}
                                                        />
                                                      ))}
                                                      {Boolean(
                                                        ptype?.value.includes(
                                                          "+"
                                                        )
                                                      ) && (
                                                        <span
                                                          className="fa fa-plus-square text-seagreen"
                                                          style={{
                                                            paddingLeft:
                                                              "2.5px",
                                                          }}
                                                        />
                                                      )}
                                                    </>
                                                  ) : (
                                                    <span>{ptype?.value}</span>
                                                  )}
                                                </span>
                                              </div>
                                            )
                                          )
                                      )}
                                      <br />
                                      <Link
                                        onClick={(e) =>
                                          !Boolean(e?.nativeEvent?.ctrlKey)
                                            ? setLoader(true)
                                            : ""
                                        }
                                        href={
                                          Boolean(view_btn)
                                            ? router?.asPath + "/" + item?.slug
                                            : `/${slugs?.categorySlug}/${
                                                slugs?.year
                                              }/${slugs?.make}/${
                                                slugs?.model
                                              }/${
                                                slugs?.body != ""
                                                  ? slugs?.body + "/"
                                                  : ""
                                              }${item?.slug}`
                                        }
                                        className="btn btn-primary w-100 mb-2 "
                                        role="button"
                                      >
                                        {translate("view_details")}
                                      </Link>
                                      <br />
                                      <a
                                        onClick={(e) =>
                                          addToCartOpt(
                                            item?.product_id,
                                            item?.product_name
                                          )
                                        }
                                        className="btn btn-success w-100 btn-addtocart text-white "
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
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Products;
