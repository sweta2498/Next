import React from "react";
import Footer from "../component/Footer/Footer";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import AccountEditPage from "../component/Account/AccountEditPage";

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

const AccountEdit = ({ categoryData = [] }) => {
  return (
    <>
      <Header categoryData={categoryData} />
      <AccountEditPage categoryData={categoryData?.result} />
      <Footer />
    </>
  );
};

export default AccountEdit;
