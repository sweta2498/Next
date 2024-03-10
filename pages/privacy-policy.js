import React from "react";
import Footer from "../component/Footer/Footer";
import PrivacyPolicy from "../component/PrivacyPolicy";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "searchpage",
          "footerpage",
          "privacypolicypage",
          "category",
        ])),
      },
    };
  }
);

const PrivacyPolicyPage = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("privacypolicypage");
  const storeData = useSelector((state) => state?.common?.store);
  return (
    <>
      <Head>
        <title>{translate("privacy_policy") + " - " + storeData?.store_name}</title>
        <meta name='description' content='A warm welcome to our privacy policy page. Go through it carefully to know our company’s policy regarding data collection, protection, storage, uses, and sharing. Proceed ahead only when you fully agree with It!'/>
      </Head>
      <Header categoryData={categoryData} />
      <PrivacyPolicy />
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
