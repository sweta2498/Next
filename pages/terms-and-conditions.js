import React from "react";
import Footer from "../component/Footer/Footer";
import TermsAndCondition from "../component/TermsAndCondition";
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
          "termsandconditionpage",
          "category",
        ])),
      },
    };
  }
);

const TermsAndConditionPage = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("termsandconditionpage");
  const storeData = useSelector((state) => state?.common?.store);
  return (
    <>
      <Head>
        <title>{translate("terms and condition") + " - " + storeData?.store_name}</title>
        <meta name='description' content='Go through our terms and conditions carefully- our foundation to work with clients. It sets out a legally binding agreement between you and us. Proceed ahead only when you fully agree with it. It’s a subject matter of sudden change without any prior notification.'/>
      </Head>
      <Header categoryData={categoryData} />
      <TermsAndCondition />
      <Footer />
    </>
  );
};

export default TermsAndConditionPage;
