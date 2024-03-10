import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import axiosApi from "../../axios_instance";
import { useDispatch, useSelector } from "react-redux";
import { ArrowContainer } from "react-tiny-popover";
import dynamic from "next/dynamic";
import Link from "next/link";
import PageContentTiles from "../PageContentTiles";
import { setTilesAction } from "../../redux/action/tilesAction ";
import { isBrowser, isMobile } from "react-device-detect";
import * as rdd from "react-device-detect";
import { setToast } from "../../redux/action/toastAction";
import {
  setMobileScrollStateAction,
  setScrollStateAction,
  setStateAction,
} from "../../redux/action/stateAction";
import index from "../Header";
import LazyLoad from "react-lazy-load";

const Popover = dynamic(
  () => import("react-tiny-popover").then((mod) => mod.Popover),
  { ssr: false }
);

const modelSortOrder = [
  "car-covers",
  "suv-covers",
  "truck-covers",
  "van-covers",
];

const Search = ({
  categoryData = [],
  useSlug = true,
  productDatas = [],
  extraSlug = false,
}) => {
  const storeData = useSelector((state) => state?.common?.store);
  const scrollData = useSelector((state) => state?.scroll);

  const productTitle = productDatas?.tital;

  const [selectCategoryData, setSelectCategoryData] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const [yearData, setYearData] = useState([]);
  const [makeData, setMakeData] = useState([]);
  const [modelData, setModelData] = useState([]);
  const [bodyData, setBodyData] = useState([]);

  const [tilesData, setTilesData] = useState([]);

  const [year, setYear] = useState(productTitle?.year || "");
  const [make, setMake] = useState("");
  const [model, setModal] = useState("");
  const [body, setBody] = useState("");
  const [popupBody, setPopupBody] = useState(false);

  const [mobileYear, setMobileYear] = useState(false);
  const [mobileMake, setMobileMake] = useState(false);
  const [mobileModel, setMobileModel] = useState(false);
  const [mobileBody, setMobileBody] = useState(false);
  const [mobileScreen, setMobileScreen] = useState(isMobile);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState("");
  const [isBodyImage, setIsBodyImage] = useState(false);
  const [isBody, setIsBody] = useState(false);
  const [width, setWidth] = useState(0);
  const [disable, setDisable] = useState(true);
  const [modelName, setModelName] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const category_slug = router?.query?.category;

  const { t: translate } = useTranslation("searchpage");
  // let index
  // useEffect(()=>{
  //   modelData?.vehicle?.map((item, i) =>{

  //   })
  //   console.log(index);
  // },modelData?.vehicle)

  useEffect(() => {
    setDisable(false);
  }, []);

  useEffect(() => {
    if (skeletonLoading == false) {
      if (disable == false) {
        setDisable(true);
      }
    }
  }, [modelData, disable]);

  useEffect(() => {
    if (router?.asPath?.includes("/covers")) {
      if (scrollData?.scrollState == true) {
        document
          ?.getElementById("scrollSearch")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [scrollData]);

  // useEffect(() => {
  //   if (router?.asPath?.includes("/covers")) {
  //     document
  //       ?.getElementById("scrollData")
  //       ?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [useSlug == false]);

  // useEffect(() => {
  //   if (isMobile) {
  //     setMobileScreen(true);
  //   }
  // }, [isMobile]);

  useEffect(() => {
    if (mobileScreen && productDatas?.result) {
      setMobileBody(false);
      setMobileModel(false);
      setMobileMake(false);
    }
  }, [productDatas?.result]);

  // const handleResize = () => setWidth(window.innerWidth);
  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [handleResize]);

  // useEffect(() => {
  //   width <= 366 ? setMobileScreen(true) : setMobileScreen(false);
  // }, [width]);

  // useEffect(() => {
  //   setWidth(window.innerWidth);
  // }, []);

  const handleChange = (e) => {
    modelData?.vehicle?.map((item) => {
      let keys = Object.keys(item);
      item?.vehicles?.map((abc) => {
        if (abc?.slug === e) {
          setCat(abc?.category);
          setModelName(abc?.name);
          if (selectCategoryData[0]?.is_body || categoryData[0]?.is_body) {
            setIsBody(
              selectCategoryData[0]?.is_body || categoryData[0]?.is_body
            );
            handleBody(abc?.category, abc?.slug);
          } else {
            setModal(abc?.slug);
            searchProductData(year, make, abc?.slug);
          }
        }
      });
    });
  };

  useEffect(() => {
    if (router?.asPath?.includes("/covers")) {
      for (var i = 0; i < categoryData?.length; i++) {
        if (categoryData[i]?.slug.includes(router?.query?.category)) {
          // a.push(categoryData[i])
          setSelectCategoryData([categoryData[i]]);
          // setSkeletonLoading(false);
          break;
        }
      }
    } else {
      setSelectCategoryData(
        Array?.isArray(categoryData)
          ? categoryData?.filter((dt) =>
              useSlug
                ? dt?.slug === category_slug
                : dt?.details?.short_name?.toLowerCase() === category_slug
            )
          : []
      );
    }
  }, [categoryData, categoryData?.length]);

  // const selectCategoryData = Array?.isArray(categoryData)
  //   ? categoryData?.filter((dt) =>
  //       useSlug
  //         ? dt?.slug === category_slug
  //         : dt?.details?.short_name?.toLowerCase() === category_slug
  //     )
  //   : [];

  useEffect(() => {
    if (productDatas?.result) {
      setLoadingSearch(false);
    }
  }, [productDatas?.result]);

  useEffect(() => {
    if (!router?.query?.year) {
      yearList();
    }
  }, [category_slug]);

  useEffect(() => {
    if (!Boolean(productDatas?.result?.length)) {
      setYear("");
      setMakeData([]);
      setModelData([]);
      setBodyData([]);
      setBody("");
      setMake("");
      setModal("");
    }
    setPopupBody(false);
  }, [category_slug]);

  useEffect(() => {
    if (router?.query?.category && router?.query?.year) {
      getVehicalData();
    }
  }, [router?.isReady]);

  const errorToast = (err) => {
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
  };

  const data = {
    category: router?.query?.category,
    year: router?.query?.year,
    make: router?.query?.make,
    model: router?.query?.model,
    body: router?.query?.body,
  };

  const getVehicalData = () => {
    setSkeletonLoading(true);
    if (!extraSlug) {
      axiosApi
        .post(`vehicle`, data)
        .then((res) => {
          if (res?.data?.status) {
            if (isMobile) {
              dispatch(setMobileScrollStateAction({ scrollState: true }));
            }
            // dispatch(setScrollStateAction({scrollState:true}))
            setYearData(res?.data?.result?.years);
            setMakeData(res?.data?.result?.makes);
            sortAndSetModelData(res?.data?.result?.models);
            // setModelData(res?.data?.result?.models);
            setBodyData(res?.data?.result?.body?.body);
            setSkeletonLoading(false);
          }
        })
        .catch((err) => {
          dispatch(setScrollStateAction({ scrollState: true }));
          setSkeletonLoading(false);
          if (err?.response?.data?.redirect_url) {
            router?.push(err?.response?.data?.redirect_url);
          }
        });
    } else {
      yearList();
    }
  };

  useEffect(() => {
    if (!router?.asPath?.includes("/covers")) {
      if (router?.query?.year) {
        setYear(router?.query?.year);
      }
      if (router?.query?.make) {
        setMake(router?.query?.make);
      }
      if (router?.query?.model) {
        setModal(router?.query?.model);
      }
      if (router?.query?.body) {
        setBody(router?.query?.body);
        setLoadingSearch(false);
      }
    }
    if (extraSlug) {
      setYear("");
    }

    setLoadingSearch(false);
  }, [router?.isReady]);

  const year_Data = useSlug
    ? { category: category_slug }
    : { sort_slug: category_slug };

  const yearList = () => {
    if (category_slug) {
      axiosApi
        .post(`vehicle/years`, year_Data)
        .then((res) => {
          if (!router?.asPath?.includes("/covers")) {
            setTilesData(res?.data?.result?.tiles);
          }

          if (router?.asPath?.includes("/covers")) {
            dispatch(setTilesAction(res?.data?.result?.tiles));
          }
          setYearData(res?.data?.result?.years);
          setSkeletonLoading(false);
        })
        .catch((err) => {
          // console.log(err,"=-=-=-");
          errorToast(err);
          setSkeletonLoading(false);
        });
    } else if (categoryData?.length) {
      axiosApi
        .post(`vehicle/years`, { category: categoryData[0]?.slug })
        .then((res) => {
          setTilesData(res?.data?.result?.tiles);
          setYearData(res?.data?.result?.years);
          setSkeletonLoading(false);
        })
        .catch((err) => {
          errorToast(err);
          setSkeletonLoading(false);
        });
    }
  };

  const handleMake = (year) => {
    if (Boolean(mobileYear)) setLoading(true);
    setYear(year);
    setBody("");
    setMake("");
    setModal("");
    setMakeData([]);
    setModelData([]);
    setBodyData([]);

    const make_Data = useSlug
      ? { category: category_slug, year: year }
      : { sort_slug: category_slug, year: year };

    if (category_slug) {
      axiosApi
        .post(`vehicle/makes`, make_Data)
        .then((response) => {
          setMakeData(response?.data);
          setMakeData(response?.data);
          if (response?.data?.length === 1) {
            setMake(response?.data[0]?.slug);
            handleModel(response?.data[0]?.slug, year);
          }
          if (Boolean(mobileYear)) {
            setMobileMake(true);
            setMobileYear(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          errorToast(err);
          setMobileMake(false);
          setMobileYear(false);
          setLoading(false);
        });
    } else {
      axiosApi
        .post(`vehicle/makes`, { category: categoryData[0]?.slug, year: year })
        .then((response) => {
          setMakeData(response?.data);
          if (response?.data?.length === 1) {
            setMake(response?.data[0]?.slug);
            handleModel(response?.data[0]?.slug, year);
          }
          if (Boolean(mobileYear)) {
            setMobileMake(true);
            setMobileYear(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          errorToast(err);
          setMobileMake(false);
          setMobileYear(false);
          setLoading(false);
        });
    }
  };

  const sortAndSetModelData = (data) => {
    let models = [];
    if (Array?.isArray(data?.vehicle)) {
      modelSortOrder?.forEach((cat) => {
        let category = data?.vehicle?.find((e) => e?.category == cat);
        if (typeof category == "object" && Object?.keys(category)?.length) {
          models.push(category);
        }
      });
    }
    setModelData(models?.length ? { ...data, vehicle: models } : data);
  };

  const handleModel = (value, yearN) => {
    setModelData([]);
    setBodyData([]);
    setBody("");
    setModal("");
    setMake(value);
    const model_Data = useSlug
      ? {
          category: cat || category_slug,
          year: yearN || year || router?.query?.year,
          make: value,
        }
      : {
          sort_slug: cat || category_slug,
          year: yearN || year || router?.query?.year,
          make: value,
        };

    if (Boolean(mobileMake)) setLoading(true);
    if (cat || category_slug) {
      axiosApi
        .post(`vehicle/models`, model_Data)
        .then((response) => {
          // console.log("=============", response?.data);
          sortAndSetModelData(response?.data);
          if (selectCategoryData[0]?.is_body === false) {
            // searchProduct(true);
            if (response?.data?.vehicle?.length == 1) {
              if (response?.data?.vehicle[0]?.vehicles?.length == 1) {
                setLoadingSearch(true);
                setModal(response?.data?.vehicle[0]?.vehicles[0]?.slug);

                searchProductData(
                  yearN || year,
                  value,
                  response?.data?.vehicle[0]?.vehicles[0]?.slug
                );
              }
            }
            // searchProductAuto(e?.target?.value);
          } else {
            if (response?.data?.vehicle?.length == 1) {
              if (response?.data?.vehicle[0]?.vehicles?.length == 1) {
                setModal(response?.data?.vehicle[0]?.vehicles[0]?.slug);
                handleBody(
                  response?.data?.vehicle[0]?.vehicles[0]?.category,
                  response?.data?.vehicle[0]?.vehicles[0]?.slug,
                  value,
                  yearN
                );
              }
            }
          }
          if (Boolean(mobileMake)) {
            setMobileModel(true);
            setMobileMake(false);
            setMobileYear(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          errorToast(err);
        });
    } else {
      axiosApi
        .post(`vehicle/models`, {
          category: cat || categoryData[0]?.slug,
          year: yearN || year || router?.query?.year,
          make: value,
        })
        .then((response) => {
          sortAndSetModelData(response?.data);
          if (selectCategoryData[0]?.is_body === false) {
            // searchProduct(true);
            if (response?.data?.vehicle?.length == 1) {
              if (response?.data?.vehicle[0]?.vehicles?.length == 1) {
                setLoadingSearch(true);
                setModal(response?.data?.vehicle[0]?.vehicles[0]?.slug);

                searchProductData(
                  yearN || year,
                  value,
                  response?.data?.vehicle[0]?.vehicles[0]?.slug
                );
              }
            }
            // searchProductAuto(e?.target?.value);
          } else {
            if (response?.data?.vehicle?.length == 1) {
              if (response?.data?.vehicle[0]?.vehicles?.length == 1) {
                setModal(response?.data?.vehicle[0]?.vehicles[0]?.slug);
                handleBody(
                  response?.data?.vehicle[0]?.vehicles[0]?.category,
                  response?.data?.vehicle[0]?.vehicles[0]?.slug,
                  value,
                  yearN
                );
              }
            }
          }
          // if (selectCategoryData[0]?.is_body === false) {
          //   // searchProduct(true);
          //   if (response?.data?.vehicle?.length == 1) {
          //     if (
          //       response?.data?.vehicle[0]?.vehicles?.length == 1
          //     ) {
          //       setLoadingSearch(true);
          //       setMake(
          //         response?.data?.vehicle[0]?.vehicles[0]?.slug
          //       );

          //       searchProductData(
          //         yearN || year,
          //         value,
          //         response?.data?.vehicle[0]?.vehicles[0]?.slug
          //       );
          //     }
          //   }
          //   // searchProductAuto(e?.target?.value);
          // } else {
          //   if (response?.data?.vehicle?.length == 1) {
          //     if (
          //       response?.data?.vehicle[0]?.vehicles?.length == 1
          //     ) {
          //       // setLoadingSearch(true);
          //       setMake(
          //         response?.data?.vehicle[0]?.vehicle[0]?.slug
          //       );
          //       handleBody(
          //         response?.data?.vehicle[0]?.vehicles[0]?.category,
          //         response?.data?.vehicle[0]?.vehicles[0]?.slug,
          //         value,
          //         yearN
          //       );
          //     }
          //   }
          // }
          if (Boolean(mobileMake)) {
            setMobileModel(true);
            setMobileMake(false);
            setMobileYear(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          errorToast(err);
        });
    }
  };

  const handleBody = (category, value, makes, yearN) => {
    setBodyData([]);
    if (Boolean(mobileModel)) setLoading(true);
    setModal(value);
    setBody("");
    setLoading(true);
    const model_Data = useSlug
      ? {
          category: cat || category_slug,
          year: yearN || year || router?.query?.year,
          make: value,
        }
      : {
          sort_slug: cat || category_slug,
          year: yearN || year || router?.query?.year,
          make: value,
        };
    if (category) {
      axiosApi
        .post(`vehicle/bodys`, {
          category: category,
          year: yearN || year || router?.query?.year,
          make: makes || make || router?.query.make,
          model: value,
        })
        .then((response) => {
          setIsBodyImage(response?.data?.is_body_image);
          if (response?.data?.body?.length == 1) {
            setBody(response?.data?.body[0]?.slug);
            searchProductData(
              yearN || year,
              makes || make,
              value,
              response?.data?.body[0]?.slug,
              category
            );
          }
          setBodyData(response?.data?.body);
          if (Boolean(mobileModel)) {
            setMobileBody(true);
            setMobileModel(false);
            setMobileMake(false);
            setMobileYear(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          errorToast(err);
        });
    } else {
      axiosApi
        .post(`vehicle/bodys`, {
          category: category || categoryData[0]?.slug,
          year: yearN || year || router?.query?.year,
          make: makes || make || router?.query.make,
          model: value,
        })
        .then((response) => {
          setIsBodyImage(response?.data?.Reactis_body_image);
          setBodyData(response?.data?.body);
          if (response?.data?.body?.length == 1) {
            setBody(response?.data?.body[0]?.slug);
            searchProductData(
              yearN || year,
              makes || make,
              value,
              response?.data?.body[0]?.slug,
              category
            );
          }
          if (Boolean(mobileModel)) {
            setMobileBody(true);
            setMobileModel(false);
            setMobileMake(false);
            setMobileYear(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          errorToast(err);
        });
    }
  };

  const searchProductData = (year, makes, models, bodys, category) => {
    document?.getElementById("dialogclose")?.click();
    // setLoadingSearch(true);
    setMobileBody(false);
    if (year && makes && models && bodys) {
      setLoadingSearch(true);
      if (category || category_slug) {
        // setLoadingSearch(false);
        router?.push(
          `/${category || category_slug}/${year}/${makes}/${models}/${bodys}`
        );
      } else {
        // setLoadingSearch(false);
        router?.push(
          `/${
            category || categoryData[0]?.slug
          }/${year}/${makes}/${models}/${bodys}`
        );
      }
    } else if (year && makes && models) {
      setLoadingSearch(true);
      if (category || category_slug) {
        // setLoadingSearch(false);
        router?.push(
          `/${category || category_slug}/${year}/${makes}/${models}`
        );
      } else {
        // setLoadingSearch(false);
        router?.push(
          `/${category || categoryData[0]?.slug}/${year}/${makes}/${models}`
        );
      }
    } else {
      setLoadingSearch(false);
    }
  };

  return (
    <>
      {Boolean(skeletonLoading) ? (
        <>
          <section className="form-wrapper">
            <div className="container">
              <div
                className="form-inline mx-1 cover-search row overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="col-xl-2 col-12 py-2 px-4 placeholder"
                  style={{ backgroundColor: "#e18007", opacity: "0.4" }}
                >
                  <h5 className="placeholder bg-transparent col-12 mt-1 py-xl-4 py-0"></h5>
                </div>
                <div className="col-xl-8 col-12">
                  <div className="row pt-xl-0 pt-3">
                    <div className="col-xl-3 mb-xl-0 mb-3 col-12 placeholder-glow">
                      <h4 className="w-100 placeholder mb-0"></h4>
                    </div>
                    <div className="col-xl-3 mb-xl-0 mb-3 col-12 placeholder-glow">
                      <h4 className="w-100 placeholder mb-0"></h4>
                    </div>
                    <div className="col-xl-3 mb-xl-0 mb-3 col-12 placeholder-glow">
                      <h4 className="w-100 placeholder mb-0"></h4>
                    </div>
                    <div className="col-xl-3 mb-xl-0 mb-3 col-12 placeholder-glow">
                      <h4 className="w-100 placeholder mb-0"></h4>
                    </div>
                  </div>
                </div>
                <div
                  className="col-xl-2 col-sm-2 col-4 mx-auto py-2 px-4 placeholder mb-xl-0 mb-3"
                  style={{ backgroundColor: "#e18007", opacity: "0.4" }}
                >
                  <h5 className="placeholder bg-transparent col-12 mt-1 py-xl-4 py-0"></h5>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <div
            className={`${storeData?.language?.code != "en" && "sc"}`}
            id="scrollSearch"
          >
            <section className="form-wrapper">
              <div className="container">
                <div className="form-inline cover-search">
                  <h3
                    className={`search-title wrapWord ${
                      selectCategoryData[0]?.details?.short_name?.length >= 15
                        ? "small-text"
                        : ""
                    }`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {selectCategoryData?.length ? (
                      storeData?.store_id == "35" ||
                      storeData?.store_id == "40" ? (
                        <>
                          <div
                            className="d-inline-block"
                            style={{ width: "max-content" }}
                          >
                            {translate("search_text")}
                          </div>{" "}
                          <br /> {selectCategoryData[0]?.details?.short_name}
                        </>
                      ) : (
                        <>
                          {selectCategoryData[0]?.details?.short_name} <br />{" "}
                          {translate("search_text")}
                        </>
                      )
                    ) : storeData?.store_id == "35" ||
                      storeData?.store_id == "40" ? (
                      <>
                        <div
                          className="d-inline-block"
                          style={{ width: "max-content" }}
                        >
                          {translate("search_text")}
                        </div>{" "}
                        <br /> {translate("vehicle")}
                      </>
                    ) : (
                      <>
                        {translate("vehicle")} <br /> {translate("search_text")}
                      </>
                    )}
                  </h3>

                  {selectCategoryData?.length ? (
                    Boolean(
                      selectCategoryData[0]?.details?.search_year_text
                    ) ? (
                      <div className="form-group text-center">
                        <Popover
                          isOpen={!year}
                          positions={["bottom", "top", "left", "right"]}
                          // padding={10}
                          content={({ position, childRect, popoverRect }) => (
                            <ArrowContainer
                              position={position}
                              childRect={childRect}
                              popoverRect={popoverRect}
                              arrowColor={"#f45d01"}
                              arrowSize={10}
                              arrowStyle={{ opacity: 1 }}
                              className="popover-arrow-container"
                              arrowClassName="popover-arrow"
                            >
                              <div
                                style={{
                                  backgroundColor: "#f45d01",
                                  opacity: 1,
                                  padding: ".5rem 0.75rem",
                                  borderRadius: "5px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  fontSize: ".875rem",
                                  textShadow: "1px 1px 1px #000",
                                  fontFamily:
                                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                                }}
                              >
                                {Boolean(yearData?.length)
                                  ? selectCategoryData?.length
                                    ? translate("select") +
                                      " " +
                                      selectCategoryData[0]?.details
                                        ?.search_year_text
                                    : translate("select") +
                                      " " +
                                      translate("year")
                                  : translate("loading")}
                              </div>
                            </ArrowContainer>
                          )}
                        >
                          <div>
                            {" "}
                            <label
                              className={`select-label ${
                                selectCategoryData[0]?.details?.short_name
                                  ?.length >= 15
                                  ? "small-text"
                                  : ""
                              }`}
                              htmlFor="year"
                              data-title="Select Vehicle Year"
                            >
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_year_text
                                : translate("year")}
                              &nbsp;
                            </label>{" "}
                            <select
                              className={`form-control select2-create
                         ${
                           Boolean(!year) &&
                           Boolean(yearData?.length) &&
                           "required-border"
                         } `}
                              disabled={
                                Boolean(yearData?.length) ? "" : "disabled"
                              }
                              data-bs-toggle={
                                Boolean(mobileScreen) &&
                                Boolean(yearData?.length)
                                  ? "modal"
                                  : ""
                              }
                              data-bs-target={
                                Boolean(mobileScreen) &&
                                Boolean(yearData?.length)
                                  ? "#staticBackdrop"
                                  : ""
                              }
                              name="drop1"
                              id="drop1"
                              value={year || ""}
                              onClick={(e) => {
                                dispatch(setStateAction({ state: false }));
                                setPopupBody(false);
                                Boolean(mobileScreen) && setMobileYear(true);
                                Boolean(mobileScreen) && setLoading(false);
                              }}
                              onChange={(e) => handleMake(e?.target?.value)}
                            >
                              <option value="" disabled={disable}>
                                {translate("select")}
                                &nbsp;
                                {selectCategoryData?.length
                                  ? selectCategoryData[0]?.details
                                      ?.search_year_text
                                  : translate("year")}
                                &nbsp;
                              </option>
                              {yearData?.map((item) => (
                                <option key={item?.year} value={item?.year}>
                                  {item?.year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Popover>
                      </div>
                    ) : null
                  ) : Boolean(category_slug === undefined) ? (
                    <div className="form-group text-center">
                      <Popover
                        isOpen={!year}
                        positions={["bottom"]}
                        // padding={10}
                        content={({ position, childRect, popoverRect }) => (
                          <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={"#f45d01"}
                            arrowSize={10}
                            arrowStyle={{ opacity: 1 }}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                          >
                            <div
                              style={{
                                backgroundColor: "#f45d01",
                                opacity: 1,
                                padding: ".5rem 0.75rem",
                                borderRadius: "5px",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: ".875rem",
                                textShadow: "1px 1px 1px #000",
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                              }}
                            >
                              {Boolean(yearData?.length)
                                ? selectCategoryData?.length
                                  ? translate("select") +
                                    " " +
                                    selectCategoryData[0]?.details
                                      ?.search_year_text
                                  : translate("select") +
                                    " " +
                                    translate("year")
                                : translate("loading")}
                            </div>
                          </ArrowContainer>
                        )}
                      >
                        <div>
                          <label
                            className={`select-label ${
                              selectCategoryData[0]?.details?.short_name
                                ?.length >= 15
                                ? "small-text"
                                : ""
                            }`}
                            htmlFor="year"
                            data-title="Select Vehicle Year"
                          >
                            {selectCategoryData?.length
                              ? selectCategoryData[0]?.details?.search_year_text
                              : translate("year")}
                            &nbsp;
                          </label>
                          <select
                            className={`form-control select2-create ${
                              Boolean(!year) &&
                              Boolean(yearData?.length) &&
                              "required-border"
                            } `}
                            disabled={
                              Boolean(yearData?.length) ? "" : "disabled"
                            }
                            data-bs-toggle={
                              Boolean(mobileScreen) && Boolean(yearData?.length)
                                ? "modal"
                                : ""
                            }
                            data-bs-target={
                              Boolean(mobileScreen) && Boolean(yearData?.length)
                                ? "#staticBackdrop"
                                : ""
                            }
                            name="drop1"
                            id="drop1"
                            value={year || ""}
                            onClick={(e) => {
                              setPopupBody(false);
                              Boolean(mobileScreen) && setMobileYear(true);
                            }}
                            onChange={(e) => handleMake(e?.target?.value)}
                          >
                            <option value="" disabled={disable}>
                              {translate("select")}
                              &nbsp;
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_year_text
                                : translate("year")}
                              &nbsp;
                            </option>
                            {yearData?.map((item) => (
                              <option key={item?.year} value={item?.year}>
                                {item?.year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Popover>
                    </div>
                  ) : null}

                  {selectCategoryData?.length ? (
                    Boolean(
                      selectCategoryData[0]?.details?.search_make_text
                    ) ? (
                      <div className="form-group text-center">
                        <Popover
                          isOpen={Boolean(year) && !Boolean(make)}
                          positions={["bottom"]}
                          // padding={10}
                          content={({ position, childRect, popoverRect }) => (
                            <ArrowContainer
                              position={position}
                              childRect={childRect}
                              popoverRect={popoverRect}
                              arrowColor={"#f45d01"}
                              arrowSize={10}
                              arrowStyle={{ opacity: 1 }}
                              className="popover-arrow-container"
                              arrowClassName="popover-arrow"
                            >
                              <div
                                style={{
                                  backgroundColor: "#f45d01",
                                  opacity: 1,
                                  padding: ".5rem 0.75rem",
                                  borderRadius: "5px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  fontSize: ".875rem",
                                  textShadow: "1px 1px 1px #000",
                                  fontFamily:
                                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                                }}
                              >
                                {Boolean(makeData?.length)
                                  ? selectCategoryData?.length
                                    ? translate("select") +
                                      " " +
                                      selectCategoryData[0]?.details
                                        ?.search_make_text
                                    : translate("select") +
                                      " " +
                                      translate("make")
                                  : translate("loading")}
                              </div>
                            </ArrowContainer>
                          )}
                        >
                          <div>
                            <label
                              className={`select-label ${
                                selectCategoryData[0]?.details?.short_name
                                  ?.length >= 15
                                  ? "small-text"
                                  : ""
                              }`}
                              htmlFor="make"
                              data-title="Select Vehicle Make"
                            >
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_make_text
                                : translate("make")}
                              &nbsp;
                            </label>

                            <select
                              // className="form-control select2-create"
                              disabled={
                                Boolean(year) && Boolean(makeData?.length)
                                  ? ""
                                  : "disabled"
                              }
                              className={`form-control select2-create ${
                                Boolean(year) &&
                                !Boolean(make) &&
                                Boolean(makeData?.length) &&
                                "required-border"
                              }
                        `}
                              data-bs-toggle={
                                Boolean(mobileScreen) &&
                                // (Boolean(make) || Boolean(yearData?.length))
                                Boolean(year) &&
                                Boolean(makeData?.length)
                                  ? "modal"
                                  : ""
                              }
                              data-bs-target={
                                Boolean(mobileScreen) &&
                                // (Boolean(make) || Boolean(yearData?.length))
                                Boolean(year) &&
                                Boolean(makeData?.length)
                                  ? "#staticBackdrop"
                                  : ""
                              }
                              name="drop2"
                              id="drop2"
                              value={make || ""}
                              onClick={(e) => {
                                setMake(e?.target?.value);
                                setPopupBody(false);
                                Boolean(mobileScreen) &&
                                  Boolean(make) &&
                                  setMobileMake(true);
                                Boolean(mobileScreen) &&
                                  Boolean(yearData?.length) &&
                                  setMobileMake(true);
                              }}
                              onChange={(e) => {
                                setMake(e?.target?.value);
                                handleModel(e?.target?.value);
                              }}
                            >
                              <option value="" disabled={disable}>
                                {translate("select")}
                                &nbsp;
                                {selectCategoryData?.length
                                  ? selectCategoryData[0]?.details
                                      ?.search_make_text
                                  : translate("make")}
                                &nbsp;
                              </option>
                              {makeData.map((item) => (
                                <option value={item?.slug} key={item?.name}>
                                  {item?.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Popover>
                      </div>
                    ) : null
                  ) : Boolean(category_slug === undefined) ? (
                    <div className="form-group text-center">
                      <Popover
                        isOpen={Boolean(year) && !Boolean(make)}
                        positions={["bottom"]}
                        // padding={10}
                        content={({ position, childRect, popoverRect }) => (
                          <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={"#f45d01"}
                            arrowSize={10}
                            arrowStyle={{ opacity: 1 }}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                          >
                            <div
                              style={{
                                backgroundColor: "#f45d01",
                                opacity: 1,
                                padding: ".5rem 0.75rem",
                                borderRadius: "5px",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: ".875rem",
                                textShadow: "1px 1px 1px #000",
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                              }}
                            >
                              {Boolean(makeData?.length)
                                ? selectCategoryData?.length
                                  ? translate("select") +
                                    " " +
                                    selectCategoryData[0]?.details
                                      ?.search_make_text
                                  : translate("select") +
                                    " " +
                                    translate("make")
                                : translate("loading")}
                            </div>
                          </ArrowContainer>
                        )}
                      >
                        <div>
                          <label
                            className={`select-label ${
                              selectCategoryData[0]?.details?.short_name
                                ?.length >= 15
                                ? "small-text"
                                : ""
                            }`}
                            htmlFor="make"
                            data-title="Select Vehicle Make"
                          >
                            {selectCategoryData?.length
                              ? selectCategoryData[0]?.details?.search_make_text
                              : translate("make")}
                            &nbsp;
                          </label>
                          <select
                            // className="form-control select2-create"
                            disabled={
                              Boolean(year) && Boolean(makeData?.length)
                                ? ""
                                : "disabled"
                            }
                            className={`form-control select2-create ${
                              Boolean(year) &&
                              !Boolean(make) &&
                              Boolean(makeData?.length) &&
                              "required-border"
                            }
                       `}
                            data-bs-toggle={
                              Boolean(mobileScreen) &&
                              // (Boolean(make) || Boolean(yearData?.length))
                              Boolean(year) &&
                              Boolean(makeData?.length)
                                ? "modal"
                                : ""
                            }
                            data-bs-target={
                              Boolean(mobileScreen) &&
                              // (Boolean(make) || Boolean(yearData?.length))
                              Boolean(year) &&
                              Boolean(makeData?.length)
                                ? "#staticBackdrop"
                                : ""
                            }
                            name="drop2"
                            id="drop2"
                            value={make || ""}
                            onClick={(e) => {
                              setPopupBody(false);
                              Boolean(mobileScreen) &&
                                Boolean(make) &&
                                setMobileMake(true);
                              Boolean(mobileScreen) &&
                                Boolean(yearData?.length) &&
                                setMobileMake(true);
                            }}
                            onChange={(e) => handleModel(e?.target?.value)}
                          >
                            <option value="" disabled={disable}>
                              {translate("select")}
                              &nbsp;
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_make_text
                                : translate("make")}
                              &nbsp;
                            </option>
                            {makeData.map((item) => (
                              <option value={item?.slug} key={item?.name}>
                                {item?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Popover>
                    </div>
                  ) : null}

                  {selectCategoryData?.length ? (
                    Boolean(
                      selectCategoryData[0]?.details?.search_model_text
                    ) ? (
                      <div className="form-group text-center">
                        <Popover
                          isOpen={Boolean(make) && !Boolean(model)}
                          positions={["bottom"]}
                          // padding={10}
                          content={({ position, childRect, popoverRect }) => (
                            <ArrowContainer
                              position={position}
                              childRect={childRect}
                              popoverRect={popoverRect}
                              arrowColor={"#f45d01"}
                              arrowSize={10}
                              arrowStyle={{ opacity: 1 }}
                              className="popover-arrow-container"
                              arrowClassName="popover-arrow"
                            >
                              <div
                                style={{
                                  backgroundColor: "#f45d01",
                                  opacity: 1,
                                  padding: ".5rem 0.75rem",
                                  borderRadius: "5px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  fontSize: ".875rem",
                                  textShadow: "1px 1px 1px #000",
                                  fontFamily:
                                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                                }}
                              >
                                {Boolean(modelData?.vehicle?.length)
                                  ? selectCategoryData?.length
                                    ? translate("select") +
                                      " " +
                                      selectCategoryData[0]?.details
                                        ?.search_model_text
                                    : translate("select") +
                                      " " +
                                      translate("model")
                                  : translate("loading")}
                              </div>
                            </ArrowContainer>
                          )}
                        >
                          <div>
                            <label
                              className={`select-label ${
                                selectCategoryData[0]?.details?.short_name
                                  ?.length >= 15
                                  ? "small-text"
                                  : ""
                              }`}
                              htmlFor="model"
                              data-title="Select Vehicle Model"
                            >
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_model_text
                                : translate("model")}
                              &nbsp;
                            </label>
                            <select
                              // className="form-control select2-create"
                              disabled={
                                Boolean(make) &&
                                (Boolean(modelData?.vehicle?.length) ||
                                  Boolean(modelData?.length))
                                  ? ""
                                  : "disabled"
                              }
                              className={`form-control select2-create 
                        ${
                          Boolean(make) &&
                          !Boolean(model) &&
                          Boolean(modelData?.vehicle?.length) &&
                          "required-border"
                        }
                        
                        `}
                              // ${
                              //   Boolean(mobileScreen) &&
                              //   Boolean(mobileModel) &&
                              //   "d-none"
                              // }
                              data-bs-toggle={
                                Boolean(mobileScreen) &&
                                // (Boolean(model) && Boolean(modelData?.length))
                                Boolean(make) &&
                                (Boolean(modelData?.vehicle?.length) ||
                                  Boolean(modelData?.length))
                                  ? "modal"
                                  : ""
                              }
                              data-bs-target={
                                Boolean(mobileScreen) &&
                                // (Boolean(model) && Boolean(modelData?.length))
                                Boolean(make) &&
                                (Boolean(modelData?.vehicle?.length) ||
                                  Boolean(modelData?.length))
                                  ? "#staticBackdrop"
                                  : ""
                              }
                              name="drop3"
                              id="drop3"
                              value={model || ""}
                              onClick={(e) => {
                                setPopupBody(false);
                                Boolean(mobileScreen) &&
                                  Boolean(makeData?.length) &&
                                  setMobileModel(true);
                                Boolean(mobileScreen) &&
                                  Boolean(model) &&
                                  setMobileModel(true);
                              }}
                              // onChange={e=>handleChange(e?.target?.value)}
                              onChange={(e) => {
                                setModal(e?.target?.value);
                                if (selectCategoryData[0]?.is_body === false) {
                                  setModal(e?.target?.value);
                                  setLoadingSearch(true);
                                  searchProductData(
                                    year,
                                    make,
                                    e?.target?.value
                                  );
                                } else {
                                  handleChange(e?.target?.value);
                                  // handleBody(e?.target?.value);
                                }
                              }}
                            >
                              <option value="" disabled={disable}>
                                {translate("select")}
                                &nbsp;
                                {selectCategoryData?.length
                                  ? selectCategoryData[0]?.details
                                      ?.search_model_text
                                  : translate("model")}
                                &nbsp;
                              </option>

                              {Boolean(modelData?.vehicle) &&
                                modelData?.vehicle?.map((item, i) => {
                                  return (
                                    <Fragment key={i + "modelData"}>
                                      {Boolean(
                                        modelData?.multi_category_model
                                      ) && (
                                        <option
                                          value="undefined"
                                          category_id="undefined"
                                          disabled
                                        >
                                          -----------{translate(item?.category)}
                                          -----------
                                        </option>
                                      )}
                                      {Boolean(item?.vehicles) &&
                                        item?.vehicles?.map((items) => (
                                          <option
                                            // value={item?.category}
                                            value={items?.slug}
                                            key={items?.name}
                                          >
                                            {items?.name}
                                          </option>
                                        ))}
                                    </Fragment>
                                  );
                                })}
                            </select>
                          </div>
                        </Popover>
                      </div>
                    ) : null
                  ) : Boolean(category_slug === undefined) ? (
                    <div className="form-group text-center">
                      <Popover
                        isOpen={Boolean(make) && !Boolean(model)}
                        positions={["bottom"]}
                        // padding={10}
                        content={({ position, childRect, popoverRect }) => (
                          <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={"#f45d01"}
                            arrowSize={10}
                            arrowStyle={{ opacity: 1 }}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                          >
                            <div
                              style={{
                                backgroundColor: "#f45d01",
                                opacity: 1,
                                padding: ".5rem 0.75rem",
                                borderRadius: "5px",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: ".875rem",
                                textShadow: "1px 1px 1px #000",
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                              }}
                            >
                              {Boolean(modelData?.vehicle?.length)
                                ? selectCategoryData?.length
                                  ? translate("select") +
                                    " " +
                                    selectCategoryData[0]?.details
                                      ?.search_model_text
                                  : translate("select") +
                                    " " +
                                    translate("model")
                                : translate("loading")}
                            </div>
                          </ArrowContainer>
                        )}
                      >
                        <div>
                          <label
                            className={`select-label ${
                              selectCategoryData[0]?.details?.short_name
                                ?.length >= 15
                                ? "small-text"
                                : ""
                            }`}
                            htmlFor="model"
                            data-title="Select Vehicle Model"
                          >
                            {selectCategoryData?.length
                              ? selectCategoryData[0]?.details
                                  ?.search_model_text
                              : translate("model")}
                            &nbsp;
                          </label>
                          <select
                            // className="form-control select2-create"
                            disabled={
                              Boolean(make) &&
                              Boolean(modelData?.vehicle?.length)
                                ? ""
                                : "disabled"
                            }
                            className={`form-control select2-create
                      ${
                        Boolean(make) &&
                        !Boolean(model) &&
                        Boolean(modelData?.vehicle?.length) &&
                        "required-border"
                      }
                       `}
                            data-bs-toggle={
                              Boolean(mobileScreen) &&
                              // (Boolean(model) || Boolean(makeData?.length))
                              Boolean(make) &&
                              Boolean(modelData?.vehicle?.length)
                                ? "modal"
                                : ""
                            }
                            data-bs-target={
                              Boolean(mobileScreen) &&
                              // (Boolean(model) || Boolean(makeData?.length))
                              Boolean(make) &&
                              Boolean(modelData?.vehicle?.length)
                                ? "#staticBackdrop"
                                : ""
                            }
                            name="drop3"
                            id="drop3"
                            value={model || ""}
                            onClick={(e) => {
                              Boolean(mobileScreen) &&
                                Boolean(makeData?.length) &&
                                setMobileModel(true);
                              setPopupBody(false);
                              Boolean(mobileScreen) &&
                                Boolean(model) &&
                                setMobileModel(true);
                            }}
                            onChange={(e) => {
                              setModal(e?.target?.value);
                              if (selectCategoryData[0]?.is_body === false) {
                                setModal(e?.target?.value);
                                setLoadingSearch(true);
                                searchProductData(year, make, e?.target?.value);
                              } else {
                                handleChange(e?.target?.value);
                                // handleBody(e?.target?.value);
                              }
                            }}
                            // onChange={(e) => {
                            //   // handleBody(e?.target?.value)
                            //   handleChange(e?.target?.value);
                            // }}
                          >
                            <option value="" disabled={disable}>
                              {translate("select")}
                              &nbsp;
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_model_text
                                : translate("model")}
                              &nbsp;
                            </option>
                            {
                              Boolean(modelData?.vehicle) &&
                                modelData?.vehicle?.map((item, i) => (
                                  <Fragment key={i + "modelData"}>
                                    {Boolean(
                                      modelData?.multi_category_model
                                    ) && (
                                      <option
                                        value="undefined"
                                        category_id="undefined"
                                        disabled
                                      >
                                        -----------{translate(item?.category)}
                                        -----------
                                      </option>
                                    )}
                                    {Boolean(item?.vehicles) &&
                                      item?.vehicles?.map((items) => (
                                        <option
                                          // value={item?.category}
                                          value={items?.slug}
                                          key={items?.name}
                                        >
                                          {items?.name}
                                        </option>
                                      ))}
                                  </Fragment>
                                ))
                              // : modelData?.map((item) => (
                              //     <option value={item?.slug} key={item?.name}>
                              //       {item?.name}
                              //     </option>
                              //   ))
                            }
                            {/* {modelData?.map((item) => (
                          <option value={item?.slug} key={item?.name}>
                            {item?.name}
                          </option>
                        ))} */}
                          </select>
                        </div>
                      </Popover>
                    </div>
                  ) : null}

                  {selectCategoryData?.length ? (
                    selectCategoryData[0]?.is_body === true ? (
                      <div
                        className="form-group text-center"
                        style={{ position: "relative" }}
                      >
                        <Popover
                          isOpen={Boolean(model) && !Boolean(body)}
                          positions={["bottom"]}
                          // padding={10}
                          content={({ position, childRect, popoverRect }) => (
                            <ArrowContainer
                              position={position}
                              childRect={childRect}
                              popoverRect={popoverRect}
                              arrowColor={"#f45d01"}
                              arrowSize={10}
                              arrowStyle={{ opacity: 1 }}
                              className="popover-arrow-container"
                              arrowClassName="popover-arrow"
                            >
                              <div
                                style={{
                                  backgroundColor: "#f45d01",
                                  opacity: 1,
                                  padding: ".5rem 0.75rem",
                                  borderRadius: "5px",
                                  color: "#fff",
                                  fontWeight: "600",
                                  fontSize: ".875rem",
                                  textShadow: "1px 1px 1px #000",
                                  fontFamily:
                                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                                }}
                              >
                                {Boolean(bodyData?.length)
                                  ? selectCategoryData?.length
                                    ? translate("select") +
                                      " " +
                                      selectCategoryData[0]?.details
                                        ?.search_body_text
                                    : translate("select") +
                                      " " +
                                      translate("body")
                                  : translate("loading")}
                              </div>
                            </ArrowContainer>
                          )}
                        >
                          <div>
                            <label
                              className={`select-label ${
                                selectCategoryData[0]?.details?.short_name
                                  ?.length >= 15
                                  ? "small-text"
                                  : ""
                              }`}
                              htmlFor="body"
                              data-title="Select Vehicle Body"
                            >
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_body_text
                                : translate("body")}
                              &nbsp;
                            </label>
                            <select
                              // className="form-control select2-create"
                              disabled={
                                Boolean(model) && Boolean(bodyData?.length)
                                  ? ""
                                  : "disabled"
                              }
                              className={`form-control select2-create 
                        ${
                          Boolean(model) &&
                          !Boolean(body) &&
                          Boolean(bodyData?.length) &&
                          "required-border"
                        }
                        `}
                              data-bs-toggle={
                                Boolean(mobileScreen) && Boolean(model)
                                  ? "modal"
                                  : ""
                              }
                              data-bs-target={
                                Boolean(mobileScreen) && Boolean(model)
                                  ? "#staticBackdrop"
                                  : ""
                              }
                              // aria-autoclose="false"
                              name="drop4"
                              id="drop4"
                              value={body || ""}
                              onClick={(e) => {
                                Boolean(mobileScreen) &&
                                  Boolean(model) &&
                                  setMobileBody(true);
                                !Boolean(mobileScreen) &&
                                Boolean(bodyData?.length)
                                  ? setPopupBody(true)
                                  : setPopupBody(false);
                              }}
                              onChange={(e) => {
                                setLoadingSearch(true);
                                setBody(e?.target?.value);
                                // searchProduct1(e?.target?.value);
                                searchProductData(
                                  year,
                                  make,
                                  model,
                                  e?.target?.value,
                                  cat
                                );
                              }}
                            >
                              <option
                                value=""
                                disabled={disable}
                                className={
                                  Boolean(isBodyImage) ||
                                  Boolean(selectCategoryData[0]?.is_body_image)
                                    ? "d-none"
                                    : ""
                                }
                              >
                                {translate("select")}
                                &nbsp;
                                {selectCategoryData?.length
                                  ? selectCategoryData[0]?.details
                                      ?.search_body_text
                                  : translate("body")}
                              </option>
                              {bodyData?.map((item) => (
                                <option
                                  value={item?.slug}
                                  key={item?.name}
                                  className={
                                    Boolean(isBodyImage) ||
                                    Boolean(
                                      selectCategoryData[0]?.is_body_image
                                    )
                                      ? "d-none"
                                      : ""
                                  }
                                  onClick={(e) => {
                                    setLoadingSearch(true);
                                  }}
                                  // onChange={searchProduct1(item?.slug)}
                                >
                                  {item?.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Popover>

                        {Boolean(isBodyImage) ||
                        Boolean(selectCategoryData[0]?.is_body_image)
                          ? Boolean(popupBody) && (
                              <div
                                className=" bg-white  panel panel-primary truck-body-panel"
                                style={{ display: "block" }}
                              >
                                <div
                                  className="panel-heading text-white text-center"
                                  style={{ padding: "5px" }}
                                >
                                  {translate("select_body")}:{" "}
                                  <span
                                    className="close-truck-body"
                                    onClick={(e) => setPopupBody(false)}
                                  >
                                    x
                                  </span>
                                </div>
                                <div
                                  className="panel-body body_type_option"
                                  id="truck_body"
                                  style={{
                                    maxHeight: "340px",
                                    overflow: "scroll",
                                    padding: "10px",
                                  }}
                                >
                                  <div className="row col-12 p-0 m-0">
                                    {bodyData?.sort((a, b) => {
                                      if (Boolean(a?.body_image === null)) {
                                        return 1;
                                      }
                                      if (Boolean(b?.body_image === null)) {
                                        return -1;
                                      }
                                      if (Boolean(a?.body_image === b?.body_image)) {
                                        return 0;
                                      }
                                      return a?.body_image < b?.body_image ? -1 : 1;
                                    })?.map((item, i) => (
                                      <div
                                        className="col-sm-3 col-6 mb-2"
                                        key={i + "body_images"}
                                      >
                                        {/* <Link
                                    href={""}
                                    style={{ height: "100%" }}
                                    onClick={(e)=>{
                                      setBody(item?.slug)
                                      setPopupBody(false)
                                    }}
                                  > */}
                                        <div
                                          className="truck-body-list-inner"
                                          onClick={(e) => {
                                            setBody(item?.slug);
                                            setPopupBody(false);
                                            // setLoadingSearch(true);
                                            // searchProduct1(item?.slug);
                                            searchProductData(
                                              year,
                                              make,
                                              model,
                                              item?.slug,
                                              cat
                                            );
                                          }}
                                          onChange={(e) => {
                                            setBody(item?.slug);
                                            setLoadingSearch(true);
                                          }}
                                        >
                                          <div>
                                            {Boolean(item?.body_image) && (
                                              <LazyLoad height="100%" offset={120}>
                                                <img
                                                  className="truck-body-image"
                                                  alt={item?.name}
                                                  src={
                                                    storeData?.image_path + "fit-in/200x200/" +
                                                    item?.body_image
                                                  }
                                                />
                                              </LazyLoad>
                                            )}
                                          </div>
                                          <div className="truck-body-name">
                                            {item?.name}
                                          </div>
                                        </div>
                                        {/* </Link> */}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          : null}
                      </div>
                    ) : null
                  ) : Boolean(category_slug === undefined) ? (
                    <div
                      className="form-group text-center"
                      style={{ position: "relative" }}
                    >
                      <Popover
                        isOpen={Boolean(model) && !Boolean(body)}
                        positions={["bottom"]}
                        // padding={10}
                        content={({ position, childRect, popoverRect }) => (
                          <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={"#f45d01"}
                            arrowSize={10}
                            arrowStyle={{ opacity: 1 }}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                          >
                            <div
                              style={{
                                backgroundColor: "#f45d01",
                                opacity: 1,
                                padding: ".5rem 0.75rem",
                                borderRadius: "5px",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: ".875rem",
                                textShadow: "1px 1px 1px #000",
                                fontFamily:
                                  "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                              }}
                            >
                              {Boolean(bodyData?.length)
                                ? selectCategoryData?.length
                                  ? translate("select") +
                                    " " +
                                    selectCategoryData[0]?.details
                                      ?.search_body_text
                                  : translate("select") +
                                    " " +
                                    translate("body")
                                : translate("loading")}
                            </div>
                          </ArrowContainer>
                        )}
                      >
                        <div>
                          <label
                            className={`select-label ${
                              selectCategoryData[0]?.details?.short_name
                                ?.length >= 15
                                ? "small-text"
                                : ""
                            }`}
                            htmlFor="body"
                            data-title="Select Vehicle Body"
                          >
                            {selectCategoryData?.length
                              ? selectCategoryData[0]?.details?.search_body_text
                              : translate("body")}
                            &nbsp;
                          </label>

                          <select
                            // className="form-control select2-create"
                            disabled={
                              Boolean(model) && Boolean(bodyData?.length)
                                ? ""
                                : "disabled"
                            }
                            className={`form-control select2-create 
                      ${
                        Boolean(model) &&
                        !Boolean(body) &&
                        Boolean(bodyData?.length) &&
                        "required-border"
                      }
                      `}
                            data-bs-toggle={
                              Boolean(mobileScreen) && Boolean(body)
                                ? "modal"
                                : ""
                            }
                            data-bs-target={
                              Boolean(mobileScreen) && Boolean(body)
                                ? "#staticBackdrop"
                                : ""
                            }
                            name="drop4"
                            id="drop4"
                            value={body || ""}
                            onClick={(e) => {
                              // setLoadingSearch(true);
                              Boolean(bodyData?.length)
                                ? setPopupBody(true)
                                : setPopupBody(false);
                              Boolean(mobileScreen) &&
                                Boolean(body) &&
                                setMobileBody(true);
                            }}
                            onChange={(e) => {
                              setLoadingSearch(true);
                              setBody(e?.target?.value);
                              // searchProduct1(e?.target?.value);
                              searchProductData(
                                year,
                                make,
                                model,
                                e?.target?.value,
                                cat
                              );
                            }}
                          >
                            <option
                              value=""
                              disabled={disable}
                              className={
                                Boolean(isBodyImage) ||
                                Boolean(selectCategoryData[0]?.is_body_image)
                                  ? "d-none"
                                  : ""
                              }
                            >
                              {translate("select")}
                              &nbsp;
                              {selectCategoryData?.length
                                ? selectCategoryData[0]?.details
                                    ?.search_body_text
                                : translate("body")}
                            </option>
                            {bodyData?.map((item) => (
                              <option
                                value={item?.slug}
                                key={item?.name}
                                onClick={(e) => {
                                  setLoadingSearch(true);
                                }}
                                className={
                                  Boolean(isBodyImage) ||
                                  Boolean(selectCategoryData[0]?.is_body_image)
                                    ? "d-none"
                                    : ""
                                }
                              >
                                {item?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Popover>
                      {Boolean(isBodyImage) ||
                      Boolean(selectCategoryData[0]?.is_body_image)
                        ? Boolean(popupBody) && (
                            <div
                              className=" bg-white  panel panel-primary truck-body-panel"
                              style={{ display: "block" }}
                            >
                              <div
                                className="panel-heading text-white text-center"
                                style={{ padding: "5px" }}
                              >
                                {translate("select_body")}:{" "}
                                <span
                                  className="close-truck-body"
                                  onClick={(e) => setPopupBody(false)}
                                >
                                  x
                                </span>
                              </div>
                              <div
                                className="panel-body body_type_option"
                                id="truck_body"
                                style={{
                                  maxHeight: "340px",
                                  overflow: "scroll",
                                  padding: "10px",
                                }}
                              >
                                <div className="row col-12 p-0 m-0">
                                  {bodyData?.map((item, i) => (
                                    <div
                                      className="col-sm-3 col-6 mb-2"
                                      key={i + "body_images"}
                                    >
                                      {/* <Link
                                    href={""}
                                    style={{ height: "100%" }}
                                    onClick={(e)=>{
                                      setBody(item?.slug)
                                      setPopupBody(false)
                                    }}
                                  > */}
                                      <div
                                        className="truck-body-list-inner"
                                        onClick={(e) => {
                                          setBody(item?.slug);
                                          setPopupBody(false);
                                          // setLoadingSearch(true);
                                          // searchProduct1(item?.slug);
                                          searchProductData(
                                            year,
                                            make,
                                            model,
                                            item?.slug,
                                            cat
                                          );
                                        }}
                                        onChange={(e) => {
                                          setBody(item?.slug);
                                          setLoadingSearch(true);
                                        }}
                                      >
                                        <div>
                                          {Boolean(item?.body_image) && (
                                            <LazyLoad height="100%" offset={120}>
                                              <img
                                                className="truck-body-image"
                                                alt={item?.name}
                                                src={
                                                  storeData?.image_path +
                                                  item?.body_image
                                                }
                                              />
                                            </LazyLoad>
                                          )}
                                        </div>
                                        <div className="truck-body-name">
                                          {item?.name}
                                        </div>
                                      </div>
                                      {/* </Link> */}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        : null}
                    </div>
                  ) : null}

                  <Popover
                    isOpen={
                      selectCategoryData[0]?.is_body === true
                        ? Boolean(body) && Boolean(loadingSearch)
                        : Boolean(model) && Boolean(loadingSearch)
                    }
                    positions={["bottom"]}
                    // padding={10}
                    content={({ position, childRect, popoverRect }) => (
                      <ArrowContainer
                        position={position}
                        childRect={childRect}
                        popoverRect={popoverRect}
                        arrowColor={"#f45d01"}
                        arrowSize={10}
                        arrowStyle={{ opacity: 1 }}
                        className="popover-arrow-container"
                        arrowClassName="popover-arrow"
                      >
                        <div
                          style={{
                            backgroundColor: "#f45d01",
                            opacity: 1,
                            padding: ".5rem 0.75rem",
                            borderRadius: "5px",
                            color: "#fff",
                            fontWeight: "600",
                            fontSize: ".875rem",
                            textShadow: "1px 1px 1px #000",
                            fontFamily:
                              "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol ,Noto Color Emoji",
                          }}
                        >
                          {translate("loading")}
                        </div>
                      </ArrowContainer>
                    )}
                  >
                    <button
                      className="btn btn-primary vehicle_btn-view_all"
                      // onClick={searchProductData(make, model, body)}
                    >
                      {translate("search")}
                    </button>
                  </Popover>
                </div>
              </div>
            </section>
          </div>

          <div
            className="modal p-0 mobile cstmmodel"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-fullscreen modal-lg">
              <div className="modal-content">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="dialogclose"
                >
                  <span aria-hidden="true"></span>
                </button>
                <div className="modal-body">
                  {Boolean(mobileYear) && (
                    <div
                      className="nexted-list-floating"
                      style={{ display: "block" }}
                    >
                      {loading && (
                        <div className="loader-div">
                          <div className="text-center">
                            <img
                              src={
                                "https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                              }
                              alt="Loading.."
                              id="page-loading"
                              height={"30px"}
                              width={"30px"}
                            />
                          </div>
                        </div>
                      )}
                      <div className="mobile-cover-search nested-navigation nested-list-container">
                        <div className="nested-list-header">
                          <div className="nested-title">
                            {" "}
                            {translate("select")}
                            &nbsp;
                            {selectCategoryData?.length
                              ? selectCategoryData[0]?.details?.search_year_text
                              : translate("year")}
                          </div>
                          <div className="nested-list-back-btn back-root">
                            <span className="b fa fa-chevron-circle-left fa-lg"></span>
                            <span
                              className="n"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                setMobileYear(false);
                                setLoading(false);
                              }}
                            >
                              {translate("back")}
                            </span>
                          </div>
                        </div>
                        <div
                          className="list-title text-center w-100 p-1"
                          style={{ fontWeight: "bold", display: "none" }}
                        ></div>
                        <ul>
                          {yearData?.map((item) => (
                            <li
                              data-year={item?.year}
                              className="has-child"
                              key={item?.year}
                              onClick={(e) => handleMake(item?.year)}
                            >
                              <div>{item?.year}</div>
                              <span className="more fa fa-chevron-circle-right fa-lg"></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {Boolean(mobileMake) && (
                    <div
                      className="nexted-list-floating"
                      style={{ display: "block" }}
                    >
                      {loading && (
                        <div className="loader-div">
                          <div className="text-center">
                            <img
                              src={
                                "https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                              }
                              alt="Loading.."
                              id="page-loading"
                              height={"30px"}
                              width={"30px"}
                            />
                          </div>
                        </div>
                      )}
                      <div className="mobile-cover-search nested-navigation nested-list-container">
                        <div className="nested-list-header">
                          <div className="nested-title">{year || ""}</div>
                          <div className="nested-list-back-btn back-root">
                            <span className="b fa fa-chevron-circle-left fa-lg"></span>
                            <span
                              className="n"
                              onClick={() => {
                                setMobileMake(false);
                                setMobileYear(true);
                                setLoading(false);
                              }}
                            >
                              {translate("back")}
                            </span>
                          </div>
                        </div>
                        <div
                          className="list-title text-center w-100 p-1"
                          style={{ fontWeight: "bold" }}
                        >
                          {translate("select")}
                          &nbsp;
                          {selectCategoryData?.length
                            ? selectCategoryData[0]?.details?.search_make_text
                            : translate("make")}
                        </div>
                        <ul>
                          {makeData.map((item) => (
                            <li
                              key={item?.name}
                              className="has-child"
                              onClick={(e) => handleModel(item?.slug)}
                            >
                              <div className="title">{item?.name}</div>
                              <span className="more fa fa-chevron-circle-right fa-lg"></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {Boolean(mobileModel) && (
                    <div
                      className="nexted-list-floating"
                      style={{ display: "block" }}
                    >
                      {loading && (
                        <div className="loader-div">
                          <div className="text-center">
                            <img
                              src={
                                "https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                              }
                              alt="Loading.."
                              id="page-loading"
                              height={"30px"}
                              width={"30px"}
                            />
                          </div>
                        </div>
                      )}
                      <div className="mobile-cover-search nested-navigation nested-list-container">
                        <div className="nested-list-header">
                          <div className="nested-title">
                            {makeData?.find((x) => x?.slug == make)?.name || ""}
                          </div>
                          <div className="nested-list-back-btn back-root">
                            <span className="b fa fa-chevron-circle-left fa-lg"></span>
                            <span
                              className="n"
                              onClick={() => {
                                setMobileModel(false);
                                setMobileMake(true);
                                setMobileYear(false);
                                setLoading(false);
                              }}
                            >
                              {translate("back")}
                            </span>
                          </div>
                        </div>
                        <div
                          className="list-title text-center w-100 p-1"
                          style={{ fontWeight: "bold" }}
                        >
                          {translate("select")}
                          &nbsp;
                          {selectCategoryData?.length
                            ? selectCategoryData[0]?.details?.search_model_text
                            : translate("model")}
                        </div>
                        <ul>
                          {Boolean(modelData?.vehicle) &&
                            modelData?.vehicle?.map((item, i) => (
                              <Fragment key={i + "modelcategory"}>
                                {Boolean(modelData?.multi_category_model) && (
                                  <li
                                    key={i + "modelMobileData"}
                                    data-disabled="disabled"
                                    data-category-id="undefined"
                                    data-model="undefined"
                                    //  disabled="disabled"
                                    className="has-child"
                                  >
                                    <div style={{ textAlign: "center" }}>
                                      -----------{translate(item?.category)}
                                      -----------
                                    </div>
                                  </li>
                                )}
                                {Boolean(item?.vehicles) &&
                                  item?.vehicles?.map((items) => (
                                    <li
                                      className="has-child"
                                      onClick={(e) => handleChange(items?.slug)}
                                      key={items?.name}
                                    >
                                      <div>{items?.name}</div>
                                      <span className="more fa fa-chevron-circle-right fa-lg"></span>
                                    </li>
                                  ))}
                              </Fragment>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {Boolean(mobileBody) &&
                    Boolean(selectCategoryData[0]?.is_body || isBody) && (
                      <div
                        className="nexted-list-floating"
                        style={{ display: "block" }}
                      >
                        {loading && (
                          <div className="loader-div">
                            <div className="text-center">
                              <img
                                src={
                                  "https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                                }
                                alt="Loading.."
                                id="page-loading"
                                height={"30px"}
                                width={"30px"}
                              />
                            </div>
                          </div>
                        )}
                        <div className="mobile-cover-search nested-navigation nested-list-container">
                          <div className="nested-list-header">
                            <div className="nested-title">
                              {modelName || ""}
                            </div>
                            <div className="nested-list-back-btn back-root">
                              <span className="b fa fa-chevron-circle-left fa-lg"></span>
                              <span
                                className="n"
                                onClick={() => {
                                  setMobileModel(true);
                                  setMobileBody(false);
                                  setMobileMake(false);
                                  setMobileYear(false);
                                  setLoading(false);
                                }}
                              >
                                {translate("back")}
                              </span>
                            </div>
                          </div>
                          <div
                            className="list-title text-center w-100 p-1"
                            style={{ fontWeight: "bold" }}
                          >
                            {translate("select")}
                            &nbsp;
                            {selectCategoryData?.length
                              ? selectCategoryData[0]?.details?.search_body_text
                              : translate("body")}
                          </div>

                          <ul>
                            {bodyData?.map((item) => (
                              <li
                                key={item?.name}
                                className="has-child text-center"
                                data-bs-dismiss="modal"
                                onClick={(e) => {
                                  setBody(item?.slug);
                                  // searchProduct1(item?.slug);
                                  searchProductData(
                                    year,
                                    make,
                                    model,
                                    item?.slug,
                                    cat
                                  );
                                }}
                              >
                                {Boolean(isBodyImage) ||
                                // Boolean(selectCategoryData[0]?.is_body_image)
                                Boolean(
                                  selectCategoryData[0]?.is_body_image
                                ) ? (
                                  <div>
                                    {Boolean(item?.body_image) && (
                                      <LazyLoad height="100%" offset={120}>
                                        <img
                                          style={{
                                            maxWidth: "100%",
                                            borderRadius: "10px",
                                          }}
                                          className="mb-2"
                                          alt="Crew Cab with 5.5ft Extra Short Bed"
                                          src={
                                            storeData?.image_path +
                                            "fit-in/200x200/" +
                                            item?.body_image
                                          }
                                        />
                                      </LazyLoad>
                                    )}
                                    <div className="alw-img-titl">
                                      {item?.name}
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div>{item?.name}</div>
                                    <span className="more fa fa-chevron-circle-right fa-lg"></span>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {Array?.isArray(tilesData) &&
            Boolean(tilesData?.length) &&
            !Boolean(router?.query?.year) &&
            !Boolean(router?.query?.make) &&
            !Boolean(router?.query?.model) && (
              <PageContentTiles
                tilesData={tilesData}
                tilesTitle={selectCategoryData[0]?.details?.tiles_title}
              />
            )}
        </>
      )}
    </>
  );
};

export default Search;
