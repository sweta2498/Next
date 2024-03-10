import Script from "next/script";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import  tagConfig from './../common_function/tagConfig'
import { tagConfig } from "../common_function/tagConfig";
import Head from "next/head";
import { createMarkup } from "../common_function/functions";
import { useRouter } from "next/router";

const HeaderTag = () => {
  const storeData = useSelector((state) => state?.common?.store);
  const router = useRouter();
  const [currentStore, setCurrentStore] = useState(
    tagConfig?.find((state) => state?.store_id == storeData?.store_id) || {}
  );
  const date = new Date();

  // useEffect(() => {
  //   setCurrentStore(
  //     tagConfig?.find((state) => state?.store_id == storeData?.store_id)
  //   );
  // }, [storeData]);

  return (
    <>
      {(process?.env?.NEXT_PUBLIC_ENV == "production" ||
        (router?.isReady && router?.query?.hasOwnProperty("run_tags"))) && (
        <>
          {/* <!-- Google Tag Manager --> */}
          {Boolean(currentStore?.gtag?.ads_id) && (
            <>
              <Script
                async
                id={"tagmanager"}
                strategy="beforeInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${currentStore?.gtag?.ads_id}`}
              />
              <Script
                id={"gTagDataLayer"}
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={createMarkup(`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${currentStore?.gtag?.ads_id}');
          `)}
              />
            </>
          )}

          {Boolean(currentStore?.gtm?.token) && (
            <Script id={"googleTagManger"}>
              {`
              (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                  'gtm.start': new Date().getTime(),
                  event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                  'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
              })(window, document, 'script', 'dataLayer', '${currentStore?.gtm?.token}');
        `}
            </Script>
          )}

          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${currentStore?.gtm?.token}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          {/* <!-- End Google Tag Manager --> */}

          {/* <!-- bing --> */}
          {Boolean(currentStore?.bing?.id) && (
            <Script id={"bing"}>
              {`
          (function (w, d, t, r, u) {
            var f, n, i;
            w[u] = w[u] || [], f = function () {
               var o = {
                  ti: ${currentStore?.bing?.id}
               };
               o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
            }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () {
               var s = this.readyState;
               s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
            }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
         })(window, document, "script", "//bat.bing.com/bat.js", "uetq");
          `}
            </Script>
          )}

          <noscript>
            <img
              src={`//bat.bing.com/action/0?ti=${currentStore?.bing?.id}&Ver=2`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          {/* <!-- End Bing --> */}

          {/* <!-- Meta Pixel Code 1 --> */}
          {Boolean(currentStore?.metaPixel?.metaPixel_id_1) && (
            <Script id={"metaPixel1"}>
              {`
          ! function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
               n.callMethod ?
                  n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
         }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
         fbq('init', ${currentStore?.metaPixel?.metaPixel_id_1});
         fbq('track', 'PageView');
          `}
            </Script>
          )}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${currentStore?.metaPixel?.metaPixel_id_1}&ev=PageView&noscript=1`}
            />
          </noscript>
          {/* <!--End Meta Pixel Code 1 --> */}

          {/* <!-- Meta Pixel Code 2 --> */}
          {Boolean(currentStore?.metaPixel?.metaPixel_id_2) && (
            <Script id={"metaPixel2"}>
              {`
          ! function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
               n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
         }
         (window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
         fbq('init', ${currentStore?.metaPixel?.metaPixel_id_2});
         fbq('track', 'PageView');
          `}
            </Script>
          )}

          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${currentStore?.metaPixel?.metaPixel_id_2}&ev=PageView&noscript=1`}
            />
          </noscript>
          {/* <!--End Meta Pixel Code 2--> */}
        </>
      )}
    </>
  );
};

export default HeaderTag;
