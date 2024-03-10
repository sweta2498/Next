import React from "react";
import Footer from "../component/Footer/Footer";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import ForgottenPage from "../component/Account/ForgottenPage";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "forgotten",
          "footerpage",
          "category",
        ])),
      },
    };
  }
);

const Forgotten = ({ categoryData = [] }) => {
  return (
    <>
      <Header categoryData={categoryData} />
      <ForgottenPage categoryData={categoryData?.result} />
      <Footer />
    </>
  );
};

export default Forgotten;
