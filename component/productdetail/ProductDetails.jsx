import React, { Fragment } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { url } from "../../api/Apiservices";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { setCartAction } from "../../redux/action/cartAction";
import axiosApi from "../../axios_instance";
import Script from "next/script";
import moment from "moment";
import Head from "next/head";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Pagination from "react-bootstrap/Pagination";
import CustomerCovers from "../CustomerCovers";
import { timeZone } from "../../common_function/functions";
import { setToast } from "../../redux/action/toastAction";
import ReactPaginate from "react-paginate";
import LazyLoad from "react-lazy-load";

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <div className="customarrow">
    <button
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      Previous
    </button>
  </div>
);
const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <div className="customarrow">
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      Next
    </button>
  </div>
);

const currentdate = timeZone("moscow");
const hour = currentdate?.getHours();
const minutes = currentdate?.getMinutes();

const ProductDetails = ({
  singleProduct = {},
  cartID,
  isTilesExist,
  isBodyExist,
  isFilterExist,
  isDirectCategoryExist,
  fakeproduct,
}) => {
  const language = useSelector((state) => state?.common?.store?.language?.name);
  const storeData = useSelector((state) => state?.common?.store);
  const { t: translate } = useTranslation("viewdetails");
  const router = useRouter();
  const dispatch = useDispatch();
  // console.log("afajbsdkjabd", singleProduct);

  const vehicle_id = singleProduct?.vehicle_id;

  const [productDetail, setProductDetail] = useState(
    Boolean(singleProduct?.result) ? singleProduct?.result[0] : {}
  );

  const faq = Boolean(singleProduct?.result)
    ? singleProduct?.result[0]?.faqs
    : [];
  const review = Boolean(singleProduct?.result)
    ? singleProduct?.result[0]?.review
    : [];
  const tiles_name = singleProduct?.tital?.tiles_name;

  const [productTitle, setProductTitle] = useState(singleProduct?.tital || {});

  const [value, setValue] = useState("");
  const [productReviews, setProductReviews] = useState({});
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(10);
  const [total, setTotals] = useState(1);
  const [currentPage, setCurrentPage] = useState("");
  const [title, setTitle] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [quantity, setQuantity] = useState("" || 1);
  const [email, setEmail] = useState("");
  const [deliveryData, setDeliveryDate] = useState([]);
  const [reviewPagination, setReviewPagination] = useState({});
  const [reviewLoader, setReviewLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [altTitle, setAltTitle] = useState(
    (Boolean(isTilesExist) ? productTitle?.tiles_name + " - " + value : "") +
      (Boolean(isDirectCategoryExist) ? productTitle?.product_name : "") +
      (!Boolean(isTilesExist)
        ? !Boolean(isDirectCategoryExist)
          ? productTitle?.product_name_prefix +
            " " +
            translate("for") +
            " " +
            productTitle?.year +
            " " +
            productTitle?.make_name +
            " " +
            productTitle?.model_name +
            " "
          : ""
        : "") +
      (!Boolean(isTilesExist)
        ? !Boolean(isDirectCategoryExist)
          ? productTitle?.body_name
          : ""
        : "") +
      (!Boolean(isTilesExist)
        ? !Boolean(isDirectCategoryExist)
          ? " - " + value
          : ""
        : "")
  );

  const categoryid = router.query.slug;
  const category_slug = router.query.category;
  const year = router.query.year;
  let data = {};

  useEffect(() => {
    // reviewData(page);
    deliveryDateFun();
  }, []);

  const deliveryDateFun = () => {
    setDeliveryDate([]);
    axiosApi
      .get(`cart/delivery_data`)
      .then((response) => {
        // console.log(response);
        // dispatch(setCartAction(cart_id));
        setDeliveryDate(
          response?.data?.result?.find((item) => item?.Delivery_fee === 0)
        );
        // cartTotals();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (reviewLoader) {
      reviewData(page);
    }
  }, [reviewLoader]);

  const reviewData = (page) => {
    const product_id = productDetail?.product_id;
    axiosApi
      .post(`reviews?page=${page}&items=${items}`, { product_id })
      .then((response) => {
        // console.log(response?.data);
        setProductReviews(response?.data);
        setReviewLoader(false);
        setTotals(response?.data?.pagination?.pages);
        setCurrentPage(response?.data?.pagination?.page);
        setReviewPagination(response?.data?.pagination);
      })
      .catch((err) => {
        setReviewLoader(false);
      });
  };
  // console.log(singleProduct);

  const addToCartOpt = (product_id, product_name) => {
    setLoader(true);
    if (fakeproduct) {
      data = {
        product_id,
        quantity: quantity,
        // category_slug: productDetail?.category?.slug,
        category_id: singleProduct?.result[0]?.category?.category_id,
        isFake: true,
      };
    }
    if (isTilesExist) {
      data = {
        product_id,
        product_name,
        tiles_name,
        quantity: quantity,
        // category_slug: router?.query?.category,
        category_id: singleProduct?.category_id,
        // tiles_slug: router?.query?.year,
        tiles_id: singleProduct?.tile_image_id,
        email,
      };
    } else if (isFilterExist === true) {
      data = {
        product_id,
        year,
        vehicle_id,
        quantity: quantity,
        // category_slug: router?.query?.category,
        category_id: singleProduct?.category_id,
        email,
      };
    } else if (isFilterExist === false) {
      data = {
        product_id,
        quantity: "1",
        // category_slug: router?.query?.category,
        category_id: singleProduct?.category_id,
        email,
      };
    } else if (isDirectCategoryExist) {
      data = {
        product_id,
        quantity: quantity,
        // category_slug: router?.query?.category,
        category_id: singleProduct?.category_id,
        email,
      };
    }
    if (quantity >= 1 && quantity <= 100) {
      axiosApi
        .post(`cart/add`, data)
        .then((res) => {
          if (res?.data?.status) {
            // router?.push("/cart?cart_id=" + res?.data?.result);
            // dispatch(setCartAction(res?.data?.result));
            dispatch(setCartAction({ cartID: res?.data?.result }));
            // router?.push("/cart?cart_id=" + res?.data?.result);
            if (
              (process?.env?.NEXT_PUBLIC_ENV == "production" ||
                (router?.isReady &&
                  router?.query?.hasOwnProperty("run_tags"))) &&
              // typeof window.klaviyo !== "undefined" &&
              typeof klaviyoAddedToCart !== "undefined"
            ) {
              klaviyoAddedToCart(res?.data?.all_cart, res?.data?.result);
            }
            router?.push("/cart?cart_id=" + res?.data?.result);
          }
        })
        .catch((err) => {
          // console.log(err);
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
      setQuantity(1);
      setLoader(false);
    }
  };

  let productName = "";
  var klaviyoAddedToCart = function (response, cart_id) {
    // console.log('it"s called =======>>>>>>>>>', response);
    try {
      const products = response;
      const products_array = [];
      const products_categories = [];
      const products_names = [];

      // const cartTotal = products?.total;
      const cartTotal = products?.find((ct) => ct?.key == "total")?.value || 0;
      products.forEach(function (product, i) {
        productName = "";
        if (Object.keys(product?.slugs)?.length) {
          if (product?.slugs?.body) {
            productName =
              product?.slugs?.category_name +
              " " +
              product?.slugs?.year +
              " " +
              product?.slugs?.make_name +
              " " +
              product?.slugs?.model_name +
              " " +
              product?.slugs?.body_name +
              " - " +
              product?.edition;
          } else if (product?.slugs?.model_name) {
            productName =
              product?.slugs?.category_name +
              " " +
              product?.slugs?.year +
              " " +
              product?.slugs?.make_name +
              " " +
              product?.slugs?.model_name +
              " - " +
              product?.edition;
          }
        } else if (Object.keys(product?.tiles_slug)?.length) {
          if ([3, 4]?.includes(product?.tiles_slug?.category_id)) {
            productName = product?.product_name;
          } else
            productName =
              product?.tiles_slug?.tiles_name + " - " + product?.edition;
        } else {
          productName = product?.edition;
        }

        const vehicle_id = product?.vehicle_id
          ? product?.vehicle_id
          : product?.tiles_slug?.tiles_id
          ? "tile_id_" + product?.tiles_slug?.tiles_id
          : "";
        const category_id = product?.slugs?.category_id
          ? product?.slugs?.category_id
          : [3, 4]?.includes(product?.tiles_slug?.category_id)
          ? ""
          : product?.tiles_slug?.category_id;
        const skuName =
          (Boolean(vehicle_id) ? vehicle_id + "_" : "") +
          (Boolean(category_id) ? category_id + "_" : "");
        // console.log("=-=-=-=-sku=-=-=-=-=-=-=",Boolean(skuName) ? (skuName + "_" +product?.product_id) : product?.product_id?.toString());
        products_array.push({
          ProductID: product?.product_id,
          SKU: Boolean(skuName)
            ? skuName + product?.product_id
            : product?.product_id?.toString(),
          ProductName: productName || product?.edition,
          Quantity: product?.quantity,
          ItemPrice: Number(
            product?.price
              ?.replace(storeData?.currency?.symbol, "")
              .replace("", "") || 0
          ),
          RowTotal: Number(
            product?.total
              ?.replace(storeData?.currency?.symbol, "")
              .replace("", "") || 0
          ),
          ProductURL: window.location.origin + router?.asPath,
          ImageURL: storeData?.image_path + product?.image,
          ProductCategories: product?.slugs?.category_name
            ? [product?.slugs?.category_name]
            : product?.tiles_slug?.category_name
            ? [product?.tiles_slug?.category_name]
            : "",
        });

        if (
          products_categories.indexOf(product?.slugs?.category_name) === -1 ||
          products_categories.indexOf(product?.tiles_slug?.category_name) === -1
        ) {
          if (product?.slugs?.category_name) {
            products_categories?.push(product?.slugs?.category_name);
          } else if (product?.tiles_slug?.category_name) {
            products_categories?.push(product?.tiles_slug?.category_name);
          }
        }
        if (products_names.indexOf(product?.product_name) === -1) {
          products_names?.push(productName);
        }
      });

      const last_added_product = products[products.length - 1];
      let lastProductName = "";
      if (Object.keys(last_added_product?.slugs)?.length) {
        if (last_added_product?.slugs?.body) {
          lastProductName =
            last_added_product?.slugs?.category_name +
            " " +
            last_added_product?.slugs?.year +
            " " +
            last_added_product?.slugs?.make_name +
            " " +
            last_added_product?.slugs?.model_name +
            " " +
            last_added_product?.slugs?.body_name +
            " - " +
            last_added_product?.edition;
        } else if (last_added_product?.slugs?.model_name) {
          lastProductName =
            last_added_product?.slugs?.category_name +
            " " +
            last_added_product?.slugs?.year +
            " " +
            last_added_product?.slugs?.make_name +
            " " +
            last_added_product?.slugs?.model_name +
            " - " +
            last_added_product?.edition;
        }
      } else if (Object.keys(last_added_product?.tiles_slug)?.length) {
        if ([3, 4]?.includes(last_added_product?.tiles_slug?.category_id)) {
          lastProductName = last_added_product?.product_name;
        } else
          lastProductName =
            last_added_product?.tiles_slug?.tiles_name +
            " - " +
            last_added_product?.edition;
      } else {
        lastProductName = last_added_product?.edition;
      }

      const last_added_product_vehicle_id = last_added_product?.vehicle_id
        ? last_added_product?.vehicle_id
        : last_added_product?.tiles_slug?.tiles_id
        ? "tile_id_" + last_added_product?.tiles_slug?.tiles_id
        : "";
      const last_added_product_category_id = last_added_product?.slugs
        ?.category_id
        ? last_added_product?.slugs?.category_id
        : [3, 4]?.includes(last_added_product?.tiles_slug?.category_id)
        ? ""
        : last_added_product?.tiles_slug?.category_id;
      const last_added_product_skuName =
        (Boolean(last_added_product_vehicle_id)
          ? last_added_product_vehicle_id + "_"
          : "") +
        (Boolean(last_added_product_category_id)
          ? last_added_product_category_id + "_"
          : "");

      var cartDatatoSend = {
        $value: last_added_product?.total,
        AddedItemProductName:
          lastProductName || last_added_product?.product_name,
        AddedItemProductID: last_added_product?.product_id,
        AddedItemSKU: Boolean(last_added_product_skuName)
          ? last_added_product_skuName + last_added_product?.product_id
          : last_added_product?.product_id?.toString(),
        AddedItemCategories: products_categories,
        AddedItemImageURL: storeData?.image_path + last_added_product?.image,
        AddedItemURL: window.location.origin + router?.asPath,
        AddedItemPrice: Number(
          last_added_product?.price
            ?.replace(storeData?.currency?.symbol, "")
            .replace("", "")
        ),
        AddedItemQuantity: last_added_product?.quantity,
        ItemNames: products_names,
        CheckoutURL:
          cart_id && window.location.origin + `/cart?cart_id=${cart_id}`,
        CartURL: cart_id && window.location.origin + `/cart?cart_id=${cart_id}`,
        Items: products_array,
      };

      if (typeof window.geq !== "undefined") {
        // for retention
        window.geq.addToCart(cartDatatoSend);
      }
      if (typeof window.klaviyo !== "undefined") {
        window.klaviyo.push([
          "track",
          "Added to Cart",
          cartDatatoSend,
          function () {
            if (typeof cart_id !== "undefined") {
              router?.push("/cart?cart_id=" + cart_id);
              return false;
            }
          },
        ]);
      }
      // console.log(cartDatatoSend);
    } catch (e) {
      // console.log(e);
    }
    router?.push("/cart?cart_id=" + cart_id);
  };

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  });

  const settingsMain = {
    responsiveClass: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: ".slider-nav",
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: true,
        },
      },
    ],
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };

  const settingsThumbs = {
    responsiveClass: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    dots: false,
    centerMode: false,
    swipeToSlide: true,
    focusOnSelect: true,
    centerPadding: "2px",
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };
  // console.log(productDetail);

  useEffect(() => {
    const a = productDetail?.attribute_group?.find(
      (data) => data?.name == "category"
    );
    const b = a?.attributes?.find((data) => data?.name == "edition");
    if (b?.value) {
      setValue(b?.value);
      setAltTitle(
        (Boolean(isTilesExist)
          ? productTitle?.tiles_name + " - " + b?.value
          : "") +
          (Boolean(isDirectCategoryExist) ? productTitle?.product_name : "") +
          (!Boolean(isTilesExist)
            ? !Boolean(isDirectCategoryExist)
              ? productTitle?.product_name_prefix +
                " " +
                translate("for") +
                " " +
                productTitle?.year +
                " " +
                productTitle?.make_name +
                " " +
                productTitle?.model_name +
                " "
              : ""
            : "") +
          (!Boolean(isTilesExist)
            ? !Boolean(isDirectCategoryExist)
              ? productTitle?.body_name
              : ""
            : "") +
          (!Boolean(isTilesExist)
            ? !Boolean(isDirectCategoryExist)
              ? " - " + b?.value
              : ""
            : "")
      );
    }
  }, [singleProduct]);

  // useEffect(() => {
  //   var sa_review_count = 5;
  //   var sa_date_format = "F j, Y";
  //   function saLoadScript(src) {
  //     var js = window.document.createElement("script");
  //     js.src = src;
  //     js.type = "text/javascript";
  //     document.getElementsByTagName("head")[0].appendChild(js);
  //   }
  //   saLoadScript("//www.shopperapproved.com/merchant/8426.js");
  // }, [singleProduct]);

  // useEffect(()=>{
  //   // console.log(typeof window.klaviyo,"=-=-=-=");
  //   const form = document.getElementById("email");
  //   form.addEventListener("focusout", (event) => {
  //     validateEmail(email)
  //     if (validateEmail(email)) {
  //       window.klaviyo.identify({
  //         '$email': email
  //       }, function() {
  //         if (typeof callbackProductViewed === 'function') {
  //           callbackProductViewed();
  //         }
  //       });
  //     }
  //     // console.log(validateEmail(email),Boolean(validateEmail(email)));
  //   });
  // },[email])

  function validateEmail(email) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }
  let pName = "";
  function callbackProductViewed() {
    if (!Boolean(fakeproduct)) {
      if (!Boolean(isTilesExist)) {
        if (!Boolean(isDirectCategoryExist)) {
          if (!isBodyExist) {
            pName =
              productTitle?.product_name_prefix +
              " " +
              translate("for") +
              " " +
              productTitle?.year +
              " " +
              productTitle?.make_name +
              " " +
              productTitle?.model_name +
              " " +
              productTitle?.body_name +
              " - " +
              value;
          } else {
            pName =
              productTitle?.product_name_prefix +
              " " +
              translate("for") +
              " " +
              productTitle?.year +
              " " +
              productTitle?.make_name +
              " " +
              productTitle?.model_name +
              " - " +
              value;
          }
        } else {
          pName = productTitle?.product_name;
        }
      } else {
        pName = productTitle?.tiles_name + " - " + value;
      }
    } else {
      pName = productDetail?.product_name;
    }

    if (typeof window.klaviyo !== "undefined") {
      var viewedProductItem = {
        ProductName: pName || productDetail?.product_name,
        ProductID: productDetail?.product_id,
        SKU: productDetail?._id,
        Categories: [productTitle?.category_name],
        ImageURL: storeData?.image_path + productDetail?.image,
        URL: window.location.origin + router?.asPath,
        Brand: productTitle?.make_name || "",
        Price:
          Number(
            productDetail?.prices?.price?.replace(
              storeData?.currency?.symbol,
              ""
            )
          ) || 0,
        CompareAtPrice: "",
        Variant: value || productDetail?.product_name || "",
      };
      window.klaviyo.push(["track", "Viewed Product", viewedProductItem]);
      window.klaviyo.push([
        "trackViewedItem",
        {
          Title: productDetail?.product_name,
          ItemId: productDetail?.product_id,
          Categories: [productTitle?.category_name],
          ImageUrl: storeData?.image_path + productDetail?.image,
          Url: window.location.origin + router?.asPath,
          Metadata: {
            Brand: productTitle?.make_name || "",
            Variant: value || productDetail?.product_name || "",
            Price: Number(
              productDetail?.prices?.price?.replace(
                storeData?.currency?.symbol,
                ""
              )
            ),
            CompareAtPrice: "",
          },
        },
      ]);
      // console.log("===========", viewedProductItem);
    }
  }

  const handlePageClick = (event) => {
    setPage(event?.selected + 1);
    reviewData(event?.selected + 1);
    document
      ?.getElementById("nav-product_review")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // if(value)
    if (Boolean(value) && Boolean(Object.keys(productTitle)?.length))
      callbackProductViewed();
  }, [value, productTitle]);

  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta
          name="language"
          content={storeData?.language?.name || "English"}
        />
        <title>
          {Boolean(singleProduct?.result) &&
            singleProduct?.result[0]?.product_name +
              ` ${translate("online_sale")} - ` +
              storeData?.store_name}
        </title>
        <meta
          name="title"
          content={
            Boolean(singleProduct?.result) &&
            singleProduct?.result[0]?.product_name
          }
        />
        <meta
          name="description"
          content={
            Boolean(singleProduct?.result) &&
            singleProduct?.result[0]?.meta_description
          }
        />
        <link rel="canonical" href={router?.asPath} />
      </Head>

      {Boolean(loader) && (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      )}

      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap p-info">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">{translate("home")}</Link>
                </li>
                {!Boolean(fakeproduct) && (
                  <>
                    <li className="breadcrumb-item">
                      <Link href={"/" + router?.query?.category}>
                        {productTitle?.category_name}
                      </Link>
                    </li>
                    {Boolean(isTilesExist) && (
                      <li className="breadcrumb-item">
                        <Link
                          href={
                            "/" +
                            router?.query?.category +
                            "/" +
                            router?.query?.year
                          }
                        >
                          {productTitle?.tiles_name}
                        </Link>
                      </li>
                    )}

                    {!Boolean(isTilesExist) &&
                      !Boolean(isDirectCategoryExist) && (
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
                          {!Boolean(isBodyExist) && (
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
                                  router?.query?.model +
                                  "/" +
                                  router?.query?.body
                                }
                              >
                                {productTitle?.body_name}
                              </Link>
                            </li>
                          )}
                        </>
                      )}

                    <li className="breadcrumb-item">
                      <a>{productTitle?.product_name}</a>
                    </li>
                  </>
                )}

                {Boolean(fakeproduct) && (
                  <li className="breadcrumb-item">
                    <a>{productDetail?.product_name || "Test Product"}</a>
                  </li>
                )}
              </ol>
            </nav>

            <div id="notification"></div>

            <h1 className="product-title">
              {Boolean(fakeproduct) && productDetail?.product_name}

              {!Boolean(fakeproduct) &&
                Boolean(isTilesExist) &&
                productTitle?.tiles_name + " - " + value}

              {!Boolean(fakeproduct) &&
                Boolean(isDirectCategoryExist) &&
                productTitle?.product_name}

              {!Boolean(fakeproduct) && (
                <>
                  {!Boolean(isTilesExist) &&
                    !Boolean(isDirectCategoryExist) &&
                    productTitle?.product_name_prefix +
                      " " +
                      translate("for") +
                      " " +
                      productTitle?.year +
                      " " +
                      productTitle?.make_name +
                      " " +
                      productTitle?.model_name +
                      " "}

                  {!Boolean(isTilesExist) &&
                    !Boolean(isDirectCategoryExist) &&
                    productTitle?.body_name}

                  {
                    !Boolean(isTilesExist) &&
                      !Boolean(isDirectCategoryExist) &&
                      " - " + value
                    //  Boolean(value)
                    //   ? value
                    //   : productTitle?.product_name
                  }
                </>
              )}
            </h1>
            {/* {console.log(productDetail)} */}

            <div className="product-content">
              <div className="row">
                <div className="col-sm entry-thumbnail">
                  <div className="carousel-wrapper">
                    <div className="col-sm entry-thumbnail px-0 pb-md-0 pb-4">
                      <div className="carousel-wrapper">
                        {Boolean(fakeproduct) && (
                          <Slider
                            // style={{ width: "370px", height: "400px" }}
                            {...settingsMain}
                          >
                            {/* <div className="slick-slide"> */}
                            <LazyLoad height="100%" offset={120}>
                              <img
                                className="slick-slide-image custom-lazy loaded"
                                src={
                                  productDetail?.f_product_image ||
                                  storeData?.image_path +
                                    productDetail?.category?.image
                                }
                                alt={productDetail?.product_name}
                                title={productDetail?.product_name}
                              />
                            </LazyLoad>
                            {/* </div> */}
                          </Slider>
                        )}
                        {!Boolean(fakeproduct) && (
                          <>
                            {!Boolean(productDetail?.images) ? (
                              <Slider
                                // style={{ width: "370px", height: "400px" }}
                                {...settingsMain}
                              >
                                {/* <div className="slick-slide"> */}
                                <LazyLoad height="100%" offset={120}>
                                  <img
                                    className="slick-slide-image custom-lazy loaded"
                                    src={
                                      storeData?.image_path +
                                      productDetail?.image
                                    }
                                    alt={altTitle}
                                    title={altTitle}
                                  />
                                </LazyLoad>
                                {/* </div> */}
                              </Slider>
                            ) : (
                              <>
                                <Slider
                                  // style={{ width: "370px", height: "400px" }}
                                  {...settingsMain}
                                  asNavFor={nav2}
                                  ref={(slider) => setSlider1(slider)}
                                >
                                  {/* <div className="slick-slide slider-image-div"> */}
                                  <LazyLoad height="100%" offset={120}>
                                    <img
                                      className="slick-slide-image custom-lazy loaded"
                                      src={
                                        storeData?.image_path +
                                        productDetail?.image
                                      }
                                      alt={altTitle}
                                      title={altTitle}
                                    />
                                  </LazyLoad>
                                  {/* </div> */}
                                  {Boolean(productDetail?.images) &&
                                    Boolean(productDetail?.images?.length) &&
                                    productDetail?.images.map((slide, i) => (
                                      // <div
                                      //   className="slick-slide slider-image-div"
                                      //   key={i + "slidermain"}
                                      // >
                                      <LazyLoad
                                        height="100%"
                                        offset={120}
                                        key={i + "lazyload"}
                                      >
                                        <img
                                          className="slick-slide-image custom-lazy loaded"
                                          src={
                                            storeData?.image_path +
                                            "fit-in/1024x1024/" +
                                            slide
                                          }
                                        />
                                      </LazyLoad>
                                      // </div>
                                    ))}
                                </Slider>
                                <div className="thumbnail-slider-wrap mt-2">
                                  <Slider
                                    {...settingsThumbs}
                                    asNavFor={nav1}
                                    ref={(slider) => setSlider2(slider)}
                                  >
                                    <li
                                      className=""
                                      aria-hidden="true"
                                      // key={i + "sliderlist"}
                                    >
                                      <LazyLoad height="100%" offset={120}>
                                        <img
                                          style={{ cursor: "pointer" }}
                                          src={
                                            storeData?.image_path +
                                            "fit-in/100x100/" +
                                            productDetail?.image
                                          }
                                          className="custom-lazy loaded"
                                        />
                                      </LazyLoad>
                                    </li>
                                    {/* <img
                              className="slick-slide-image"
                              src={storeData?.image_path + productDetail?.image}
                            /> */}
                                    {/* </div> */}
                                    {Boolean(productDetail?.images) &&
                                      Boolean(productDetail?.images?.length) &&
                                      productDetail?.images.map((slide, i) => (
                                        <li
                                          className=""
                                          aria-hidden="true"
                                          key={i + "sliderlist"}
                                        >
                                          <LazyLoad height="100%" offset={120}>
                                            <img
                                              style={{ cursor: "pointer" }}
                                              src={
                                                storeData?.image_path +
                                                "fit-in/100x100/" +
                                                slide
                                              }
                                              className="custom-lazy loaded"
                                              data-src={slide}
                                            />
                                          </LazyLoad>
                                        </li>
                                      ))}
                                  </Slider>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm entry-content">
                  <div className="price-wrap">
                    <span className="price">
                      {productDetail?.prices?.price || 0}
                    </span>
                    {Boolean(productDetail?.prices?.vat) && (
                      <div className="mb-1" style={{ marginTop: "-10px" }}>
                        (Incl. VAT)
                      </div>
                    )}
                    <div className="price-row">
                      {translate("regular_price")}:{" "}
                      <span
                        className="red"
                        style={{ textDecorationLine: "line-through" }}
                      >
                        {productDetail?.prices?.regular_price || 0}
                      </span>{" "}
                    </div>
                    <div className="price-row">
                      {translate("you_save")}{" "}
                      <span className="red">
                        {" "}
                        {productDetail?.prices?.save_price || 0}
                      </span>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="price-wrap">
                    {Boolean(Object.keys(deliveryData)?.length) && (
                      <mark>
                        <i className="fa fa-check-square"></i>&nbsp;
                        {translate("order_next")}
                        &nbsp;
                        {24 - hour}
                        &nbsp;
                        {translate("hr")}
                        &nbsp;
                        {60 - minutes}
                        &nbsp;
                        {translate("min")}
                        {translate("order_delivery")}
                        &nbsp;
                        <span className="font-weight-bold d-inline-block">
                          {(deliveryData?.dayName
                            ? translate(deliveryData?.dayName)
                            : "") +
                            " " +
                            (deliveryData?.day
                              ? deliveryData?.day?.toString().length == 1
                                ? "0" + deliveryData?.day
                                : deliveryData?.day
                              : "") +
                            " " +
                            (deliveryData?.monthName
                              ? translate(deliveryData?.monthName)
                              : "")}
                          &nbsp;
                          <i className="fa fa-clock-o"></i>
                        </span>
                      </mark>
                    )}
                  </div>
                  <ul style={{ paddingLeft: "15px" }} className="product-attr">
                    {productDetail?.attribute_group
                      ?.find((item) => item?.name == "text")
                      ?.attributes?.map(
                        (attribute) =>
                          (attribute?.name == translate("Type") ||
                            attribute?.name == translate("Warranty")) && (
                            <li key={attribute?._id + "att_text"}>
                              <span>{attribute?.name}</span>
                              <b> : {attribute?.value}</b>
                            </li>
                          )
                      )}
                    {productDetail?.attribute_group
                      ?.find((item) => item?.name == "check")
                      ?.attributes?.map(
                        (item, i) =>
                          i == 0 && (
                            <li key={item?._id}>
                              <span>{item?.name}</span>
                              <b> : {item?.value}</b>
                            </li>
                          )
                      )}
                    {productDetail?.attribute_group
                      ?.find((item) => item?.name == "text")
                      ?.attributes?.map(
                        (attribute) =>
                          (attribute?.name == translate("Layers") ||
                            attribute?.name == translate("Material")) && (
                            <li key={attribute?._id + "att_text"}>
                              <span>{attribute?.name}</span>
                              <b> : {attribute?.value}</b>
                            </li>
                          )
                      )}
                    {productDetail?.attribute_group
                      ?.find((item) => item?.name == "check")
                      ?.attributes?.map(
                        (item, i) =>
                          i == 1 && (
                            <li key={item?._id}>
                              <span>{item?.name}</span>
                              <b> : {item?.value}</b>
                            </li>
                          )
                      )}
                  </ul>
                  <ul className="product-star-p-page">
                    {productDetail?.attribute_group
                      ?.find((item) => item?.name == "rating")
                      ?.attributes?.map((attribute) => (
                        <div
                          className="star-rating d-flex align-items-center flex-wrap pb-2"
                          style={{ width: "100%", lineHeight: "1.1rem" }}
                          key={attribute?._id + "att_rating"}
                        >
                          <span
                            className="d-inline-block text-left"
                            style={{ maxWidth: "145px", minWidth: "145px" }}
                          >
                            {" "}
                            {attribute?.name}
                          </span>
                          <span
                            className="d-inline-block star-value text-left h-100"
                            style={{
                              marginRight: "-5px",
                              verticalAlign: "middle",
                            }}
                          >
                            {Boolean(parseFloat(attribute?.value)) ? (
                              <>
                                {[...Array(parseInt(attribute?.value))]?.map(
                                  (st, i) => (
                                    <span
                                      className="fa fa-star pr-1"
                                      key={i + "fss"}
                                    />
                                  )
                                )}
                                {[
                                  ...Array(5 - parseInt(attribute?.value)),
                                ]?.map((st, i) => (
                                  <span
                                    className="fa fa-star-o pr-1"
                                    key={i + "nfss"}
                                  />
                                ))}
                                {Boolean(attribute?.value.includes("+")) && (
                                  <span className="fa fa-plus-square text-seagreen" />
                                )}
                              </>
                            ) : (
                              <span>{attribute?.value}</span>
                            )}
                          </span>
                        </div>
                      ))}
                  </ul>
                  {translate("QTY")} :{" "}
                  <input
                    type="text"
                    id="quantity"
                    inputMode="decimal"
                    pattern="\d*"
                    name="quantity"
                    value={quantity}
                    className="form-control qty-txtbox"
                    size="5"
                    onChange={(e) => setQuantity(e?.target?.value)}
                  />
                  <div className="clearfix"></div>
                  {/* More than 100 available */}
                  {translate("morethanavailable")}
                  {Boolean(storeData?.klaviyo_company_id) && (
                    <div className="text-left mb-1 mt-3">
                      <label className="mb-0">
                        Enter email address here to save your cart (optional):
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Email Address (optional)"
                        className="form-control klaviyo-email-input"
                        onBlur={(e) => {
                          if (typeof window.klaviyo !== "undefined") {
                            if (validateEmail(e?.target?.value)) {
                              window.klaviyo.identify(
                                {
                                  $email: email,
                                },
                                function () {
                                  if (
                                    typeof callbackProductViewed === "function"
                                  ) {
                                    callbackProductViewed();
                                  }
                                }
                              );
                            }
                          }
                        }}
                        onChange={(e) => setEmail(e?.target?.value)}
                      />
                    </div>
                  )}
                  <div className="clearfix"></div>
                  <input
                    type="hidden"
                    id="product_id"
                    name="product_id"
                    size="2"
                    value="1"
                  />
                  <a
                    id="button-cart"
                    className="cart-btn"
                    onClick={(e) =>
                      addToCartOpt(
                        productDetail?.product_id,
                        productDetail?.product_name
                      )
                    }
                  >
                    <img
                      src={
                        `/Images/${language}/addtocart.png` ||
                        translate("image")
                      }
                    />
                  </a>
                </div>

                <div className="col-md extra-attr">
                  {Boolean(productDetail?.freebies) && (
                    <div className="">
                      <LazyLoad height="100%" offset={120}>
                        <img
                          className="custom-lazy loaded"
                          src={storeData?.image_path + productDetail?.freebies}
                          data-src={
                            storeData?.image_path + productDetail?.freebies
                          }
                          alt="CarCoversFactory"
                          style={{ width: "400px", maxWidth: "100%" }}
                        />
                      </LazyLoad>
                    </div>
                  )}

                  <div className="feature-wrap">
                    <ul className="entry-list">
                      <li>{translate("free_Shipping")}</li>
                      <li>{translate("instock")}</li>
                      <li>{translate("shipssamebusinessday")}</li>
                      <li>{translate("guaranteedfit")}</li>
                    </ul>
                  </div>
                  {storeData?.store_id == "15" ? (
                    <div className="col-md text-center">
                      <Link
                        href=""
                        className="affirm-learn-more"
                        data-bs-toggle="modal"
                        data-bs-target="#affirmInfoModal"
                        style={{ cursor: "pointer" }}
                      >
                        <LazyLoad height="100%" offset={120}>
                          <img
                            src="https://d68my205fyswa.cloudfront.net/ccf-202208241661356804zl8.png"
                            style={{ maxWidth: "100%" }}
                          />
                        </LazyLoad>
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="affirmInfoModal"
              role="dialog"
              aria-labelledby="affirmInfoModalLabel"
              aria-modal="true"
            >
              <div
                className="modal-dialog modal-dialog-scrollable"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header text-center p-1 pr-3 pr-sm-0">
                    <div
                      className="modal-title d-table m-auto"
                      id="affirmInfoModalLabel"
                    >
                      <div className="d-table-cell">
                        <img
                          src="https://d68my205fyswa.cloudfront.net/fit-in/220x220/ccf-static-b3sfpdizd7ql254o8opo6c7zrq4t1p22r7pdp3241zkzjkzahu0k5a.png"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                      <div className="d-table-cell">
                        <img
                          src="https://d68my205fyswa.cloudfront.net/fit-in/220x220/ccf-20220825166141194260m.png"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="close"
                      style={{
                        position: "absolute",
                        right: "18px",
                        top: "14px",
                        padding: "0",
                      }}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body p-2 p-sm-4">
                    <h3
                      style={{
                        fontSize: "22px",
                        fontWeight: "600",
                        color: "#343a40",
                      }}
                      className="text-center text-sm-left"
                    >
                      Choose payment plans from 6 weeks, 3 months, 6 months, or
                      12 months
                    </h3>
                    <div style={{ letterSpacing: "0.03rem" }}>
                      <h4 className="mt-2 mt-sm-3">Steps</h4>
                      <h5 className="mb-1 mt-3">
                        <i
                          className="fa fa-caret-square-o-right mr-1"
                          style={{ fontSize: "20px" }}
                        ></i>{" "}
                        Fill your cart
                      </h5>
                      <div style={{ lineHeight: "1.3rem" }}>
                        Select Affirm at checkout, then enter a few pieces of
                        info for a real-time decision.
                      </div>

                      <h5 className="mb-1 mt-3">
                        <i
                          className="fa fa-caret-square-o-right mr-1"
                          style={{ fontSize: "20px" }}
                        ></i>{" "}
                        Choose how you pay
                      </h5>
                      <div style={{ lineHeight: "1.3rem" }}>
                        Pick the payment plan you like best—from 4 interest-free
                        payments every 2 weeks to monthly payments up to 12
                        months. You’ll never pay more than you agree to up
                        front. See footer for details.
                      </div>

                      <h5 className="mb-1 mt-3">
                        <i
                          className="fa fa-caret-square-o-right mr-1"
                          style={{ fontSize: "20px" }}
                        ></i>{" "}
                        Pay over time
                      </h5>
                      <div style={{ lineHeight: "1.3rem" }}>
                        Make payments at{" "}
                        <Link href="https://affirm.com/" target="_blank">
                          affirm.com
                        </Link>{" "}
                        or in the Affirm app. You’ll get email and text
                        reminders.{" "}
                      </div>
                      <div className="mt-2">
                        *Example: On a $700 purchase, you may pay $63.18 for 12
                        months with a 15% APR.
                      </div>
                    </div>

                    <section className="faq-section">
                      <div className="row">
                        {/* <!-- ***** FAQ Start ***** --> */}
                        <div className="col-md-12">
                          <div className="faq-title text-center">
                            <h2 className="mb-3">FAQ</h2>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="faq accordion" id="accordionFAQ">
                            <div className="card">
                              <div className="card-header" id="faqHeading-1">
                                <div className="mb-0">
                                  <h5
                                    className="faq-title"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faqCollapse-1"
                                    data-aria-expanded="false"
                                    data-aria-controls="faqCollapse-1"
                                  >
                                    <span className="badge">1</span>
                                    Can I pay off my purchase early?
                                  </h5>
                                </div>
                              </div>
                              <div
                                id="faqCollapse-1"
                                className="collapse"
                                aria-labelledby="faqHeading-1"
                                data-bs-parent="#accordionFAQ"
                              >
                                <div className="card-body">
                                  <p className="mb-0">
                                    {" "}
                                    Yes! There’s no penalty for paying early.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="faqHeading-2">
                                <div className="mb-0">
                                  <h5
                                    className="faq-title"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faqCollapse-2"
                                    data-aria-expanded="false"
                                    data-aria-controls="faqCollapse-2"
                                  >
                                    <span className="badge">2</span> How do I
                                    make my payments?
                                  </h5>
                                </div>
                              </div>
                              <div
                                id="faqCollapse-2"
                                className="collapse"
                                aria-labelledby="faqHeading-2"
                                data-bs-parent="#accordionFAQ"
                              >
                                <div className="card-body">
                                  <p className="mb-0">
                                    You can make or schedule payments at
                                    affirm.com or in the Affirm app for iOS or
                                    Android. Affirm will send you email and text
                                    reminders before payments are due.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="faqHeading-3">
                                <div className="mb-0">
                                  <h5
                                    className="faq-title"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faqCollapse-3"
                                    data-aria-expanded="true"
                                    data-aria-controls="faqCollapse-3"
                                  >
                                    <span className="badge">3</span> Can I
                                    return an item I bought with Affirm?
                                  </h5>
                                </div>
                              </div>
                              <div
                                id="faqCollapse-3"
                                className="collapse"
                                aria-labelledby="faqHeading-1"
                                data-bs-parent="#accordionFAQ"
                              >
                                <div className="card-body">
                                  <p className="mb-0">
                                    Yes—you can return an item you bought with
                                    Affirm by initiating the return process with
                                    the store.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="faqHeading-4">
                                <div className="mb-0">
                                  <h5
                                    className="faq-title"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faqCollapse-4"
                                    data-aria-expanded="false"
                                    data-aria-controls="faqCollapse-4"
                                  >
                                    <span className="badge">4</span> Does
                                    checking my eligibility affect my credit
                                    score?
                                  </h5>
                                </div>
                              </div>
                              <div
                                id="faqCollapse-4"
                                className="collapse"
                                aria-labelledby="faqHeading-4"
                                data-bs-parent="#accordionFAQ"
                              >
                                <div className="card-body">
                                  <p className="mb-0">
                                    No—your credit score won’t be affected when
                                    you create an Affirm account or check your
                                    eligibility. If you decide to buy with
                                    Affirm, this may impact your credit score.
                                    You can find more information in Affirm’s
                                    Help Center.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="faqHeading-5">
                                <div className="mb-0">
                                  <h5
                                    className="faq-title"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faqCollapse-5"
                                    data-aria-expanded="true"
                                    data-aria-controls="faqCollapse-5"
                                  >
                                    <span className="badge">5</span> Do I need a
                                    mobile number to use Affirm?
                                  </h5>
                                </div>
                              </div>
                              <div
                                id="faqCollapse-5"
                                className="collapse"
                                aria-labelledby="faqHeading-5"
                                data-bs-parent="#accordionFAQ"
                              >
                                <div className="card-body">
                                  <p className="mb-0">
                                    Yes, you’ll need a mobile phone number from
                                    the U.S. or U.S. territories. This helps
                                    Affirm verify it’s really you who is
                                    creating your account and signing in.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header" id="faqHeading-6">
                                <div className="mb-0">
                                  <h5
                                    className="faq-title"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#faqCollapse-6"
                                    data-aria-expanded="true"
                                    data-aria-controls="faqCollapse-6"
                                  >
                                    <span className="badge">6</span> Where can I
                                    learn more about Affirm?
                                  </h5>
                                </div>
                              </div>
                              <div
                                id="faqCollapse-6"
                                className="collapse"
                                aria-labelledby="faqHeading-6"
                                data-bs-parent="#accordionFAQ"
                              >
                                <div className="card-body">
                                  <p className="mb-0">
                                    You can visit their website at{" "}
                                    <a
                                      href="https://affirm.com/"
                                      target="_blank"
                                    >
                                      affirm.com
                                    </a>
                                    .
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <p
                      style={{
                        border: "1px solid #000",
                        marginTop: "15px",
                        padding: "1%",
                        marginBottom: "0px",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          backgroundColor: "#000",
                          width: "100%",
                          color: "#fff",
                        }}
                        className="btn"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-description">
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <nav>
                    <ul className="nav nav-tabs" id="nav-tab" role="tablist">
                      {!Boolean(fakeproduct) && (
                        <>
                          <li>
                            <Link
                              className="nav-item nav-link active"
                              id="nav-description-tab"
                              data-bs-toggle="tab"
                              href="#nav-description"
                              role="tab"
                              aria-controls="nav-details"
                              aria-selected="true"
                            >
                              {translate("Description")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="nav-item nav-link"
                              id="nav-faqs-tab"
                              data-bs-toggle="tab"
                              href="#nav-faqs"
                              role="tab"
                              aria-controls="nav-faqs"
                              aria-selected="false"
                            >
                              {translate("FAQs")}
                            </Link>
                          </li>
                        </>
                      )}

                      {storeData?.store_id == "15" && (
                        <li>
                          <Link
                            className={`nav-item nav-link ${
                              storeData?.store_id == "15" &&
                              Boolean(fakeproduct) &&
                              "active"
                            }`}
                            id="nav-warranty-tab"
                            data-bs-toggle="tab"
                            href="#nav-warranty"
                            role="tab"
                            aria-controls="nav-warranty"
                            aria-selected="false"
                          >
                            {translate("Warranty")}
                          </Link>
                        </li>
                      )}

                      <li>
                        <Link
                          className={`nav-item nav-link ${
                            storeData?.store_id != "15" &&
                            Boolean(fakeproduct) &&
                            "active"
                          }`}
                          id="nav-shipping-tab"
                          data-bs-toggle="tab"
                          href="#nav-shipping"
                          role="tab"
                          aria-controls="nav-shipping"
                          aria-selected="false"
                        >
                          {translate("Shipping")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="nav-item nav-link"
                          id="nav-site_review-tab"
                          data-bs-toggle="tab"
                          href="#nav-site_review"
                          onClick={() => {
                            let reviewFrame =
                              document.getElementById("sa_review_widget");
                            if (
                              reviewFrame &&
                              !Boolean(reviewFrame.getAttribute("src"))
                            ) {
                              reviewFrame.setAttribute(
                                "src",
                                window.location.origin +
                                  reviewFrame.getAttribute("data-src")
                              );
                            }
                          }}
                          role="tab"
                          aria-controls="nav-site_review"
                          aria-selected="false"
                        >
                          {translate("CustomerReviews")}
                        </Link>
                      </li>
                      {storeData?.language?.code === "en" &&
                        Boolean(isFilterExist) &&
                        Boolean(singleProduct?.is_review) && (
                          <li onClick={() => setReviewLoader(true)}>
                            <Link
                              className="nav-item nav-link"
                              id="nav-product_review-tab"
                              data-bs-toggle="tab"
                              href="#nav-product_review"
                              role="tab"
                              aria-controls="nav-product_review"
                              aria-selected="false"
                            >
                              {translate("ProductReviews")}
                            </Link>
                          </li>
                        )}
                    </ul>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade active show"
                      id="nav-description"
                      role="tabpanel"
                      aria-labelledby="nav-description-tab"
                      dangerouslySetInnerHTML={{
                        __html: productDetail?.description,
                      }}
                    />
                    <div
                      className="tab-pane fade"
                      id="nav-faqs"
                      role="tabpanel"
                      aria-labelledby="nav-faqs-tab"
                    >
                      {faq?.map((fq, i) => (
                        <div className="entry-single" key={i + "fq"}>
                          <h4 className="title mt-4">{fq?.question}</h4>
                          {fq?.answer}{" "}
                        </div>
                      ))}
                    </div>
                    <div
                      className={`tab-pane fade ${
                        storeData?.store_id == "15" &&
                        Boolean(fakeproduct) &&
                        "active show"
                      }`}
                      id="nav-warranty"
                      role="tabpanel"
                      aria-labelledby="nav-warranty-tab"
                    >
                      <div className="alert alert-primary">
                        At CarCoversFactory.com, we’re confident that we have
                        one of the highest quality covers in the industry while
                        it is also backed up by its warranty according to its
                        edition. If anything happens to the cover including
                        rips, fading, or tears, we will replace your cover with
                        a brand new one for FREE, and you can only pay for the
                        shipping and handling accordingly. Feel free to contact
                        us and we will absolutely help you.{" "}
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        storeData?.store_id != "15" &&
                        Boolean(fakeproduct) &&
                        "active show"
                      }`}
                      id="nav-shipping"
                      role="tabpanel"
                      aria-labelledby="nav-shipping-tab"
                    >
                      <div className="alert alert-primary">
                        {storeData?.language?.code == "en" ? (
                          <>
                            {storeData?.store_id == "15"
                              ? translate("shipping_details_usa")
                              : "At " +
                                storeData?.store_name +
                                translate("shipping_details")}
                          </>
                        ) : (
                          <>{translate("shipping_details")}</>
                        )}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-site_review"
                      role="tabpanel"
                      aria-labelledby="nav-site_review-tab"
                    >
                      <div id="sa-review-loader" className="text-center w-100">
                        <i className="fa fa-cog fa-spin fa-3x"></i>
                      </div>
                      <iframe
                        id="sa_review_widget"
                        src=""
                        data-src="/shopperReviews.html"
                        height={"924px"}
                        width={"100%"}
                        style={{
                          height: "924px",
                          width: "100%",
                          border: "none",
                          overflow: "hidden",
                          visibility: "hidden",
                        }}
                      ></iframe>
                      <Script>{`
                        var sa_review_widget_obj = document.getElementById('sa_review_widget');
                        sa_review_widget_obj.addEventListener('load', function (elem) {
                            // console.log("height", sa_review_widget_obj.contentWindow.document.body.scrollHeight);
                              sa_review_widget_obj.style.height=sa_review_widget_obj.contentWindow.document.body.scrollHeight + 100 +"px";
                              sa_review_widget_obj.style.visibility="visible";
                              document.getElementById('sa-review-loader').style.display = 'none';
                        });
                        `}</Script>
                      {/* <Script
                        type="text/javascript"
                        id="CustomerReview"
                        strategy="afterInteractive"
                      >
                        {`
                          var sa_review_count = 5;
                          var sa_date_format = 'F j, Y';
                          function saLoadScript(src) {
                          var js = window.document.createElement("script");
                          js.src = src;
                          js.type = "text/javascript";
                          document.getElementsByTagName("head")[0].appendChild(js);
                          }
                          saLoadScript('//www.shopperapproved.com/merchant/8426.js');`}
                      </Script> */}

                      {/* <div className="entry-single">
                        <div id="shopper_review_page">
                          <div id="review_header"></div>
                          <div id="merchant_page"></div>
                          <div id="review_image" className="text-end">
                            <Link
                              href="https://www.shopperapproved.com/reviews/carcoversfactory.com/"
                              target="_blank"
                              rel="nofollow"
                            >
                              <img
                                src="https://www.shopperapproved.com/widgets/images/widgetfooter-darklogo-eng.png"
                                alt="Shopper Approved"
                              />
                            </Link>
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <div
                      className="tab-pane fade"
                      id="nav-product_review"
                      role="tabpanel"
                      aria-labelledby="nav-product_review-tab"
                    >
                      {Boolean(reviewLoader) ? (
                        <div id="review">
                          <i className="fa fa-spinner fa-spin"></i>
                          Loading.....
                        </div>
                      ) : (
                        <>
                          <div id="total_review">
                            <div
                              style={{
                                borderBottom: "#cccccc solid 1px",
                                padding: "10px",
                              }}
                            >
                              <h3>Recent Customer Reviews</h3>
                              <h5 className="mb-0 font-weight-bold">
                                Overall Rating
                              </h5>
                              <div
                                className="star-ratings"
                                style={{ fontSize: "32px" }}
                              >
                                <div
                                  className="fill-ratings"
                                  style={{ width: "90%" }}
                                >
                                  <span>★★★★★</span>
                                </div>
                                <div className="empty-ratings">
                                  <span>★★★★★</span>
                                </div>
                              </div>
                              <div>
                                <b>
                                  {reviewPagination?.averageRating?.toFixed(
                                    1
                                  ) || 4.5}{" "}
                                  out of 5 stars (based on{" "}
                                  {reviewPagination?.count} reviews)
                                </b>
                              </div>
                            </div>
                            {/* <link
                              href="catalog/view/javascript/jquery/lightbox2/css/lightbox.css"
                              rel="stylesheet"
                            /> */}
                          </div>

                          <div id="review">
                            {Boolean(productReviews?.result?.length) &&
                              productReviews?.result?.map((item, i) => (
                                <div className="review-list" key={i + "revuew"}>
                                  <span className="home-rating-review">
                                    <span className="home-rating-review-wrap">
                                      <span
                                        className="stars-active"
                                        style={{
                                          width: `${
                                            productReviews?.reting * 20
                                          }%`,
                                        }}
                                      >
                                        {[...new Array(5)].map((arr, index) => {
                                          return index < 5 ? (
                                            <i
                                              className="fa fa-light fa-star m-1"
                                              key={index}
                                            ></i>
                                          ) : (
                                            ""
                                          );
                                        })}
                                      </span>
                                      <span className="stars-inactive">
                                        {[...new Array(5)].map((arr, index) => {
                                          return index < 5 ? (
                                            <i
                                              className="fa fa-light fa-star m-1"
                                              key={index}
                                            ></i>
                                          ) : (
                                            ""
                                          );
                                        })}
                                      </span>
                                    </span>
                                  </span>
                                  <div className="text">{item?.text} </div>
                                  <div className="author">
                                    {" "}
                                    By <b>{item?.author}</b> on{" "}
                                    {moment(item?.review_date).format(
                                      "MM/DD/YYYY"
                                    )}
                                  </div>
                                </div>
                              ))}

                            <div className="pagination">
                              {/* <ul className="mt-3 pagination pagination-sm link"> */}
                              {/* &nbsp; */}
                              {/* <li className="page-item"> */}
                              {/* <Link className="page-link" href="">
                                    <i className="fa fa-angle-double-left"></i>
                                  </Link> */}
                              {/* </li> */}
                              {/* {Boolean(productReviews?.result?.length) &&
                                  currentPage != 1 && (
                                    <li
                                      className="page-item"
                                      onClick={() => {
                                        setPage(currentPage - 1);
                                        reviewData(currentPage - 1);
                                        document
                                          ?.getElementById("nav-product_review")
                                          ?.scrollIntoView({
                                            behavior: "smooth",
                                          });
                                      }}
                                    >
                                      <button className="page-link">
                                        <i className="fa fa-angle-left"></i>
                                      </button>
                                    </li>
                                  )} */}
                              <ReactPaginate
                                breakLabel="----"
                                nextLabel={
                                  <i className="fa fa-angle-right"></i>
                                }
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                pageCount={
                                  Boolean(total == 1) ? 0 : Number(total)
                                }
                                marginPagesDisplayed={2}
                                previousLabel={
                                  <i className="fa fa-angle-left"></i>
                                }
                                className="productReviewPagination pt-3"
                                renderOnZeroPageCount={null}
                              />

                              {/* {[...Array(total)]?.map((item, i) => {
                                  return <li
                                    key={i + "total" + i + 2}
                                    className="page-item"
                                    onClick={() => {
                                      setPage(i + 1);
                                      reviewData(i + 1);
                                      document
                                        ?.getElementById("nav-product_review")
                                        ?.scrollIntoView({
                                          behavior: "smooth",
                                        });
                                    }}
                                  >
                                    <button
                                      className={`page-link ${
                                        currentPage == i + 1 &&
                                        "text-dark fw-bold"
                                      }`}
                                      // href="#"
                                    >
                                      {currentPage === i + 1 ? (
                                        <b>{i + 1}</b>
                                      ) : (
                                        i + 1
                                      )}
                                    </button>
                                  </li>
                                })}{" "} */}
                              {/* {Boolean(productReviews?.result?.length) &&
                                  total != currentPage && (
                                    <li
                                      className="page-item"
                                      onClick={() => {
                                        setPage(currentPage + 1);
                                        reviewData(currentPage + 1);
                                        document
                                          ?.getElementById("nav-product_review")
                                          ?.scrollIntoView({
                                            behavior: "smooth",
                                          });
                                      }}
                                    >
                                      <button className="page-link">
                                        <i className="fa fa-angle-right"></i>
                                      </button>
                                    </li>
                                  )}{" "} */}
                              {/* <li className="page-item">
                                  <Link className="page-link" href="">
                                    <i className="fa fa-angle-double-right"></i>
                                  </Link>
                                </li> */}
                              {/* </ul> */}
                            </div>
                            {Boolean(productReviews?.result?.length) && (
                              <div className="results">
                                {"Showing " +
                                  (reviewPagination?.page * items - items + 1) +
                                  " to " +
                                  (reviewPagination?.page ==
                                  reviewPagination?.pages
                                    ? reviewPagination?.count
                                    : reviewPagination?.page * items) +
                                  " of " +
                                  reviewPagination?.count +
                                  " (" +
                                  reviewPagination?.pages +
                                  " pages)"}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {category_slug != "disposable-covers" ? (
                  <div className="col-md-12 col-lg-4 text-center mt-5">
                    <div className="entry-right">
                      <LazyLoad height="100%" offset={120}>
                        <img
                          className="custom-lazy loaded"
                          src={`/Images/${language}/satisfaction-guarantee.png`}
                          data-src={`/Images/${language}/satisfaction-guarantee.png`}
                          alt="Satisfaction CarCoversFactory"
                        />
                      </LazyLoad>
                      <ul>
                        <li>
                          <span>{translate("protects_against")}:</span>
                        </li>
                        {Boolean(productDetail?.attribute_group) &&
                        productDetail?.attribute_group[1]?.attributes?.find(
                          (x) => x.name == "is_indoor"
                        ) ? (
                          <>
                            <li>{translate("mold")} </li>
                            <li>{translate("mildew")} </li>
                            <li>{translate("dust")}</li>
                            <li>{translate("dirt")}</li>
                            <li>{translate("droppings")}</li>
                          </>
                        ) : (
                          <>
                            <li>{translate("rain")}</li>
                            <li>{translate("uv_sunlight")}</li>
                            <li>{translate("mold")} </li>
                            <li>{translate("mildew")} </li>
                            <li>{translate("rust")} </li>
                            <li>{translate("bird_droppings")}</li>
                            <li>{translate("acid_rain")} </li>
                            <li>{translate("tree_sap")}</li>
                            <li>{translate("dust")}</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {storeData?.language?.name === "English" && <CustomerCovers />}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
