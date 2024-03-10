import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "../../../../component/Footer/Footer";
import Header from "../../../../component/Header/index";
import Banner from "../../../../component/banner/Banner";
import Search from "../../../../component/search/Search";
import PageContent from "../../../../component/PageContent";
import axiosApi from "../../../../axios_instance";
import ProductDetails from "../../../../component/productdetail/ProductDetails";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../../common_function/cookie_helper";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import { useSelector } from "react-redux";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, res, req }) => {
      const language = store?.getState()?.common?.store?.language?.code;
      let singleProduct = [];
      const data = {
        category: query?.category,
        tiles_name: query?.year,
        product: query?.make,
      };
      try {
        const common_headers = await setSessionAxios(req);
        const ProductBody = await axiosApi.post(
          `product_body`,
          { slug: query?.make },
          {
            headers: {
              ...common_headers,
            },
          }
        );

        if (ProductBody?.data?.message === "is_product") {
          singleProduct = await axiosApi.post(`product/read`, data, {
            headers: {
              ...common_headers,
            },
          });
          setSessionRes(singleProduct?.headers, res);
        }
        //  else if (ProductBody?.data?.message === "is_body") {
        //     return {
        //         redirect: {
        //             destination: "/" + query?.category + "/" + query?.year,
        //             permanent: false,
        //         },
        //     };
        // }

        setSessionRes(ProductBody?.headers, res);
        return {
          props: {
            singleProduct: singleProduct?.data || [],
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "pagecontent",
              "viewdetails",
            ])),
          },
        };
      } catch (e) {
        return {
          redirect: {
            destination: e?.response?.data?.redirect_url,
            permanent: false,
          },
          props: {
            singleProduct: singleProduct?.data || [],
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "pagecontent",
              "viewdetails",
            ])),
          },
        };
      }
    }
);

const Make = ({ categoryData = [], singleProduct }) => {
  const storeData = useSelector((state) => state?.common?.store);
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const category_slug = router?.query?.category;
  const selectCategoryData = Array?.isArray(categoryData?.result)
    ? categoryData?.result?.filter((dt) => dt?.slug === category_slug)
    : [];

  useEffect(() => {
    if (selectCategoryData?.length == 0) {
      router?.push("/");
    }
  }, [selectCategoryData]);

  const data = {
    category: router?.query?.category,
    tiles_name: router?.query?.year,
    product: router?.query?.make,
  };

  useEffect(() => {
    if (singleProduct?.result) {
      setLoader(false);
    } else {
      setLoader(false);
    }
  }, []);

  // useEffect(() => {
  //     // productBodyCheck()
  // }, [])

  // const productBodyCheck = () => {
  //     try {
  //         axiosApi
  //             .post(`product_body`, { slug: router?.query?.make })
  //             .then((res) => {
  //                 if (res?.data?.message === 'is_product') {
  //                     singleProductData()
  //                 }
  //                 else {
  //                     setLoader(false)
  //                 }
  //             })
  //             .catch((err) => {
  //                 setLoader(false)
  //             });
  //     }
  //     catch (e) {
  //         setLoader(false)
  //     }
  // }

  // const singleProductData = () => {
  //     try {
  //         axiosApi
  //             .post(`product/read`, data)
  //             .then((res) => {
  //                 // console.log(res?.data);
  //                 setSingleProduct(res?.data)
  //                 setLoader(false)
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //                 setLoader(false)
  //             });
  //     }
  //     catch (e) {
  //         console.log(e);
  //         setLoader(false)
  //     }
  // }

  return (
    <>
      <Head>
        <title>
          {(selectCategoryData[0]?.details?.name || "CarCoversFactory") +
            " - " +
            storeData?.store_name}
        </title>
        <meta
          name="description"
          content={
            selectCategoryData?.[0]?.details?.meta_description ||
            "Car Cover Factory"
          }
        />
      </Head>
      <Header categoryData={categoryData} />
      {Boolean(selectCategoryData?.length) &&
        selectCategoryData?.[0]?.is_filter === true && (
          <>
            {!Boolean(singleProduct?.result?.length) && (
              <>
                <Banner data={selectCategoryData} />
                <Search categoryData={selectCategoryData} />
              </>
            )}
          </>
        )}

      {Boolean(singleProduct?.result) &&
        Boolean(singleProduct?.result?.length) && (
          <ProductDetails
            singleProduct={singleProduct}
            cartID={categoryData}
            isTilesExist={true}
            isFilterExist={selectCategoryData?.[0]?.is_filter}
          />
        )}
      {!Boolean(singleProduct?.result) && <PageContent />}
      <Footer />
    </>
  );
};

export default Make;
