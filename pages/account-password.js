import React from "react";
import Footer from "../component/Footer/Footer";
import AccountPasswordPage from "../component/Account/AccountPasswordPage";
import HeaderTop from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "accountedit",
          "footerpage",
          "category",
        ])),
      },
    };
  }
);

const AccountPassword = ({ categoryData = [] }) => {
  return (
    <>
      <HeaderTop categoryData={categoryData} />
      <AccountPasswordPage categoryData={categoryData?.result} />
      <Footer />
    </>
  );
};

export default AccountPassword;
