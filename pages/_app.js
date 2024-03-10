import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import App from "next/app";
import { Provider } from "react-redux";
import { wrapper } from "../redux/store";
import {
  setSessionAxios,
  setSessionRes,
} from "../common_function/cookie_helper";
import { appWithTranslation } from "next-i18next";
import axiosApi from "../axios_instance";
import { SET_BASEURL, SET_NAVDATA, SET_STORE } from "../redux/types";
import { useRouter } from "next/router";
axiosApi.defaults.withCredentials = true;
import HeaderTag from "../component/HeaderTag";
import ToasterComponent from "../component/ToasterComponent";

function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  axiosApi.defaults.baseURL = props?.baseUrl;
  const router = useRouter();
  const lang = props?.storeData?.language?.code === "en";
  // console.log(props?.storeData);

  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta
          name="language"
          content={props?.storeData?.language?.code || "en"}
        />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="msvalidate.01" content="6FF60452CD1EEF58CD16751615E55D25" />
        <meta name="author" content="CarCoversFactory.com" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <title>{props?.storeData?.title || "Car Covers Factory"}</title>
        <meta
          name="description"
          content={props?.storeData?.description || "Car Covers Factory"}
        />
        <link rel="canonical" href={props?.host + router?.asPath} />

        {Boolean(process?.env?.NEXT_PUBLIC_ENV == "production") ? (
          <meta name="robots" content="index, follow" />
        ) : (
          <meta name="robots" content="noindex, nofollow" />
        )}

        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={
            Boolean(lang) ? "/apple-touch-icon.png" : "/apple-touch-icon-2.png"
          }
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={Boolean(lang) ? "/favicon-32x32.png" : "/favicon-32x32-2.png"}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={Boolean(lang) ? "/favicon-16x16.png" : "/favicon-16x16-2.png"}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      </Head>

      <Provider store={store}>
        <ToasterComponent />
        <HeaderTag storeData={props?.storeData} />
        <Component
          {...props?.pageProps}
          storeData={props?.storeData}
          categoryData={props?.categoryData}
        />
      </Provider>
      {props?.storeData?.language?.code == "en" ? (
        <Script id="tawk_to">
          {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/59c9b685c28eca75e46223d3/default';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();`}
        </Script>
      ) : (
        <></>
      )}
    </>
  );
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (context) => {
    const host = context?.ctx?.req?.headers?.host;
    const regex = new RegExp(/(localhost)|(\d\.)/gm);

    const baseUrl =
      (process?.env?.NEXT_PUBLIC_ENV == "production" ||
        process?.env?.NEXT_PUBLIC_ENV == "development") &&
      !regex.test(host)
        ? host?.replace(/(devnext)|(www)/, "https://dev-api") + "/api/client/"
        : process?.env?.NEXT_PUBLIC_API_BASE_URL +
          host?.slice(-4) +
          "/api/client/";
    // const baseUrl = process?.env?.NEXT_PUBLIC_API_BASE_URL
    try {
      axiosApi.defaults.baseURL = baseUrl;
      const common_headers = await setSessionAxios(context?.ctx?.req);
      const pageProps = await App.getInitialProps(context); // Retrieves page's `getInitialProps`
      const storeData = await axiosApi.get("store/one", {
        headers: {
          ...common_headers,
        },
      });
      const categoryData = await axiosApi.get("category/list", {
        headers: {
          ...common_headers,
        },
      });
      setSessionRes(storeData?.headers, context?.ctx?.res);

      await store.dispatch({
        type: SET_BASEURL,
        payload: baseUrl,
      });

      await store.dispatch({
        type: SET_STORE,
        payload: storeData?.data?.result || {},
      });

      await store.dispatch({
        type: SET_NAVDATA,
        payload: categoryData?.data || {},
      });

      return {
        ...pageProps,
        storeData: storeData?.data?.result || {},
        categoryData: categoryData?.data || {},
        baseUrl: baseUrl,
        host: host,
      };
    } catch (err) {
      console.log(err);
      return {
        pageProps: {
          pageProps: {},
          storeData: {},
          categoryData: {},
          baseUrl,
          host: host,
        },
        redirect: { destination: "/500", permanent: false },
      };
    }
  }
);

// export default wrapper.withRedux(MyApp)
export default appWithTranslation(MyApp);
