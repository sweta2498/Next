import React, { useEffect, useRef, useState } from "react";
import Footer from "../../../../../../component/Footer/Footer";
import Header from "../../../../../../component/Header/index";
import Banner from "../../../../../../component/banner/Banner";
import Search from "../../../../../../component/search/Search";
import { useRouter } from "next/router";
import Products from "../../../../../../component/products/Products";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import axiosApi from "../../../../../../axios_instance";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../../../../common_function/cookie_helper";
import ProductDetails from "../../../../../../component/productdetail/ProductDetails";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      let product = [];
      let singleProduct = [];

      const language = store?.getState()?.common?.store?.language?.code;
      const data = {
        category: query?.category,
        year: query?.year,
        make: query?.make,
        model: query?.model,
        body: query?.body,
        // product: query?.slug
      };
      const data1 = {
        category: query?.category,
        year: query?.year,
        make: query?.make,
        model: query?.model,
        product: query?.body,
      };
      try {
        const common_headers = await setSessionAxios(req);
        const ProductBody = await axiosApi.post(
          `product_body`,
          { slug: query?.body },
          {
            headers: {
              ...common_headers,
            },
          }
        );
        if (ProductBody?.data?.message === "is_body") {
          product = await axiosApi.post(`product/list`, data, {
            headers: {
              ...common_headers,
            },
          });
          setSessionRes(product?.headers, res);
        } else if (ProductBody?.data?.message === "is_product") {
          singleProduct = await axiosApi.post(`product/read`, data1, {
            headers: {
              ...common_headers,
            },
          });
          setSessionRes(singleProduct?.headers, res);
        }

        return {
          props: {
            product: product?.data || [],
            singleProduct: singleProduct?.data || [],
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
        return {
          redirect: {
            destination: "/" + err?.response?.data?.redirect_url,
            permanent: false,
          },
          props: {
            // product: product?.data || [],
            // singleProduct: singleProduct?.data || [],
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

const Index = ({ categoryData = [], product, singleProduct }) => {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const category_slug = router?.query?.category;
  const selectCategoryData = Array?.isArray(categoryData?.result)
    ? categoryData?.result?.filter((dt) => dt?.slug === category_slug)
    : [];
  const [productViewPage, setProductViewPage] = useState(true);

  useEffect(() => {
    if (selectCategoryData?.length == 0) {
      router?.push("/");
    }
  }, [selectCategoryData]);

  useEffect(() => {
    if (product == undefined) {
      setLoader(false);
    } else if (singleProduct == undefined) {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    if (product?.result) {
      setLoader(false);
    } else if (singleProduct?.result) {
      setLoader(false);
    }
  }, []);

  const data = {
    category: router?.query?.category,
    year: router?.query?.year,
    make: router?.query?.make,
    model: router?.query?.model,
    body: router?.query?.body,
  };

  const dataSingle = {
    category: router?.query?.category,
    year: router?.query?.year,
    make: router?.query?.make,
    model: router?.query?.model,
    // tiles_name: router?.query?.year,
    product: router?.query?.body,
  };

  useEffect(() => {
    // productBodyCheck();
  }, []);

  const productBodyCheck = () => {
    try {
      axiosApi
        .post(`product_body`, { slug: router?.query?.body })
        .then((res) => {
          if (res?.data?.message === "is_body") {
            productData();
          } else if (res?.data?.message === "is_product") {
            singleProductData();
            setProductViewPage(false);
          }
        })
        .catch((err) => {
          setLoader(false);
        });
    } catch (e) {
      setLoader(false);
    }
  };

  const productData = () => {
    try {
      axiosApi
        .post(`product/list`, data)
        .then((res) => {
          setProduct(res?.data);
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
        });
    } catch (e) {
      setLoader(false);
    }
  };

  const singleProductData = () => {
    axiosApi
      .post(`product/read`, dataSingle)
      .then((res) => {
        setSingleProduct(res?.data);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  return (
    <>
      <Header categoryData={categoryData} />

      {!Boolean(singleProduct?.result) && (
        <>
          <Banner data={categoryData?.result} />
          <Search categoryData={categoryData?.result} productDatas={product} />
        </>
      )}
      {
        Boolean(singleProduct?.result) && (
          <>
            {Boolean(singleProduct?.result?.length) && (
              <ProductDetails
                singleProduct={singleProduct}
                cartID={categoryData}
                isBodyExist={true}
                isFilterExist={selectCategoryData?.[0]?.is_filter}
              />
            )}
          </>
        )
        // )
      }
      {
        Boolean(product?.result) && (
          <>
            {Boolean(product?.result?.length) && (
              <Products
                productDatas={product}
                cartID={categoryData}
                isFilterExist={selectCategoryData?.[0]?.is_filter}
                meta_description={
                  selectCategoryData?.[0]?.details?.meta_description
                }
              />
            )}
          </>
        )
        // )
      }

      {(product == undefined || singleProduct == undefined) && (
        <h2 className="text-center" style={{ padding: "300px" }}>
          No data Found.
        </h2>
      )}
      <Footer />
    </>
  );
};
export default Index;
