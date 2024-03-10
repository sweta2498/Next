import React from "react";
import Footer from "../component/Footer/Footer";
import { wrapper } from "redux/store";
import Header from "../component/Header/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const language = store?.getState()?.common?.store?.language?.code;
    return {
      props: {
        ...(await serverSideTranslations(language || "en", [
          "home",
          "newsletter",
          "searchpage",
          "category",
          "footerpage",
        ])),
      },
    };
  }
);

const Newsletter = ({ categoryData = [] }) => {
    const { t: translate } = useTranslation("newsletter");
  return (
    <>
      <Header categoryData={categoryData} />
      <section class="page-content single-wrapper">
        <div class="container">
          <div class="inner-wrap">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <Link href="/">{translate("home")}</Link>
                </li>
                <li class="breadcrumb-item">
                  <Link href="/newsletter">{translate("newsletter")}</Link>
                </li>
              </ol>
            </nav>
            <div class="holder">
              <div class="login-content">
                <div class="left">
                  <h1>{translate("newsletter_subscription")}</h1>
                  <div class="content">
                    <div class="success">{translate("thankyou_message")}</div>
                  </div>
                  <div class="buttons">
                    <div class="left">
                      <Link href="/" class="button">
                        {translate("back")}
                      </Link>
                    </div>
                    <div class="right">
                      <Link href="/" type="button" class="btn btn-primary">
                        {translate("continue")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Newsletter;
