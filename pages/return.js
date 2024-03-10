import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import BreadCrumb from "../component/BreadCrumb";
import Footer from "../component/Footer/Footer";
import Header from "../component/Header/index";
import ReturnPolicy from "../component/ReturnPolicy";
import { wrapper } from "redux/store";
import { useTranslation } from "next-i18next";
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
          "category",
          "returnpolicy",
          "footerpage",
        ])),
      },
    };
  }
);

const Return_Policy = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("returnpolicy");
  const storeData = useSelector((state) => state?.common?.store);
  return (
    <>
      <Head>
        <title>{translate("returnpolicy") + " - " + storeData?.store_name}</title>
        <meta name="description" content="Want to return/replace the received car covers? Write to us within 30 days of order placement to get RMA number and return/replace your product. Fetch repayment in full once we receive the returned car covers."/>
      </Head>
      <Header categoryData={categoryData} />
      <ReturnPolicy />
      <Footer />
    </>
  );
};

export default Return_Policy;
