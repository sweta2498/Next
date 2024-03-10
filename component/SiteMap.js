import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const SiteMap = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("sitemap");
  const storeData = useSelector((state) => state?.common?.store);
  return (
    <>
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">{translate("home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/sitemap">{translate("sitemap")}</Link>
                </li>
              </ol>
            </nav>
            <h1 className="text-center">{translate("sitemap")}</h1>
            <div className="holder">
              <div className="sitemap-info">
                <div className="left">
                  <ul>
                    {Array?.isArray(categoryData) &&
                      Boolean(categoryData?.length) &&
                      categoryData?.map((item) => (
                        <li key={item?._id + "sm"}>
                          <Link
                            href={
                              item?.slug === "disposable-covers"
                                ? "disposable-covers"
                                : "/" + item?.slug
                            }
                            title={item?.details?.name}
                          >
                            {item?.details?.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="right">
                  <ul>
                    <li>
                      <a>{translate("information")}</a>
                      <ul>
                        <li>
                          <Link href="/about-us">{translate("aboutus")}</Link>
                        </li>
                        {
                          storeData?.language?.code == "en" && (
                            <li>
                              <Link href="/gallery">{translate("gallery")}</Link>
                            </li>
                          )
                        }
                        <li>
                          <Link href="/terms-and-conditions">
                            {translate("terms_and_condition")}
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact">{translate("contactus")}</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SiteMap;
