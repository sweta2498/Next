import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Search from "../../component/search/Search";
import Header from "../../component/Header/index";
import Banner from "../../component/banner/Banner";
import PageContent from "../../component/PageContent";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "../../component/Footer/Footer";
import ProductFilter from "../../component/products/ProductFilter";
import Head from "next/head";
import { useSelector } from "react-redux";
import {
  setSessionAxios,
  setSessionRes,
} from "../../common_function/cookie_helper";
import axiosApi from "../../axios_instance";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      let product = [];
      const language = store?.getState()?.common?.store?.language?.code;
      const categoryData = store?.getState()?.common?.navData?.result;

      const common_headers = await setSessionAxios(req);
      const category_slug = query?.category;

      try {
        const selectCategoryData = Array?.isArray(categoryData)
          ? categoryData?.filter((dt) => dt?.slug === category_slug)
          : [];
        if (selectCategoryData?.[0]?.is_filter === false) {
          product = await axiosApi.post(
            `product/list/`,
            { category: category_slug },
            {
              headers: {
                ...common_headers,
              },
            }
          );
          setSessionRes(product?.headers, res);
        }
        setSessionRes(product?.headers, res);

        return {
          props: {
            product: product?.data || [],
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "pagecontent",
              "product",
            ])),
          },
        };
      } catch (e) {
        // console.log(e);
        return {
          redirect: {
            destination: "/" + e?.response?.data?.redirect_url,
            permanent: false,
          },
          props: {
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "pagecontent",
              "product",
            ])),
          },
        };
      }
    }
);

// export const getServerSideProps = wrapper.getServerSideProps(
//     (store) =>
//         async (context) => {
//             try {
//                 const language = store?.getState()?.common?.store;
//                 const common_headers = await setSessionAxios(req);
//                 const allCategory = await axios?.get(`${url}/category/all`, {
//                     headers: {
//                         ...common_headers,
//                     },
//                 });
//                 setSessionRes(allCategory?.headers, res);
//                 return {
//                     props: {
//                         allCategory: allCategory?.data,
//                         ...(await serverSideTranslations(language || 'English', ['home', 'searchpage', 'footerpage']))
//                     },
//                 };
//             } catch (err) {
//                 // console.log(err);
//                 return {
//                     redirect: { destination: "/500", permanent: false },
//                 };
//             }
//         }
// )

const Category = ({ categoryData = [], product = [] }) => {
  //  console.log("==========",categoryData);

  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const category_slug = router?.query?.category;
  const selectCategoryData = Array?.isArray(categoryData?.result)
    ? categoryData?.result?.filter((dt) => dt?.slug === category_slug)
    : [];
  const storeData = useSelector((state) => state?.common?.store);

  // console.log("selectCategoryData==",selectCategoryData);

  useEffect(() => {
    if (selectCategoryData?.length == 0) {
      router?.push("/");
    }
  }, [selectCategoryData]);

  useEffect(() => {
    if (selectCategoryData?.length) setLoader(false);
  }, [category_slug]);

  useEffect(() => {
    if (selectCategoryData[0]?.slug == category_slug) {
      setLoader(false);
    }
  }, [categoryData?.result]);

  return (
    <>
      <Head>
        <meta
          name="language"
          content={storeData?.language?.name || "English"}
        />
        <title>
          {(selectCategoryData[0]?.details?.name || "CarCoversFactory") + " - " + storeData?.store_name}
        </title>
        <meta
          name="title"
          content={
            selectCategoryData[0]?.details?.name || "CarCoversFactory"
          }
        />
        <meta
          name="description"
          content={
            selectCategoryData[0]?.details?.meta_description ||
            "CarCoversFactory"
          }
        />
        <link rel="canonical" href={router?.asPath} />
      </Head>

      {Boolean(loader) && (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      )}

      <Header categoryData={categoryData} />

      {Boolean(selectCategoryData?.length) &&
      selectCategoryData?.[0]?.is_filter === true ? (
        <>
          <Banner data={selectCategoryData} />
          <Search categoryData={selectCategoryData} />
          <PageContent />
        </>
      ) : (
        <ProductFilter
          cartID={categoryData}
          productTitle={product?.tital}
          productData={product?.result}
          allData={product}
        />
      )}
      <Footer />
    </>
  );
};

export default Category;
