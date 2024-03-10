import React from "react";
import Footer from "../component/Footer/Footer";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import AccountAddressPage from "../component/Account/AccountAddressPage";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "accountaddress",
          "footerpage",
          "category",
        ])),
      },
    };
  }
);

const AccountAddress = ({ categoryData = [] }) => {
  return (
    <>
      <Header categoryData={categoryData} />
      <AccountAddressPage categoryData={categoryData?.result} />
      <Footer />
    </>
  );
};

export default AccountAddress;
