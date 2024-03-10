import React from "react";
import Contact_Us from "../component/Contact_Us";
import BreadCrumb from "../component/BreadCrumb";
import Header from "../component/Header/index";
import Footer from "../component/Footer/Footer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
          "category",
          "footerpage",
          "contactuspage",
        ])),
      },
    };
  }
);

const ContactUs = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("contactuspage");
  const storeData = useSelector((state) => state?.common?.store);
  return (
    <>
      <Head>
        <title>{translate("contact_us") + " - " + storeData?.store_name}</title>
        <meta name="description" content={`For all questions and concerns, Write to us at ${storeData?.email} or call ${storeData?.telephone ? storeData?.telephone : ""}, ${storeData?.Fax ? storeData?.Fax : ""} at any time. Get the best solutions from one of our representatives. We are happy to help you!`}/>
      </Head>
      <Header categoryData={categoryData} />
      {/* <div className='container p-3 bg-light'>
                <BreadCrumb paths={[{ url: "/contact-us", title: (translate('contact_us')) }]} /> */}
      <Contact_Us />
      {/* </div> */}
      <Footer />
    </>
  );
};

export default ContactUs;
