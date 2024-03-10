import React from "react";
import Footer from "../component/Footer/Footer";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import RegisterPage from "../component/Account/RegisterPage";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "register",
          "footerpage",
          "category",
        ])),
      },
    };
  }
);

const Register = ({ categoryData = [] }) => {
  return (
    <>
      <Header categoryData={categoryData} />
      <RegisterPage categoryData={categoryData?.result} />
      <Footer />
    </>
  );
};

export default Register;
