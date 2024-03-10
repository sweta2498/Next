import React from "react";
import Footer from "../component/Footer/Footer";
import Gallery_Page from "../component/Gallery_Page";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { wrapper } from "redux/store";
import Head from "next/head";
import { useSelector } from "react-redux";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "breadcrumb",
          "footerpage",
          "gallery",
          "category",
        ])),
      },
    };
  }
);

const Gallery = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("gallery");
  const storeData = useSelector((state) => state?.common?.store);

  return (
    <>
      <Head>
        <title>{translate("gallery") + " - " + storeData?.store_name}</title>
        <meta name="description" content="Take a look at these examples of the our customer’s covers on their vehicles! We have a wide variety of covers for you to choose from, giving you plenty of options for your vehicle covers. We’ll be adding to this gallery on a daily basis!"/>
      </Head>
      <Header categoryData={categoryData} />
      <section className="banner">
        <div className="container mt-2">
          <div className="page-banner page-banner-cart">
            <div className="entry-content">
              <h1 className="page-title">{translate("gallery")}</h1>
            </div>
          </div>
        </div>
      </section>
      <Gallery_Page />
      <Footer />
    </>
  );
};

export default Gallery;
