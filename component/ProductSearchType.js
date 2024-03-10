import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setScrollStateAction,
  setStateAction,
} from "../redux/action/stateAction";
import { useRouter } from "next/router";

const ProductSearchType = ({ productData, productTitle, categoryPage }) => {
  // console.log(productData);
  const { t: translate } = useTranslation("product");
  const [value, setValue] = useState("");

  const storeData = useSelector((state) => state?.common?.store);
  const dispatch = useDispatch();
  const router = useRouter();

  const alertFunction = () => {
    // setStart(true)
    dispatch(setStateAction({ start: true }));
    alert(translate("alert_msg"));
    dispatch(setScrollStateAction({ scrollState: true }));
    // document
    //   ?.getElementById("starticon")
    //   ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const a = productData?.attribute_group?.find(
      (data) => data?.name == "category"
    );
    const b = a?.attributes?.find((data) => data?.name == "edition");
    // console.log(b?.value);
    if (b?.value) {
      setValue(b?.value);
    }
  }, [productData]);

  useEffect(() => {
    document
      ?.getElementById("scrollSearchTypeData")
      ?.scrollIntoView({ behavior: "smooth" });
  }, [productData]);

  return (
    <>
      <div className="pricing-page-wrap" id="pricing-inr">
        <h1 style={{ textAlign: "center" }}>
          {productTitle?.make_sort ? productTitle?.make_sort + " " : ""}
          {productTitle?.model_sort ? productTitle?.model_sort + " " : ""}
          {productTitle?.product_name_prefix + " - " + value}
        </h1>

        <div
          className="col-sm-12 col-md-12 px-0 px-sm-3"
          id="scrollSearchTypeData"
        >
          <div className="panel panel-default">
            <div className="panel-body product-list1">
              <div className="container-fluid">
                <div className="row product-list1-row active">
                  <span className="checkmark">
                    <i className="fa fa-check"></i>
                  </span>
                  <div className="col-md-9 col-sm-12 p-0 mb-20 pt-1">
                    <div className="col-12 mb-30 p-0">
                      <a
                        style={{ color: "#0054ff" }}
                        onClick={() => alertFunction()}
                      >
                        {console.log(categoryPage)}
                        <h2>
                          {productTitle?.product_name_prefix + " "}

                          {!Boolean(categoryPage) && translate("for") + " "}

                          {productTitle?.make_sort
                            ? productTitle?.make_sort + " "
                            : ""}
                          {productTitle?.model_sort
                            ? productTitle?.model_sort + " "
                            : ""}
                          {" - " + value}
                        </h2>
                      </a>
                    </div>
                    <div className="row">
                      <div className="col-md-4 col-sm-6 text-center">
                        <a
                          onClick={() => alertFunction()}
                          // href="https://www.carcoversfactory.com/car-covers/standard-edition-car-cover"
                        >
                          <img
                            style={{ maxWidth: "100%" }}
                            src={storeData?.image_path + productData?.image}
                            alt={productData?.product_name}
                            title={productData?.product_name}
                          />
                        </a>
                      </div>
                      <div className="col-md-4 col-sm-6">
                        <div className="col-sm-12">
                          <b className="price-figure">
                            {productData?.prices?.price || 0}{" "}
                          </b>
                        </div>
                        {Boolean(productData?.prices?.vat) && (
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
                              <b>{productData?.prices?.regular_price || 0}</b>
                            </span>
                            <br />
                            {translate("you_save")}{" "}
                            <span className="btn-price1">
                              <b>{productData?.prices?.save_price || 0}</b>
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
                          &nbsp; {translate("shipssamebusinessday")}
                        </div>
                        <div className="col-12">
                          <span>
                            <i className="colorgreen fa fa-check-square"></i>
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
                          &nbsp; {translate("shipssamebusinessday")}
                        </div>
                        <div className="col-12">
                          <span>
                            <i className="colorgreen fa fa-check-square"></i>
                          </span>
                          &nbsp; {translate("guaranteedfit")}
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-12  text-center">
                        {productData?.attribute_group?.map(
                          (pattributes) =>
                            //
                            pattributes?.name === "rating" &&
                            pattributes?.attributes?.map((ptype) => (
                              <div
                                key={ptype?._id + "fsms"}
                                className="star-rating"
                                style={{
                                  width: "100%",
                                  borderBottom: "1px dotted",
                                }}
                              >
                                <div>{ptype?.name}</div> &nbsp;
                                <span className="star-value">
                                  {Boolean(parseFloat(ptype?.value)) ? (
                                    <>
                                      {[...Array(parseInt(ptype?.value))]?.map(
                                        (st, i) => (
                                          <span
                                            className="fa fa-star"
                                            style={{
                                              paddingLeft: "2.5px",
                                            }}
                                            key={i + "fsup"}
                                          />
                                        )
                                      )}
                                      {[
                                        ...Array(5 - parseInt(ptype?.value)),
                                      ]?.map((st, i) => (
                                        <span
                                          className="fa fa-star-o"
                                          style={{
                                            paddingLeft: "2.5px",
                                          }}
                                          key={i + "nfsup"}
                                        />
                                      ))}
                                      {Boolean(ptype?.value.includes("+")) && (
                                        <span className="fa fa-plus-square text-seagreen ps-1" />
                                      )}
                                    </>
                                  ) : (
                                    <span>{ptype?.value}</span>
                                  )}
                                </span>
                              </div>
                            ))
                        )}
                        <br />
                        <p>
                          <a
                            style={{ color: "white" }}
                            onClick={() => alertFunction()}
                            // href="/standard-edition-car-cover"
                            className="btn btn-primary w-100"
                            role="button"
                          >
                            {translate("view_details")}
                          </a>
                        </p>
                        <p>
                          <a
                            style={{ color: "white" }}
                            onClick={() => alertFunction()}
                            // href=""
                            className="btn btn-success w-100 c-pointer"
                            role="button"
                          >
                            {translate("addtocart")}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div>
            </div> */}
    </>
  );
};

export default ProductSearchType;
