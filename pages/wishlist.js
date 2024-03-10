import React from "react";
import Footer from "../component/Footer/Footer";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import LoginPage from "../component/Account/LoginPage";
import WishListPage from "../component/Account/WishListPage";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "login",
          "footerpage",
          "category",
        ])),
      },
    };
  }
);

const Wishlist = ({ categoryData = [] }) => {
  return (
    <>
      <Header categoryData={categoryData} />
      <WishListPage categoryData={categoryData?.result} />
      <Footer />
    </>
  );
};

export default Wishlist;
