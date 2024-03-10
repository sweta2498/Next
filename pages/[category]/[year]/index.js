import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../../../component/Header/index";
import Banner from "../../../component/banner/Banner";
import Search from "../../../component/search/Search";
import Footer from "../../../component/Footer/Footer";
import PageContent from "../../../component/PageContent";
import axiosApi from "../../../axios_instance";
import Products from "../../../component/products/Products";
import ProductDetails from "../../../component/productdetail/ProductDetails";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../common_function/cookie_helper";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      const language = store?.getState()?.common?.store?.language?.code;
      let singleProduct = [];
      let product = [];

      const data = {
        category: query?.category,
        tiles_name: query?.year,
      };

      const data1 = {
        category: query?.category,
        product: query?.year,
      };
      try {
        const common_headers = await setSessionAxios(req);
        const ProductBody = await axiosApi.post(
          `product_body`,
          { slug: query?.year },
          {
            headers: {
              ...common_headers,
            },
          }
        );

        if (ProductBody?.data?.message === "is_product") {
          singleProduct = await axiosApi.post(`product/read`, data1, {
            headers: {
              ...common_headers,
            },
          });
          setSessionRes(singleProduct?.headers, res);
        } else {
          if (isNaN(query?.year)) {
            product = await axiosApi.post(`product/list`, data, {
              headers: {
                ...common_headers,
              },
            });
          }
          setSessionRes(product?.headers, res);
        }
        setSessionRes(product?.headers, res);

        return {
          props: {
            product: product?.data || [],
            singleProduct: singleProduct?.data || [],
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "pagecontent",
              "product",
              "viewdetails",
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
            singleProduct: singleProduct?.data || [],
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "searchpage",
              "category",
              "pagecontent",
              "product",
              "viewdetails",
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

const Year = ({ categoryData = [], product, singleProduct }) => {
  const router = useRouter();
  const storeData = useSelector((state) => state?.common?.store);
  const [loader, setLoader] = useState(true);
  const category_slug = router?.query?.category;
  const selectCategoryData = Array?.isArray(categoryData?.result)
    ? categoryData?.result?.filter((dt) => dt?.slug === category_slug)
    : [];
  const { t: translate } = useTranslation("product");

  useEffect(() => {
    if (selectCategoryData?.length == 0) {
      router?.push("/");
    }
  }, [selectCategoryData]);

  const data = {
    category: router?.query?.category,
    tiles_name: router?.query?.year,
  };

  const dataSingle = {
    category: router?.query?.category,
    product: router?.query?.year,
  };

  useEffect(() => {
    if (product?.result) {
      setLoader(false);
    } else if (singleProduct?.result) {
      setLoader(false);
    } else setLoader(false);
  }, []);

  // useEffect(() => {
    // productBodyCheck()
  // }, []);

  // const productBodyCheck = () => {
  //     try {
  //         axiosApi
  //             .post(`product_body`, { slug: router?.query?.year })
  //             .then((res) => {
  //                 if (res?.data?.message === 'is_product') {
  //                     singleProductData()
  //                 }
  //                 else if (isNaN(router?.query?.year)) {
  //                     productData();
  //                 }
  //                 else {
  //                     setLoader(false)
  //                 }
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //                 setLoader(false)
  //             });
  //     }
  //     catch (e) {
  //         setLoader(false)
  //     }
  // }

  // const productData = () => {
  //     try {
  //         axiosApi
  //             .post(`product/list`, data)
  //             .then((res) => {
  //                 setProduct(res?.data)
  //                 setLoader(false)
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
  //             .post(`product/read`, dataSingle)
  //             .then((res) => {
  //                 setSingleProduct(res?.data)
  //                 setLoader(false)
  //             })
  //             .catch((err) => {
  //                 console.log(err);
  //                 setLoader(false)
  //             });
  //     } catch (e) {
  //         console.log(e);
  //         setLoader(false)
  //     }
  // }

  return (
    <>
    <Head>
      <title>
        {selectCategoryData?.[0]?.details?.name + " " + translate("for") + " " + router?.query?.year + " " + selectCategoryData?.[0]?.details?.short_name + " - " + storeData?.store_name}
      </title>
        <meta name="description" content={selectCategoryData?.[0]?.details?.meta_description || "Car Cover Factory"}/>
    </Head>
      {Boolean(loader) ? (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      ) : (
        ""
      )}
      <Header categoryData={categoryData} />
      {Boolean(selectCategoryData?.length) &&
        selectCategoryData?.[0]?.is_filter === true && (
          <>
            {!Boolean(isNaN(router?.query?.year)) && (
              <>
                <Banner data={selectCategoryData} />
                <Search categoryData={selectCategoryData} />
              </>
            )}
          </>
        )}

      {Boolean(product?.result) && (
        <>
          {Boolean(product?.result?.length) && (
            <Products
              productDatas={product}
              cartID={categoryData}
              istilesExist={true}
              isFilterExist={selectCategoryData?.[0]?.is_filter}
              categoryData={selectCategoryData}
              meta_description={selectCategoryData?.[0]?.details?.meta_description}
            />
          )}
        </>
      )}

      {Boolean(singleProduct?.result?.length) && (
        <ProductDetails
          singleProduct={singleProduct}
          cartID={categoryData}
          istilesExist={true}
          isFilterExist={selectCategoryData?.[0]?.is_filter}
          isDirectCategoryExist={true}
        />
      )}

      {!Boolean(product?.result) && !Boolean(singleProduct?.result) && (
        <PageContent />
      )}
      <Footer />
    </>
  );
};

export default Year;
