import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../../../../../component/Header/index";
import Banner from "../../../../../component/banner/Banner";
import Search from "../../../../../component/search/Search";
import PageContent from "../../../../../component/PageContent";
import Footer from "../../../../../component/Footer/Footer";
import Products from "../../../../../component/products/Products";
import axiosApi from "../../../../../axios_instance";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../../../common_function/cookie_helper";
import Head from "next/head";
import { useSelector } from "react-redux";

// export const getServerSideProps = wrapper.getServerSideProps(
//     (store) =>
//         async ({ context, query, req, res }) => {
//             // console.log("query=========", query);
//             const language = store?.getState()?.common?.store?.language?.code;
//             try {
//                 // const language = store?.getState()?.common?.store?.language?.code;
//                 const common_headers = await setSessionAxios(req);
//                 const data = {
//                     category: query?.category,
//                     year: query?.year,
//                     make: query?.make,
//                     model: query?.model,
//                 }

//                 // const product = await axiosApi.get(`product/list/${query?.category}/${query?.year}/${query?.make}/${query?.model}/${query?.body}`)
//                 const product = await axiosApi.post(`product/list`,
//                     data,
//                     {
//                         headers: {
//                             ...common_headers,
//                         },
//                     }
//                 );

//                 setSessionRes(product?.headers, res);
//                 return {
//                     props: {
//                         product: product?.data,
//                         ...(await serverSideTranslations(language || 'en', ['home', 'footerpage', 'searchpage', 'product', 'category', 'pagecontent'])),
//                     },
//                 }
//             }
//             catch (err) {
//                 console.log(err);
//                 return {
//                     redirect: { destination: "/500", permanent: false },
//                     ...(await serverSideTranslations(language || 'en', ['home', 'footerpage', 'searchpage', 'product', 'category', 'pagecontent'])),
//                 }
//             }
//         }
// )

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

        const data = {
          category: query?.category,
          year: query?.year,
          make: query?.make,
          model: query?.model,
        };

        if (selectCategoryData[0]?.is_body === false) {
          product = await axiosApi.post(`product/list`, data, {
            headers: {
              ...common_headers,
            },
          });
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
      }
    }
);

const Model = ({ categoryData = [], cartID, navData, product }) => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const category_slug = router?.query?.category;
  const selectCategoryData = Array?.isArray(categoryData?.result)
    ? categoryData?.result?.filter((dt) => dt?.slug === category_slug)
    : [];
    const storeData = useSelector((state) => state?.common?.store);

  useEffect(() => {
    if (selectCategoryData?.length == 0) {
      router?.push("/");
    }
  }, [selectCategoryData]);

  useEffect(() => {
    if (product?.result) {
      setLoader(false);
    } else {
      setLoader(false);
    }
  }, []);

  const data = {
    category: router?.query?.category,
    year: router?.query?.year,
    make: router?.query?.make,
    model: router?.query?.model,
  };

  useEffect(() => {
    if (selectCategoryData[0]?.is_body === false) {
      setLoader(false);
      // productData()
    }
  }, []);

  return (
    <>
      <Head>
          <title>
              {(selectCategoryData[0]?.details?.name || "CarCoversFactory") + " - " + storeData?.store_name}
          </title>
          <meta name="description" content={selectCategoryData?.[0]?.details?.meta_description || "Car Cover Factory"}/>
      </Head>
      <Header categoryData={categoryData} />
      {Boolean(selectCategoryData?.length) &&
        selectCategoryData?.[0]?.is_filter === true && (
          <>
            <Banner data={selectCategoryData} />
            <Search categoryData={selectCategoryData} productDatas={product} />
          </>
        )}

      {Boolean(product?.result)
        ? Boolean(product?.result?.length) && (
            <Products
              productDatas={product}
              cartID={categoryData}
              isBodyExist={selectCategoryData[0]?.is_body === false}
              isFilterExist={selectCategoryData?.[0]?.is_filter}
              isTilesExist={true}
              meta_description={selectCategoryData?.[0]?.details?.meta_description}
            />
          )
        : ""}
      {selectCategoryData[0]?.is_body !== false && <PageContent />}

      <Footer />
    </>
  );
};

export default Model;
