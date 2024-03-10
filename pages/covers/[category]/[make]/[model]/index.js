import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../../../../../component/Header/index";
import Category from "../../../../../component/category/Category";
import Banner from "../../../../../component/banner/Banner";
import Search from "../../../../../component/search/Search";
import ProductSearchType from "../../../../../component/ProductSearchType";
import ProductTypeDetails from "../../../../../component/ProductTypeDetails";
import Link from "next/link";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../../../common_function/cookie_helper";
import axiosApi from "../../../../../axios_instance";
import Footer from "../../../../../component/Footer/Footer";
import { useDispatch } from "react-redux";
import { setScrollStateAction } from "../../../../../redux/action/stateAction";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      let product = [];
      let singleProduct = [];

      const language = store?.getState()?.common?.store?.language?.code;

      const data = {
        sort_slug: query?.category,
        make_sort: query?.make,
        model_sort: query?.model,
      };
      try {
        const common_headers = await setSessionAxios(req);

        product = await axiosApi.post(`product/list`, data, {
          headers: {
            ...common_headers,
          },
        });
        setSessionRes(product?.headers, res);

        return {
          props: {
            product: product?.data || [],

            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "product",
            ])),
          },
        };
      } catch (err) {
        console.log(err?.response);
        return {
          // redirect: {
          //     // destination: "/" + err?.response?.data?.redirect_url,
          //     permanent: false,
          // },
          props: {
            // product: product?.data || [],
            // singleProduct: singleProduct?.data || [],
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "product",
            ])),
          },
        };
      }
    }
);

const Index = ({ categoryData = [], product }) => {
  // console.log("==333",product);
  const router = useRouter();
  const dispatch = useDispatch();
  const category_slug = router?.query?.category;
  const selectCategoryData = categoryData?.result?.filter(
    (dt) => dt?.sort_slug === category_slug
  );

  useEffect(() => {
    if (!router?.query?.type) {
      dispatch(setScrollStateAction({ scrollState: true }));
    }
  }, []);

  return (
    <>
      <Header categoryData={categoryData} />
      <Banner data={categoryData?.result} />
      <Search categoryData={categoryData?.result} useSlug={false} />

      {Boolean(product?.result?.length) ? (
        <ProductTypeDetails
          productDatas={product}
          cartID={categoryData}
          isFilterExist={selectCategoryData?.[0]?.is_filter}
          selectCategoryData={selectCategoryData}
        />
      ) : (
        <div style={{ textAlign: "center" }} className="m-5">
          <h2>No Products Found</h2>
        </div>
      )}

      <Footer />

      {/* <section className="page-content single-wrapper generic-cover">

        <div className="container position-relative">
          <img src="https://d68my205fyswa.cloudfront.net/ccf-static-11ea-9d4c-bb03ebcb21a2_1.png"
            style={{ position: 'absolute', maxWidth: '264px', left: '32px', top: '-14px', width: '100%' }}
            className="generic-search-image" />
          <div className="inner-wrap no-padding">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a>{selectCategoryData[0]?.details?.name || "Car Covers"}</a>
                </li>
              </ol>
            </nav>
            {Boolean(router?.query?.type) &&
              <ProductSearchType />
            }
          </div>
        </div>

        <div className="container">
          <div className="inner-wrap no-padding">
            <div id="notification"></div>
            <div className="pricing-page-wrap" id="pricing-inr">
              <h1 style={{ textAlign: "center" }}>
                Acura Car Cover
              </h1>
            
              {
                Boolean(product?.result) && (
                  <>
                    {Boolean(product?.result?.length) ? (
                      <ProductTypeDetails
                        productDatas={product}
                        cartID={categoryData}
                        isFilterExist={selectCategoryData?.[0]?.is_filter}
                      />
                    ) : (
                      <h2 className="text-center" style={{ padding: "300px" }}>
                        No data Found.
                      </h2>
                    )}
                  </>
                )
                
              }
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Index;
