import React from "react";
import Checkout from "../../component/checkout/Checkout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import Header from "../../component/Header/index";
import Footer from "../../component/Footer/Footer";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "searchpage",
          "category",
          "checkoutpage",
          "footerpage",
        ])),
      },
    };
  }
);

const index = ({ categoryData = [] }) => {
  return (
    <>
      <Header categoryData={categoryData} />
      <Checkout cartID={categoryData} />
      <Footer />
    </>
  );
};

export default index;
