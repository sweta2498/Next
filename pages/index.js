import React from "react";
import Header from "../component/Header/index";
import Banner from "../component/banner/Banner";
import Brand from "../component/brand/Brand";
import Lower from "../component/lowerBanner/LowerBanner";
import Search from "../component/search/Search";
import ReviewWrapper from "../component/ReviewWrapper/ReviewWrapper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "redux/store";
import Footer from "../component/Footer/Footer";
import { useSelector } from "react-redux";
import CustomerCovers from "../component/CustomerCovers";
import ThankYouTag from "../component/ThankYouTag";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "searchpage",
          "footerpage",
          "category",
        ])),
      },
    };
  }
);

const Home = ({ categoryData }) => {
  const storeData = useSelector((state) => state?.common?.store);

  return (
    <>
      {/* <ThankYouTag/> */}
      <Header categoryData={categoryData} />
      <Banner data={categoryData?.result} />
      <Search categoryData={categoryData?.result} />
      <Brand categoryData={categoryData?.result} />
      {storeData?.language?.code === "en" && <CustomerCovers />}
      <Lower />
      <ReviewWrapper />
      <Footer />
    </>
  );
};
export default Home;
