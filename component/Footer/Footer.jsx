import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";

const Footer = () => {
  const storeData = useSelector((state) => state?.common?.store);
  const router = useRouter();
  const { t: translate } = useTranslation("footerpage");
  const paymentOption =
    storeData?.store_id == "15"
      ? "https://d68my205fyswa.cloudfront.net/fit-in/380x39/ccf-2022082416614023805g0.png"
      : "https://d68my205fyswa.cloudfront.net/ccf-uk-static-w45d2vqco9hb6zckqhjywtrvjg2ugnuv45z5h4ft7meud2jo1bmeiq.png";

  const styles = {
    height: "45px",
  };

  const emailHandleSubmit = (e) => {
    e.preventDefault();
    router?.push("/newsletter");
  };

  return (
    <>
      {(process?.env?.NEXT_PUBLIC_ENV == "production" ||
        (router?.isReady && router?.query?.hasOwnProperty("run_tags"))) && (
        <>
          {Boolean(storeData?.klaviyo_company_id) && (
            <>
              <Script
                strategy="beforeInteractive"
                type="text/javascript"
                src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${storeData?.klaviyo_company_id}`}
              ></Script>
              <Script id="klaviyoOrder">
                {`
              ! function () {
                if (!window.klaviyo) {
                   window._klOnsite = window._klOnsite || [];
                   try {
                      window.klaviyo = new Proxy({}, {
                         get: function (n, i) {
                            return "push" === i ? function () {
                               var n;
                               (n = window._klOnsite).push.apply(n, arguments)
                            } : function () {
                               for (var n = arguments.length, o = new Array(n), w = 0; w < n; w++) o[w] = arguments[w];
                               var t = "function" == typeof o[o.length - 1] ? o.pop() : void 0,
                                  e = new Promise((function (n) {
                                     window._klOnsite.push([i].concat(o, [function (i) {
                                        t && t(i), n(i)
                                     }]))
                                  }));
                               return e
                            }
                         }
                      })
                   } catch (n) {
                      window.klaviyo = window.klaviyo || [], window.klaviyo.push = function () {
                         var n;
                         (n = window._klOnsite).push.apply(n, arguments)
                      }
                   }
                }
             }();
            `}
              </Script>
            </>
          )}
          {Boolean(storeData?.retention_id) && (
            <>
              <Script
                type="text/javascript"
                id={"retentionId"}
                strategy="beforeInteractive"
              >
                {`
              ! function () {
                var geq = window.geq = window.geq || [];
                if (geq.initialize) return;
                if (geq.invoked) {
                   if (window.console && console.error) {
                      console.error("GE snippet included twice.");
                   }
                   return;
                }
                geq.invoked = true;
                geq.methods = ["page", "suppress", "trackOrder", "identify", "addToCart", "callBack", "event"];
                geq.factory = function (method) {
                   return function () {
                      var args = Array.prototype.slice.call(arguments);
                      args.unshift(method);
                      geq.push(args);
                      return geq;
                   };
                };
                for (var i = 0; i < geq.methods.length; i++) {
                   var key = geq.methods[i];
                   geq[key] = geq.factory(key);
                }
                geq.load = function (key) {
                   var script = document.createElement("script");
                   script.type = "text/javascript";
                   script.async = true;
                   if (location.href.includes("vge=true")) {
                      script.src = "https://s3-us-west-2.amazonaws.com/jsstore/a/" + key + "/ge.js?v=" + Math.random();
                   } else {
                      script.src = "https://s3-us-west-2.amazonaws.com/jsstore/a/" + key + "/ge.js";
                   }
                   var first = document.getElementsByTagName("script")[0];
                   first.parentNode.insertBefore(script, first);
                };
                geq.SNIPPET_VERSION = "1.6.1";
                geq.load("${storeData?.retention_id}");
             }();
            `}
              </Script>
              <Script>{`geq.page()`}</Script>
            </>
          )}
        </>
      )}

      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-top">
            <div className="row">
              <div className="offset-md-2 col-md-4">
                <div className="payment-card">
                  <h4>{translate("Payment Options")}</h4>
                  <img
                    data-src={paymentOption}
                    src={paymentOption}
                    className="img-fluid custom-lazy loaded"
                    alt=""
                    style={storeData.store_id == "15" ? null : styles}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="subscribe-wrap text-center">
                  <h4
                    style={
                      storeData.store_id == "50"
                        ? {
                            fontFamily: "webfontmedium",
                          }
                        : null
                    }
                    // style={{
                    //   fontFamily:
                    //     storeData?.store_id == "50"
                    //       ? "webfontmedium"
                    //       : "webfontbold",
                    // }}
                  >
                    {translate("Exclusive offers")}
                  </h4>
                  <form
                    action="newsletter"
                    onSubmit={emailHandleSubmit}
                    method="POST"
                  >
                    <input
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Email"
                      required
                    />
                    <input type="submit" value={translate("sign_up")} />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="widget-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="entry-widget mb-0 mb-md-4">
                  <h5 className="widget-title">
                    {storeData?.language?.name == "English"
                      ? storeData?.store_id == "30"
                        ? "AUSTRALIA CAR COVERS"
                        : "CAR COVER FACTORY"
                      : translate("carcoverfactory")}
                  </h5>
                  <p>
                    {storeData?.store_id == "30" ? (
                      <>
                        At Australia Car Covers, we're proud to call ourselves
                        an elite retailer in car covers. We offer some of the
                        lowest prices in the industry with top quality. Feel
                        free to call us at (03) 9109 8946 for any questions!
                      </>
                    ) : (
                      <>
                        {translate("footer_description")}
                        {storeData?.telephone &&
                          storeData?.telephone + " for any questions!"}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="col-md-4 border-lr">
                <div className="entry-widget">
                  <h5 className="widget-title">{translate("Customer care")}</h5>
                  <ul className="entry-list">
                    <li>
                      <Link href="/about-us">{translate("About us")}</Link>
                    </li>
                    {storeData?.language?.code == "en" ? (
                      <li>
                        <Link href="/gallery">{translate("gallery")}</Link>
                      </li>
                    ) : (
                      <></>
                    )}
                    <li>
                      <Link href="/contact">{translate("Contact us")}</Link>
                    </li>
                    <li>
                      <Link href="/return">{translate("Returns")}</Link>
                    </li>
                    <li>
                      <Link href="/sitemap">{translate("Site map")}</Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy">
                        {translate("Privacy Policy")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms-and-conditions">
                        {translate("Terms  & Condition")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="entry-widget mb-3 mb-md-0">
                  <h5 className="widget-title">
                    {storeData?.telephone && (
                      <Link href={`tel:+1-`}>
                        <p className="number">{storeData?.telephone}</p>
                      </Link>
                    )}

                    {!storeData?.telephone && (
                      <Link href={`tel:+1-${storeData?.telephone}`}>
                        <p className="number"></p>
                      </Link>
                    )}
                  </h5>

                  {storeData?.store_id == "20" && <p>VAT: 374 9104 82</p>}
                  <p>© 2023 {storeData?.store_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* <footer className={styles["footer-wrapper"]}>
        <div className="container">
          <div className={styles["footer-top"]}>
            <div className="offset-md-2">
              <div className={styles["payment-card"]}>
                <h4>{translate("Payment Options")}</h4>
                <img
                  src="https://d68my205fyswa.cloudfront.net/fit-in/380x39/ccf-2022082416614023805g0.png"
                  className="img-fluid custom-lazy loaded"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className={`${styles["subscribe-wrap"]}`}>
                <h4> {translate("Exclusive offers")}</h4>
                <form>
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control"
                    id="exampleInputEmail"
                    required
                  />
                  <input type="submit" value={translate("sign_up")} />
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["widget-wrapper"]}>
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className={styles["entry-widget"]}>
                  <h5 className={styles["widget-title"]}>Car cover factory</h5>
                  <p>{translate("footer_description")}</p>
                </div>
              </div>
              <div className={`col-md-4 ${styles["border-1r"]}`}>
                <div className={styles["entry-widget"]}>
                  <h5 className={styles["widget-title"]}>
                    {translate("Customer care")}
                  </h5>
                  <ul className={styles["entry-lists"]}>
                    <li className={styles["entry-list"]}>
                      {translate("About us")}
                    </li>
                    <li className="entry-list">{translate("Contact us")}</li>
                    <li className="entry-list">{translate("Returns")}</li>
                    <li className="entry-list">{translate("Site map")}</li>
                    <li className="entry-list">
                      {translate("Privacy Policy")} {131 * 25}
                    </li>
                    <li className="entry-list">
                      {translate("Terms  & Condition")}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className={`${styles["entry-widget"]} mb-3 mb-md-4`}>
                  <h5 className={styles["widget-title"]}>
                    <li className={styles["contact-number"]}>
                      <p>(877) 300-9885</p>
                    </li>
                  </h5>
                  <p>@ carcoversFactory.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
    </>
  );
};

export default Footer;
