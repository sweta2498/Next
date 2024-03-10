import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import Header from "../../../../../../../component/Header/index";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axiosApi from "../../../../../../../axios_instance";
import ProductDetails from "../../../../../../../component/productdetail/ProductDetails";
import Footer from "../../../../../../../component/Footer/Footer";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../../../../../common_function/cookie_helper";
import { useRouter } from "next/router";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      const language = store?.getState()?.common?.store?.language?.code;

      try {
        const common_headers = await setSessionAxios(req);

        const data = {
          category: query?.category,
          year: query?.year,
          make: query?.make,
          model: query?.model,
          body: query?.body,
          product: query?.slug,
        };

        const singleProduct = await axiosApi.post(`product/read`, data, {
          headers: {
            ...common_headers,
          },
        });

        setSessionRes(singleProduct?.headers, res);

        return {
          props: {
            singleProduct: singleProduct?.data,
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "product",
              "category",
              "viewdetails",
            ])),
          },
        };
      } catch (err) {
        // console.log("======-=-=-=-==========", err?.response?.data);
        return {
          redirect: {
            destination: err?.response?.data?.redirect_url,
            // ? err?.response?.data?.redirect_url
            // : "/" +
            //   query?.category +
            //   "/" +
            //   query?.year +
            //   "/" +
            //   query?.make +
            //   "/" +
            //   query?.model +
            //   "/" +
            //   query?.body,
            permanent: false,
          },
          props: {
            // singleProduct: singleProduct?.data,
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "product",
              "category",
              "viewdetails",
            ])),
          },
        };
      }
    }
);

const Index = ({ categoryData = [], singleProduct = [] }) => {
  // console.log("=------------------------------------------", singleProduct);
  const router = useRouter();
  const category_slug = router?.query?.category;
  const selectCategoryData = Array?.isArray(categoryData?.result)
    ? categoryData?.result?.filter((dt) => dt?.slug === category_slug)
    : [];

  useEffect(() => {
    if (selectCategoryData?.length == 0) {
      router?.push("/");
    }
  }, [selectCategoryData]);

  // useEffect(()=>{
  //     const data = {
  //         category: router?.query?.category,
  //         year: router?.query?.year,
  //         make: router?.query?.make,
  //         model: router?.query?.model,
  //         body: router?.query?.body,
  //         product: router?.query?.slug
  //     }
  //     try {
  //         axiosApi.post(`product/read`, data)
  //             .then((res) => {
  //                 console.log("======",res?.data);

  //             })
  //             .catch((err) => {
  //                 console.log("=-==--=----------------------------------",err);
  //                 // setLoader(false);
  //             });
  //     } catch (e) {
  //         console.log("-------------------------",e);
  //         // setLoader(false);
  //     }

  // },[])

  return (
    <div>
      <Header categoryData={categoryData} />
      <ProductDetails
        singleProduct={singleProduct}
        cartID={categoryData}
        isFilterExist={selectCategoryData?.[0]?.is_filter}
      />
      <Footer />
    </div>
  );
};

export default Index;
