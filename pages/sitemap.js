import React from "react";
import Footer from "../component/Footer/Footer";
import SiteMap from "../component/SiteMap";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "searchpage",
          "footerpage",
          "sitemap",
          "category",
        ])),
      },
    };
  }
);

const SiteMapPage = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("sitemap");
  const storeData = useSelector((state) => state?.common?.store);
  return (
    <>
      <Head>
        <title>{translate("sitemap") + " - " + storeData?.store_name}</title>
        <meta name="description" content={`Sitemap of ${storeData?.store_name}`}/>
      </Head>
      <Header categoryData={categoryData} />
      <SiteMap categoryData={categoryData?.result} />
      <Footer />
    </>
  );
};

export default SiteMapPage;
