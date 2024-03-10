import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from "redux/store";
import Header from '../../component/Header/index';
import Footer from '../../component/Footer/Footer';
import AccountSuccessPage from "../../component/Account/AccountSuccessPage";

export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context) => {
            const language = store?.getState()?.common?.store?.language?.code;
            return {
                props: {
                    ...(await serverSideTranslations(language || 'en', ['home', 'searchpage', 'footerpage', 'category'])),
                },
            }
        }
)
const Success = ({ categoryData = [], cartID }) => {
    return (
        <>
            <Header categoryData={categoryData} cartID={cartID} />
            <AccountSuccessPage />
            <Footer />

        </>
    );
};

export default Success;
