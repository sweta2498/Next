import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Banner from "../../../component/banner/Banner";
import Category from "../../../component/category/Category";
import Header from "../../../component/Header/index";
import ProductSearchType from "../../../component/ProductSearchType";
import ProductTypeDetails from "../../../component/ProductTypeDetails";
import Search from "../../../component/search/Search";
import { wrapper } from "redux/store";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../common_function/cookie_helper";
import axiosApi from "../../../axios_instance";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "../../../component/Footer/Footer";
import { setScrollStateAction } from "../../../redux/action/stateAction";
import { useDispatch, useSelector } from "react-redux";

// export const getServerSideProps1 = wrapper.getServerSideProps(
//     (store) => async (context) => {
//         const language = store?.getState()?.common?.store?.language?.code;
//         return {
//             props: {
//                 ...(await serverSideTranslations(language || "en", [
//                     "home",
//                     "footerpage",
//                     "searchpage",
//                     "category",
//                     "product",
//                 ])),
//             },
//         };
//     }
// );

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      let product = [];
      let singleProduct = [];

      const language = store?.getState()?.common?.store?.language?.code;

      const data = {
        sort_slug: query?.category,
        // category: "car-covers",
        // year: 2023,
        // make: "abarth",
        // model: "595-turismo",
        // body: "hatchback"
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
        console.log("===========", err?.response?.data);
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
  // console.log("hh", product?.result?.length);

  const router = useRouter();
  const category_slug = router?.query?.category;
  const selectCategoryData = categoryData?.result?.filter(
    (dt) => dt?.sort_slug === category_slug
  );
  const dispatch = useDispatch();

  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!router?.query?.type) {
      dispatch(setScrollStateAction({ scrollState: true }));
    }
  }, [router?.isReady]);

  return (
    <>
      <Header categoryData={categoryData} />
      <Banner data={categoryData?.result} />
      {/* <div id="scrollData"> */}
      <Search categoryData={categoryData?.result} useSlug={false} />
      {/* </div> */}

      {Boolean(product?.result?.length) ? (
        <ProductTypeDetails
          productDatas={product}
          cartID={categoryData}
          isFilterExist={selectCategoryData?.[0]?.is_filter}
          selectCategoryData={selectCategoryData}
          categoryPage={true}
        />
      ) : (
        <div style={{ textAlign: "center" }} className="m-5">
          <h2>No Products Found</h2>
        </div>
      )}

      {/* <ProductTypeDetails
        productDatas={product}
        cartID={categoryData}
        isFilterExist={selectCategoryData?.[0]?.is_filter}
        selectCategoryData={selectCategoryData}
      /> */}
      <Footer />
    </>
  );
};

export default Index;
