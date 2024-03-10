import React, { Fragment, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import Header from "../../component/Header/index";
import Footer from "../../component/Footer/Footer";
import Link from "next/link";
import BlogSearch from "../../component/blogSearch/BlogSearch";
import axiosApi from "../../axios_instance";
import { createMarkup } from "../../common_function/functions";
import { useSelector } from "react-redux";
import {
  setSessionAxios,
  setSessionRes,
} from "../../common_function/cookie_helper";
import { useState } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import LazyLoad from "react-lazy-load";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, req, res, query }) => {
      const language = store?.getState()?.common?.store?.language?.code;

      try {
        const common_headers = await setSessionAxios(req);
        const guidesData = await axiosApi.post(
          "blog/read",
          { slug: query?.slug },
          {
            headers: {
              ...common_headers,
            },
          }
        );
        setSessionRes(guidesData?.headers, res);

        return {
          props: {
            guidesData: guidesData?.data?.result || {},
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "guides",
              "searchpage",
              "category",
              "product",
            ])),
          },
        };
      } catch (e) {
        return {
          redirect: {
            destination: "/guides",
            permanent: false,
          },
          props: {
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "guides",
              "searchpage",
              "category",
              "product",
            ])),
          },
        };
      }
    }
);

const Blog = ({ categoryData = [], guidesData = {} }) => {
  const storeData = useSelector((state) => state?.common?.store);
  const { t: translate } = useTranslation("guides");
  const [loader, setLoader] = useState(false);
  const [headerClassName, setHeaderClassName] = useState("");

  const handleScroll = (headerClassName) => {
    if (window !== undefined) {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.body.offsetHeight - 400
      ) {
        setHeaderClassName("");
      } else if (
        headerClassName !== "btn-visible" &&
        window.pageYOffset >= 800
      ) {
        setHeaderClassName("btn-visible");
      } else if (
        headerClassName === "btn-visible" &&
        window.pageYOffset < 800
      ) {
        setHeaderClassName("");
      }
    }
  };

  useEffect(() => {
    if (window !== undefined) {
      window.onscroll = () => handleScroll(headerClassName);
    }
  }, [headerClassName]);

  return (
    <>
      <Head>
        <title>
          {guidesData?.title + " - " + storeData?.store_name || "Guides"}
        </title>
      </Head>
      {Boolean(loader) && (
        <div>
          <span className="loader-div">
            <i className="fa fa-cog fa-spin"></i>
          </span>
        </div>
      )}
      <Header categoryData={categoryData} />
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap blog-page">
            {Boolean(Object.keys(guidesData)?.length) ? (
              <>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">{translate("home")}</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href="/guides">{translate("guides")}</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <a>{guidesData?.title}</a>
                    </li>
                  </ol>
                </nav>
                <div className="row d-flex justify-content-between blog-section-1 pb-5">
                  <div className="col-lg-6 col-12 pb-3 pb-lg-0">
                    <div>
                      <h1>{guidesData?.title}</h1>
                      <p
                        dangerouslySetInnerHTML={createMarkup(
                          guidesData?.short_description
                        )}
                      ></p>
                      <div className="row my-2 mx-0 justify-content-center justify-content-lg-start">
                        <a
                          href="#table-of-contents"
                          className="w-100 btn btn-secondary px-4 py-2 col-12 col-md-4 blog-read-more-btn"
                          type="button"
                        >
                          {translate("read_more")}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 d-lg-block d-none">
                    <div className="rounded overflow-hidden card">
                      <LazyLoad height="100%" offset={120}>
                        <img
                          src={
                            storeData?.image_path +
                            "fit-in/1000x1000/" +
                            guidesData?.image
                          }
                          alt="image"
                          className="img-fluid"
                        />
                      </LazyLoad>
                    </div>
                  </div>
                </div>
                <BlogSearch categoryData={categoryData?.result} />
                <div className="d-lg-none d-block pb-5 mb-sm-5">
                  <div className="rounded overflow-hidden card">
                    <LazyLoad height="100%" offset={120}>
                      <img
                        src={
                          storeData?.image_path +
                          "fit-in/1000x1000/" +
                          guidesData?.image
                        }
                        alt="image"
                        className="img-fluid"
                      />
                    </LazyLoad>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-7 col-md-8 col-12">
                    <div className="blog-section-2 mb-sm-5">
                      <h2 className="h2-title pb-1 pb-md-3">{translate("key_takeaways")}</h2>
                      <div
                        className="d-flex"
                        dangerouslySetInnerHTML={createMarkup(
                          guidesData?.key_takeaways
                        )}
                      ></div>
                    </div>
                    <div className="pt-5 pb-sm-5" id="table-of-contents">
                      <div className="blog-section-2">
                        <h2 className="h2-title pb-1 pb-md-3">
                          {translate("table_of_contents")}
                        </h2>
                        <div className="d-inline">
                          <ul>
                            {guidesData?.article?.map((x, i) => {
                              return (
                                <li key={x?._id}>
                                  <a
                                    href={`#${x?.title}`}
                                    className="index_item"
                                  >
                                    <span>{x?.title}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {guidesData?.article?.map((x, i) => {
                      let ctaIndex = 0;
                      // if (Boolean((i + 1) % 2 == 0)) {
                      //   i == 1 ? (ctaIndex = 0) : (ctaIndex += 1);
                      // }
                      return (
                        <Fragment key={x?._id}>
                          <div
                            className="pt-5 blog-section pb-sm-5"
                            id={x?.title}
                          >
                            <h2 className="h2-title">{x?.title}</h2>
                            <div
                              className="d-inline description"
                              dangerouslySetInnerHTML={createMarkup(
                                x?.description
                              )}
                            ></div>
                            {Boolean(x?.image) && (
                              <div className="img-wrapper my-3 row">
                                <LazyLoad height="100%" offset={120}>
                                  <img
                                    className="img-fluid col-md-11"
                                    src={
                                      storeData?.image_path +
                                      "fit-in/1000x1000/" +
                                      x?.image
                                    }
                                    style={{ display: "block" }}
                                  />
                                </LazyLoad>
                              </div>
                            )}
                          </div>
                          {Boolean((i + 1) % 2 == 0) &&
                            Boolean(
                              Object.keys(
                                guidesData?.cta?.[Math?.floor((i + 1) / 2) - 1]
                              )?.length
                            ) && (
                              <div className="mt-5 pt-5 blog-section mb-sm-5 pb-5 shadow-lg rounded-4 cta-section px-3">
                                <div className="text-center">
                                  <p className="sub-title text-primary">
                                    {
                                      guidesData?.cta?.[
                                        Math.floor((i + 1) / 2) - 1
                                      ]?.before_title_text
                                    }
                                  </p>
                                  <h2 className="h2-title">
                                    {
                                      guidesData?.cta?.[
                                        Math.floor((i + 1) / 2) - 1
                                      ]?.title
                                    }
                                  </h2>
                                  <p>
                                    {
                                      guidesData?.cta?.[
                                        Math.floor((i + 1) / 2) - 1
                                      ]?.after_title_text
                                    }
                                  </p>
                                  <Link
                                    onClick={(e) =>
                                      !Boolean(e?.nativeEvent?.ctrlKey)
                                        ? setLoader(true)
                                        : ""
                                    }
                                    href={
                                      guidesData?.cta?.[
                                        Math.floor((i + 1) / 2) - 1
                                      ]?.button_link
                                    }
                                    className="btn btn-primary rounded-pill px-4"
                                    type="button"
                                  >
                                    {
                                      guidesData?.cta?.[
                                        Math.floor((i + 1) / 2) - 1
                                      ]?.button_text
                                    }
                                  </Link>
                                </div>
                              </div>
                            )}
                        </Fragment>
                      );
                    })}

                    <div className="blog-section pt-5 pb-5">
                      <h2 className="h2-title">{guidesData?.faqs?.title}</h2>
                      <div
                        className="accordion accordion-flush"
                        id="accordionExample"
                      >
                        {guidesData?.faqs?.data?.map((x, i) => {
                          return (
                            <div
                              className="accordion-item border-bottom"
                              key={x?._id}
                            >
                              <h2
                                className="accordion-header"
                                id={`heading${i}`}
                              >
                                <button
                                  className="seo-faq-question collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapse${i}`}
                                  aria-expanded="true"
                                  aria-controls={`collapse${i}`}
                                >
                                  {x?.title}
                                </button>
                              </h2>
                              <div
                                id={`collapse${i}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${i}`}
                                data-bs-parent="#accordionExample"
                              >
                                <div
                                  className="seo-faq-answer"
                                  dangerouslySetInnerHTML={createMarkup(
                                    x?.description
                                  )}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-4 col-12">
                    <Link
                      onClick={(e) =>
                        !Boolean(e?.nativeEvent?.ctrlKey) ? setLoader(true) : ""
                      }
                      href={guidesData?.cta?.[0]?.button_link || "/"}
                      className={`right-cta-btn btn btn-primary rounded-pill px-4 ${headerClassName}`}
                      type="button"
                    >
                      {guidesData?.cta?.[0]?.button_text ||
                        "Make Your Custom Car Covers"}
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-center pt-4">{translate("data_not_found")}</h1>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Blog;
