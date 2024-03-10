import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { wrapper } from "redux/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useSelector } from "react-redux";
import {
  setSessionAxios,
  setSessionRes,
} from "../../../../../../../common_function/cookie_helper";
import axiosApi from "../../../../../../../axios_instance";
import Header from "../../../../../../../component/Header/index";
import Banner from "../../../../../../../component/banner/Banner";
import Search from "../../../../../../../component/search/Search";
import PageContent from "../../../../../../../component/PageContent";
import Footer from "../../../../../../../component/Footer/Footer";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ context, query, req, res }) => {
      let product = [];
      const language = store?.getState()?.common?.store?.language?.code;
      const data = {
        category: query?.category,
        year: query?.year,
        make: query?.make,
        model: query?.model,
        body: query?.body,
        product: query?.slug,
      };
      const ProductBody = await axiosApi.post(`product_body`, {
        slug: query?.slug,
      });

      if (ProductBody?.data?.message == "is_product") {
        if (
          query?.category &&
          query?.year &&
          query?.make &&
          query?.model &&
          query?.body &&
          query?.slug
        ) {
          return {
            redirect: {
              destination:
                "/" +
                query?.category +
                "/" +
                query?.year +
                "/" +
                query?.make +
                "/" +
                query?.model +
                "/" +
                query?.body +
                "/" +
                query?.slug,
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
        } else {
          return {
            redirect: {
              destination: "/",
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
      } else {
        if (
          query?.category &&
          query?.year &&
          query?.make &&
          query?.model &&
          query?.body
        ) {
          return {
            redirect: {
              destination:
                "/" +
                query?.category +
                "/" +
                query?.year +
                "/" +
                query?.make +
                "/" +
                query?.model +
                "/" +
                query?.body,
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
        } else {
          return {
            redirect: {
              destination: "/",
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
    }
);

const ExtraSlug = ({ categoryData = [], product = [] }) => {
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
          {(selectCategoryData[0]?.details?.name || "CarCoversFactory") +
            " - " +
            storeData?.store_name}
        </title>
        <meta
          name="title"
          content={selectCategoryData[0]?.details?.name || "CarCoversFactory"}
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
      <Banner data={selectCategoryData} />
      <Search categoryData={selectCategoryData} extraSlug={true} />
      <PageContent />
      <Footer />
    </>
  );
};

export default ExtraSlug;
