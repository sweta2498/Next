import React from "react";
import Header from "../../component/Header/index";
import Footer from "../../component/Footer/Footer";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import axiosApi from "../../axios_instance";
import { useTranslation } from "next-i18next";
import { setToast } from "../../redux/action/toastAction";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import Head from "next/head";
import {
  setSessionAxios,
  setSessionRes,
} from "../../common_function/cookie_helper";
import LazyLoad from "react-lazy-load";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, req, res, query }) => {
      const language = store?.getState()?.common?.store?.language?.code;

      try {
        const common_headers = await setSessionAxios(req);
        const listData = await axiosApi.get(`blog/list?page=${1}&items=${10}`, {
          headers: {
            ...common_headers,
          },
        });
        setSessionRes(listData?.headers, res);

        return {
          props: {
            listData: listData?.data || {},
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "guides",
              "searchpage",
              "category",
            ])),
          },
        };
      } catch (e) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
          props: {
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "guides",
              "searchpage",
              "category",
            ])),
          },
        };
      }
    }
);

const Index = ({ categoryData = [], listData = {} }) => {
  const storeData = useSelector((state) => state?.common?.store);
  const router = useRouter();
  const { t: translate } = useTranslation("guides");
  const dispatch = useDispatch();
  const [guidesList, setGuidesList] = useState(listData?.result || []);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState(listData?.pagination?.pages || 1);
  const [items, setItems] = useState(10);

  const getGuidesListData = (page) => {
    setLoading(true);
    axiosApi
      .get(`blog/list?page=${page}&items=${items}`)
      .then((res) => {
        setLoading(false);
        setGuidesList(res?.data?.result || []);
        setTotals(res?.data?.pagination?.pages);
      })
      .catch((err) => {
        setLoading(false);
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

  const handlePageClick = (event) => {
    getGuidesListData(event?.selected + 1);
    document?.getElementById("blogList")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        <title>{`${translate("guides")} - ` + storeData?.store_name || "Guides"}</title>
      </Head>
      {Boolean(loading) && (
        <div>
          <span className="loader-div">
            <i className="fa fa-cog fa-spin"></i>
          </span>
        </div>
      )}
      <Header categoryData={categoryData} />
      <section className="page-content single-wrapper blog-list">
        <div className="container">
          <div className="inner-wrap blog-page">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">{translate("home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <a>{translate("guides")}</a>
                </li>
              </ol>
            </nav>
            <h1 className="py-3 text-center" style={{ color: "#000" }}>
              {translate("guides")}
            </h1>
            <div
              className="row px-5 d-flex justify-content-center"
              id="blogList"
            >
              {guidesList?.map((x, i) => {
                return (
                  <div className="col-md-4 mb-4" key={x?._id + i}>
                    <div className="card p-md-3 p-2 border-0 h-100 rounded-0">
                      <Link
                        href={router?.asPath + "/" + x?.slug}
                        onClick={(e) =>
                          !Boolean(e?.nativeEvent?.ctrlKey)
                            ? setLoading(true)
                            : ""
                        }
                      >
                        <LazyLoad height="100%" offset={120}>
                          <img
                            src={
                              storeData?.image_path + "fit-in/324x324/" + x?.image
                            }
                            alt={x?.title}
                            title={x?.title}
                            className="card-img-top rounded-0"
                          />
                        </LazyLoad>
                      </Link>
                      <div className="card-body px-0 pb-1">
                        <h2 className="mb-0">
                          <Link
                            href={router?.asPath + "/" + x?.slug}
                            onClick={(e) =>
                              !Boolean(e?.nativeEvent?.ctrlKey)
                                ? setLoading(true)
                                : ""
                            }
                          >
                            {x?.title}
                          </Link>
                        </h2>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="category_pagination text-center">
              {totals != 1 && (
                <ReactPaginate
                  breakLabel="----"
                  nextLabel={<i className="fa fa-angle-right"></i>}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={Number(totals)}
                  marginPagesDisplayed={2}
                  previousLabel={<i className="fa fa-angle-left"></i>}
                  className="productReviewPagination pt-3"
                  renderOnZeroPageCount={null}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Index;
