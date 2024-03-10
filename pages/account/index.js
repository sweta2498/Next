import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { wrapper } from "redux/store";
import AccountPage from '../../component/Account/AccountPage';
import Header from '../../component/Header/index';
import Footer from '../../component/Footer/Footer';

export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context) => {
            const language = store?.getState()?.common?.store?.language?.code;
            return {
                props: {
                    ...(await serverSideTranslations(language || 'en', ['home', 'account', 'footerpage', 'category'])),
                },
            }
        }
)

const Index = ({ categoryData = [], cartID }) => {

    return (
        <>
            <Header categoryData={categoryData} cartID={cartID} />
            <AccountPage categoryData={categoryData} />
            <Footer />
        </>
    )
}

export default Index;