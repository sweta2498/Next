import React from "react";
import Footer from "../component/Footer/Footer";
import About from "../component/About";
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
                    "searchpage",
                    "footerpage",
                    "category",
                ])),
            },
        };
    }
);

const AboutPage = ({ categoryData = [] }) => {
    return (
        <>
            <HeaderTop categoryData={categoryData} />
            <About />
            <Footer />
        </>
    );
};

export default AboutPage;
