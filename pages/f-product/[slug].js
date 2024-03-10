import React from "react";
import Header from "../../component/Header/index";
import Footer from "../../component/Footer/Footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import ProductDetails from "../../component/productdetail/ProductDetails";
import {
  setSessionAxios,
  setSessionRes,
} from "../../common_function/cookie_helper";
import axiosApi from "../../axios_instance";

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (context) => {
//     const language = store?.getState()?.common?.store?.language?.code;
//     return {
//       props: {
//         ...(await serverSideTranslations(language || "en", [
//           "home",
//           "viewdetails",
//           "footerpage",
//           "category",
//         ])),
//       },
//     };
//   }
// );

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      const language = store?.getState()?.common?.store?.language?.code;

      try {
        const common_headers = await setSessionAxios(req);

        const data = {
          product_slug: query?.slug,
        };
        const singleProduct = await axiosApi.post(`product/read_fake`, data, {
          headers: {
            ...common_headers,
          },
        });
        if (singleProduct?.data?.result?.length == 0) {
          return {
            redirect: {
              destination: "/",
              permanent: false,
            },
          };
        }

        setSessionRes(singleProduct?.headers, res);

        return {
          props: {
            singleProduct: singleProduct?.data,
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "category",
              "viewdetails",
            ])),
          },
        };
      } catch (err) {
        return {
          // redirect: {
          //   destination: err?.response?.data?.redirect_url,
          //   permanent: false,
          // },
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

const FakeProductSlug = ({ categoryData, singleProduct }) => {
  // let singleProduct = [];
  // console.log(singleProduct);
  return (
    <>
      <Header categoryData={categoryData} />
      <ProductDetails
        singleProduct={singleProduct}
        fakeproduct={true}
        cartID={categoryData}
      />
      <Footer />
    </>
  );
};

export default FakeProductSlug;
