import React from 'react'
import Header from "./../component/Header/index"
import { wrapper } from "redux/store";
import Footer from '../component/Footer/Footer';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Head from 'next/head';

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async ({context , query}) => {
      const language = store?.getState()?.common?.store?.language?.code;

      if(query?.email && query?.email?.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        return {
          props: {
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "unsubscribe",
              "category",
            ])),
          },
        };
      }
      else{
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
          props: {
            ...(await serverSideTranslations(language || "en", [
              "home",
              "footerpage",
              "unsubscribe",
              "category",
            ])),
          },
        };
      }
    }
);

const Unsubscribe = ({ categoryData = [] }) => {
    const { t: translate } = useTranslation("unsubscribe");
    return (
      <>
          <Head>
            <title>{translate("title")}</title>
          </Head>
          <Header categoryData={categoryData}/>
          <section>
              <div className='container' style={{paddingTop : '10px' , paddingBottom : '20px'}}>
                  <div className='bg-white' style={{padding : '20px 20px 50px'}}>
                      <div style={{marginTop : '40px' , minHeight : '400px'}}>
                          <h3 className='text-center'><div className="alert alert-success" role="alert">{translate("unsubscribe")}</div></h3>
                      </div>
                  </div>
              </div>
          </section>
          <Footer />
      </>
    )
}

export default Unsubscribe