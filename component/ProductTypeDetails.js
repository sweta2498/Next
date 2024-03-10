import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductSearchType from "./ProductSearchType";
import {
  setScrollStateAction,
  setStateAction,
} from "../redux/action/stateAction";
import PageContentTiles from "./PageContentTiles";
import { tagConfig } from "../common_function/tagConfig";
let productvalues;

const ProductTypeDetails = ({
  productDatas,
  selectCategoryData,
  categoryPage,
}) => {
  // const { t: translate } = useTranslation("product");

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

  // console.log("=====", selectCategoryData);
  const storeData = useSelector((state) => state?.common?.store);
  const stateData = useSelector((state) => state?.state);
  const language = useSelector((state) => state?.common?.store?.language?.name);

  const [bestSellerIndex, setBestSellerIndex] = useState("");
  const [mostPopularIndex, setMostPopularIndex] = useState("");
  const [loader, setLoader] = useState(false);
  const [start, setStart] = useState(false);
  const [productSearchTypeData, setProductSearchTypeData] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();

  const productData = productDatas?.result;
  const productTitle = productDatas?.tital;
  const year = router?.query?.year;
  const vehicle_id = productDatas?.vehicle_id;
  const tiles_name = productDatas?.tital?.tiles_name;
  let data = {};
  // console.log(productTitle);
  const { t: translate } = useTranslation("product");

  const [currentStore, setCurrentStore] = useState(
    tagConfig?.find((state) => state?.store_id == storeData?.store_id) || {}
  );

  useEffect(() => {
    setCurrentStore(
      tagConfig?.find((state) => state?.store_id == storeData?.store_id)
    );
  }, [storeData]);

  // useEffect(() => {
  //   if (!router?.query?.type) {
  //     document
  //       ?.getElementById("starticon")
  //       ?.scrollIntoView({ behavior: "smooth",block:'start' });
  //   }
  // }, [router?.isReady]);

  useEffect(() => {
    for (var i = 0; i < productData?.length; i++) {
      if (productData[i]?.slug.includes(router?.query?.type)) {
        setProductSearchTypeData(productData[i]);
        break;
      }
    }
  }, [productData]);

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
              // console.log("best seller ----", i);
            } else if (ptype?.name == "most_popular_badge") {
              setMostPopularIndex(i);
              // console.log("mostpopular ----", i);
            }
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    setStart(stateData?.start);
  }, [stateData]);

  const alertFunction = () => {
    setStart(true);
    dispatch(setStateAction({ start: true }));
    alert(translate("alert_msg"));
    dispatch(setScrollStateAction({ scrollState: true }));
    // document
    //   ?.getElementById("starticon")
    //   ?.scrollIntoView({ behavior: "smooth" });
  };

  // console.log(productDatas);
  const tilesData = useSelector((state) => state?.tiles);
  // console.log(tilesData);

  return (
    <>
      <section className="page-content single-wrapper generic-cover">
        <div className="container position-relative" id="starticon">
          {Boolean(start) && (
            <img
              src={`/Images/${language}/search.png`}
              // src="https://d68my205fyswa.cloudfront.net/ccf-static-11ea-9d4c-bb03ebcb21a2_1.png"
              style={{
                position: "absolute",
                maxWidth: "264px",
                left: "32px",
                top: "-14px",
                width: "100%",
              }}
              className="generic-search-image"
            />
          )}

          <div
            className={`inner-wrap p-info ${router?.query?.type ? "pb-1" : ""}`}
          >
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a>{selectCategoryData[0]?.details?.name || "Car Covers"}</a>
                </li>
              </ol>
            </nav>

            {/* {Boolean(router?.query?.type) ? (
              // Boolean(Object.keys(productSearchTypeData)?.length) ? "ssss" : 'noo'
              Boolean(Object.keys(productSearchTypeData)?.length) ? (
                <ProductSearchType
                  productData={productSearchTypeData}
                  productTitle={productTitle}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <h2>No Products Found</h2>
                </div>
              )
            ) : (
              ""
            )} */}
            {Boolean(router?.query?.type) &&
              Boolean(Object.keys(productSearchTypeData)?.length) && (
                <ProductSearchType
                  productData={productSearchTypeData}
                  productTitle={productTitle}
                  categoryPage={categoryPage}
                />
              )}
          </div>
        </div>

        <div className="container" style={{ marginTop: "-10px" }}>
          <div className="inner-wrap no-padding pt-0 pb-0">
            <div id="notification"></div>
            <div className="pricing-page-wrap" id="pricing-inr">
              {Boolean(router?.query?.type) ? (
                <h3
                  style={{ textAlign: "left" }}
                  className="mt-5 mb-3 ml-3 text-left text-md-center"
                >
                  <span className="d-md-none">
                    {translate("browser_option") + " " + translate("for") + " "}
                    {productTitle?.make_sort
                      ? productTitle?.make_sort + " "
                      : ""}
                    {productTitle?.model_sort
                      ? productTitle?.model_sort + " "
                      : ""}
                    {productTitle?.product_name_prefix
                      ? productTitle?.product_name_prefix
                      : ""}
                    {/* Browse other options for  Acura ILX Car Cover */}
                  </span>
                  {Boolean(productData?.length) && (
                    <span className="d-none d-md-block">
                      {translate("campare_product_heading")}{" "}
                    </span>
                  )}
                </h3>
              ) : (
                <h1 style={{ textAlign: "center" }}>
                  {console.log(productTitle, "productTitle")}
                  {productTitle?.make_sort && productTitle?.make_sort}{" "}
                  {productTitle?.category_name || "Car Covers"}
                </h1>
              )}

              {/* <h1 style={{ textAlign: "center" }}>Compare with other product variants</h1> */}
              {/* <ProductTypeDetails /> */}
              {productData?.length > 2 ? (
                <section
                  className="page-content single-wrapper"
                  // onInvalid={"productData"}
                >
                  <div className="container px-0">
                    <div className="inner-wrap no-padding pt-0 pb-0 px-0">
                      <div id="notification"></div>
                      <div className="pricing-page-wrap" id="pricing-inr">
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
                              > td:nth-child(${bestSellerIndex + 2}):not(
                                :first-child
                              ) {
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
                                  productData?.map((pimage) => (
                                    <td key={pimage?._id + "image"}>
                                      <a
                                        onClick={() => alertFunction()}
                                        //  href={router?.asPath + "/" + pimage?.slug}
                                      >
                                        <img
                                          className="custom-lazy loaded"
                                          src={
                                            storeData?.image_path +
                                            pimage?.image
                                          }
                                          data-src={
                                            storeData?.image_path +
                                            pimage?.image
                                          }
                                          alt={pimage?.product_name}
                                          title={pimage?.product_name}
                                        />
                                      </a>
                                    </td>
                                  ))}
                              </tr>
                              <tr></tr>
                              <tr className="bg-white">
                                <td
                                  style={{ width: "140px", border: "none" }}
                                ></td>
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
                                                  key={
                                                    attribute?._id +
                                                    "attributes"
                                                  }
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
                                                  attribute?._id +
                                                  "attribute_category"
                                                }
                                                style={
                                                  bestSellerIndex == i ||
                                                  mostPopularIndex == i
                                                    ? {
                                                        background:
                                                          bestSellerIndex == i
                                                            ? "#2dbb4d"
                                                            : mostPopularIndex ==
                                                              i
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
                                                  <a
                                                    onClick={() =>
                                                      alertFunction()
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
                                                    // href={
                                                    //   router?.asPath + "/" + pdata?.slug
                                                    // }
                                                    style={{}}
                                                  >
                                                    {attribute?.value}
                                                  </a>
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
                                          style={{
                                            textDecorationLine: "line-through",
                                          }}
                                        >
                                          {pitem?.prices?.regular_price || 0}
                                        </b>
                                        <span className="d-none d-sm-inline">
                                          <br />
                                          {translate("you_save")}{" "}
                                          <b>
                                            {pitem?.prices?.save_price || "0"}
                                          </b>
                                        </span>
                                      </div>
                                      <br />

                                      <a
                                        style={{ color: "white" }}
                                        onClick={() => {
                                          alertFunction();
                                        }}
                                        // href={router?.asPath + "/" + pitem?.slug}
                                        className="btn btn-primary w-100 mb-2"
                                        role="button"
                                      >
                                        {translate("view_details")}
                                      </a>
                                    </td>
                                  ))}
                              </tr>

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
                                          {pdata?.attribute_group?.map(
                                            (pattributes) =>
                                              pattributes?.attributes?.map(
                                                (ptype) =>
                                                  ptype?.name ==
                                                    translate(item) && (
                                                    <Fragment
                                                      key={ptype?._id + "paa"}
                                                    >
                                                      {pattributes?.name ===
                                                        "check" && (
                                                        <i className="fa fa-check fa-lg text-success"></i>
                                                      )}
                                                      {pattributes?.name ===
                                                        "rating" && (
                                                        <span className="star-value">
                                                          {Boolean(
                                                            parseFloat(
                                                              ptype?.value
                                                            )
                                                          ) ? (
                                                            <>
                                                              {[
                                                                ...Array(
                                                                  parseInt(
                                                                    ptype?.value
                                                                  )
                                                                ),
                                                              ]?.map(
                                                                (st, i) => (
                                                                  <span
                                                                    className="fa fa-star pr-1"
                                                                    key={
                                                                      i + "fss"
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                              {[
                                                                ...Array(
                                                                  5 -
                                                                    parseInt(
                                                                      ptype?.value
                                                                    )
                                                                ),
                                                              ]?.map(
                                                                (st, i) => (
                                                                  <span
                                                                    className="fa fa-star-o pr-1"
                                                                    key={
                                                                      i + "nfss"
                                                                    }
                                                                  />
                                                                )
                                                              )}
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
                                                      )}
                                                      {pattributes?.name ===
                                                        "text" && (
                                                        <span>
                                                          {ptype?.value}
                                                        </span>
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
                                {[...Array(productData?.length)]?.map(
                                  (pt, i) => (
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
                                          &nbsp;{" "}
                                          {translate("shipssamebusinessday")}
                                        </li>
                                        <li>
                                          <span>
                                            <i className="colorgreen fa fa-check-square"></i>
                                          </span>
                                          &nbsp; {translate("guaranteedfit")}
                                        </li>
                                      </ul>
                                    </td>
                                  )
                                )}
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
                                      const premiumEdition =
                                        a?.attributes?.find(
                                          (data) =>
                                            data?.name == "best_seller_badge"
                                        );
                                      const b = a?.attributes?.find(
                                        (data) => data?.name == "edition"
                                      );
                                      if (b?.value) {
                                        productvalues = b?.value;
                                      }
                                      return (
                                        <Fragment key={item?._id + "sm"}>
                                          {!Boolean(premiumEdition) && (
                                            <>
                                              <div className="row">
                                                <div className="col-sm-12 p-0 mb-20 pt-1">
                                                  <div className="col-12  p-0">
                                                    <a
                                                      style={{
                                                        color: "#0054ff",
                                                      }}
                                                      // href={''}
                                                      // href={router?.asPath + "/" + item?.slug}
                                                      onClick={() =>
                                                        alertFunction()
                                                      }
                                                    >
                                                      <h3 className="m-0">
                                                        {productTitle?.product_name_prefix +
                                                          " " +
                                                          translate("for") +
                                                          " "}
                                                        {productTitle?.make_sort
                                                          ? productTitle?.make_sort +
                                                            " "
                                                          : ""}
                                                        {productTitle?.model_sort
                                                          ? productTitle?.model_sort +
                                                            " "
                                                          : ""}
                                                        -{" "}
                                                        {Boolean(productvalues)
                                                          ? productvalues
                                                          : ""}
                                                      </h3>
                                                    </a>
                                                  </div>

                                                  <div className="row">
                                                    <div className="col-sm-6 text-center">
                                                      <a
                                                        // href={
                                                        //   router?.asPath + "/" + item?.slug
                                                        // }
                                                        onClick={() =>
                                                          alertFunction()
                                                        }
                                                      >
                                                        <img
                                                          style={{
                                                            width: "100%",
                                                            maxWidth: "350px",
                                                          }}
                                                          className="custom-lazy loaded"
                                                          src={
                                                            storeData?.image_path +
                                                            item?.image
                                                          }
                                                          data-src={
                                                            storeData?.image_path +
                                                            item?.image
                                                          }
                                                          alt={
                                                            item?.product_name
                                                          }
                                                          title={
                                                            item?.product_name
                                                          }
                                                        />
                                                      </a>
                                                    </div>

                                                    <div className="col-sm-6">
                                                      <div className="col-sm-12">
                                                        <b className="price-figure">
                                                          {/* {"$"} */}
                                                          {item?.prices
                                                            ?.price || 0}{" "}
                                                        </b>
                                                      </div>
                                                      <div className="col-sm-12">
                                                        <div className="price1">
                                                          {translate(
                                                            "regular_price"
                                                          )}
                                                          :{" "}
                                                          <span className="btn-price1">
                                                            <b>
                                                              {/* {"$"} */}
                                                              {item?.prices
                                                                ?.regular_price ||
                                                                0}
                                                            </b>
                                                          </span>
                                                          <br />
                                                          {translate(
                                                            "you_save"
                                                          )}{" "}
                                                          <span className="btn-price1">
                                                            <b>
                                                              {/* {"$"} */}
                                                              {item?.prices
                                                                ?.save_price ||
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
                                                          {translate(
                                                            "free_Shipping"
                                                          )}
                                                        </div>
                                                        <div className="col-sm-12 col-6">
                                                          <span>
                                                            <i className="colorgreen fa fa-check-square"></i>
                                                          </span>
                                                          &nbsp;{" "}
                                                          {translate("instock")}
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
                                                          {translate(
                                                            "guaranteedfit"
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className="col-sm-6 col-12 text-left xs-mt-10"
                                                      style={{ width: "100%" }}
                                                    >
                                                      {item?.attribute_group?.map(
                                                        (pattributes) =>
                                                          pattributes?.name ===
                                                            "rating" &&
                                                          pattributes?.attributes?.map(
                                                            (ptype) => (
                                                              <div
                                                                key={
                                                                  ptype?._id +
                                                                  "fsms"
                                                                }
                                                                className="star-rating"
                                                                style={{
                                                                  fontSize:
                                                                    "14px",
                                                                }}
                                                              >
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "inline-block",
                                                                    width:
                                                                      "50%",
                                                                    textAlign:
                                                                      "left",
                                                                  }}
                                                                >
                                                                  {ptype?.name}
                                                                </div>{" "}
                                                                &nbsp;
                                                                <span className="star-value">
                                                                  {Boolean(
                                                                    parseFloat(
                                                                      ptype?.value
                                                                    )
                                                                  ) ? (
                                                                    <>
                                                                      {[
                                                                        ...Array(
                                                                          parseInt(
                                                                            ptype?.value
                                                                          )
                                                                        ),
                                                                      ]?.map(
                                                                        (
                                                                          st,
                                                                          i
                                                                        ) => (
                                                                          <span
                                                                            className="fa fa-star"
                                                                            key={
                                                                              i +
                                                                              "fsup"
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
                                                                      {[
                                                                        ...Array(
                                                                          5 -
                                                                            parseInt(
                                                                              ptype?.value
                                                                            )
                                                                        ),
                                                                      ]?.map(
                                                                        (
                                                                          st,
                                                                          i
                                                                        ) => (
                                                                          <span
                                                                            className="fa fa-star-o"
                                                                            key={
                                                                              i +
                                                                              "nfsup"
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
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
                                                                      {
                                                                        ptype?.value
                                                                      }
                                                                    </span>
                                                                  )}
                                                                </span>
                                                              </div>
                                                            )
                                                          )
                                                      )}
                                                      <br />
                                                      <a
                                                        style={{
                                                          color: "white",
                                                        }}
                                                        onClick={() =>
                                                          alertFunction()
                                                        }
                                                        // href={
                                                        //   router?.asPath + "/" + item?.slug
                                                        // }
                                                        className="btn btn-primary w-100 mb-2 "
                                                        role="button"
                                                      >
                                                        {translate(
                                                          "view_details"
                                                        )}
                                                      </a>
                                                      {/* <br />
                                            <a
                                              onClick={(e) =>
                                                addToCartOpt(
                                                  item?._id,
                                                  item?.product_name
                                                )
                                              }
                                              className="btn btn-success w-100 btn-addtocart text-white "
                                              role="button"
                                            >
                                              {translate("addtocart")}
                                            </a> */}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <hr />
                                            </>
                                          )}
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
                  <div className="container">
                    <div className="inner-wrap no-padding pt-0 pb-0">
                      <div id="notification"></div>
                      <div className="pricing-page-wrap" id="pricing-inr">
                        <div className="col-sm-12 col-md-12">
                          <div className="panel panel-default">
                            <div className="panel-body product-list1">
                              <div className="container-fluid">
                                {productData?.map((item) => {
                                  const a = item?.attribute_group?.find(
                                    (data) => data?.name == "category"
                                  );
                                  // console.log("aaaaaa",a);
                                  const b = a?.attributes?.find(
                                    (data) => data?.name == "edition"
                                  );
                                  if (b?.value) {
                                    productvalues = b?.value;
                                  }
                                  // console.log(productTitle);
                                  return (
                                    <Fragment>
                                      <div className="row">
                                        <div className="col-md-9 col-sm-12 p-0 mb-20 pt-1">
                                          <div className="col-12 mb-30 p-0"></div>

                                          <div className="row">
                                            <div className="col-md-4 col-sm-6 text-center">
                                              <a
                                                onClick={() => alertFunction()}
                                                // href={router?.asPath + "/" + item?.slug}
                                              >
                                                <img
                                                  style={{ maxWidth: "100%" }}
                                                  className="custom-lazy loaded"
                                                  src={
                                                    storeData?.image_path +
                                                    item?.image
                                                  }
                                                  data-src={
                                                    storeData?.image_path +
                                                    item?.image
                                                  }
                                                  alt={item?.product_name}
                                                  title={item?.product_name}
                                                />
                                              </a>
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
                                                      {item?.prices
                                                        ?.regular_price || 0}
                                                    </b>
                                                  </span>
                                                  <br />
                                                  {translate("you_save")}{" "}
                                                  <span className="btn-price1">
                                                    <b>
                                                      {" "}
                                                      {item?.prices
                                                        ?.save_price || "0"}
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
                                                &nbsp;{" "}
                                                {translate("free_Shipping")}
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
                                                {translate(
                                                  "shipssamebusinessday"
                                                )}
                                              </div>
                                              <div className="col-12">
                                                <span>
                                                  <i className="colorgreen fa fa-check-square">
                                                    {" "}
                                                  </i>
                                                </span>
                                                &nbsp; &nbsp;{" "}
                                                {translate("guaranteedfit")}
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
                                                &nbsp;{" "}
                                                {translate("free_Shipping")}
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
                                                {translate(
                                                  "shipssamebusinessday"
                                                )}
                                              </div>
                                              <div className="col-12">
                                                <span>
                                                  <i className="colorgreen fa fa-check-square"></i>
                                                </span>
                                                &nbsp;
                                                {translate("guaranteedfit")}
                                              </div>
                                            </div>
                                            <div className="col-sm-6 col-md-12  text-center">
                                              {item?.attribute_group?.map(
                                                (pattributes) =>
                                                  //
                                                  pattributes?.name ===
                                                    "rating" &&
                                                  pattributes?.attributes?.map(
                                                    (ptype) => (
                                                      <div
                                                        key={
                                                          ptype?._id + "fsms"
                                                        }
                                                        className="star-rating"
                                                        style={{
                                                          width: "100%",
                                                          borderBottom:
                                                            "1px dotted #f45d0178",
                                                        }}
                                                      >
                                                        <div>{ptype?.name}</div>{" "}
                                                        &nbsp;
                                                        <span className="star-value">
                                                          {Boolean(
                                                            parseFloat(
                                                              ptype?.value
                                                            )
                                                          ) ? (
                                                            <>
                                                              {[
                                                                ...Array(
                                                                  parseInt(
                                                                    ptype?.value
                                                                  )
                                                                ),
                                                              ]?.map(
                                                                (st, i) => (
                                                                  <span
                                                                    className="fa fa-star"
                                                                    style={{
                                                                      paddingLeft:
                                                                        "2.5px",
                                                                    }}
                                                                    key={
                                                                      i + "fsup"
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                              {[
                                                                ...Array(
                                                                  5 -
                                                                    parseInt(
                                                                      ptype?.value
                                                                    )
                                                                ),
                                                              ]?.map(
                                                                (st, i) => (
                                                                  <span
                                                                    className="fa fa-star-o"
                                                                    style={{
                                                                      paddingLeft:
                                                                        "2.5px",
                                                                    }}
                                                                    key={
                                                                      i +
                                                                      "nfsup"
                                                                    }
                                                                  />
                                                                )
                                                              )}
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
                                              <a
                                                style={{ color: "white" }}
                                                onClick={() => alertFunction()}
                                                // href={router?.asPath + "/" + item?.slug}
                                                className="btn btn-primary w-100 mb-2 "
                                                role="button"
                                              >
                                                {translate("view_details")}
                                              </a>
                                              <br />
                                              {/* <a
                                        onClick={(e) =>
                                          addToCartOpt(
                                            item?._id,
                                            item?.product_name
                                          )
                                        }
                                        className="btn btn-success w-100 btn-addtocart text-white "
                                        role="button"
                                      >
                                        {translate("addtocart")}
                                      </a> */}
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
            </div>
          </div>
        </div>

        {Array?.isArray(tilesData) && Boolean(tilesData?.length) && (
          <div style={{ marginTop: "-30px" }}>
            <PageContentTiles
              tilesData={tilesData}
              tilesTitle={selectCategoryData[0]?.details?.tiles_title}
            />
          </div>
        )}
      </section>
    </>
  );
};

export default ProductTypeDetails;
