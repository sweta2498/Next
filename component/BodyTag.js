import Head from "next/head";
import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { tagConfig } from "../common_function/tagConfig";

const BodyTag = () => {
  // const storeData = useSelector((state) => state?.common?.store);
  // const [currentStore, setCurrentStore] = useState({});

  // useEffect(() => {
  //   setCurrentStore(
  //     tagConfig?.find((state) => state?.store_id == storeData?.store_id)
  //   );
  // }, [storeData]);

  return (
    <Head>
      <noscript>
        <img
          height="1"
          width="1"
          style="display:none"
          src="https://www.facebook.com/tr?id=759973975126556&ev=PageView&noscript=1"
        />
      </noscript>
      <noscript>
        <img
          height="1"
          width="1"
          style="display:none"
          src="https://www.facebook.com/tr?id=940594226977592&ev=PageView&noscript=1"
        />
      </noscript>

      <noscript>
        <img
          src="//bat.bing.com/action/0?ti=5681247&Ver=2"
          height="0"
          width="0"
          style="display:none; visibility: hidden;"
        />
      </noscript>
      {/* 
<!-- Google Tag Manager (noscript) --> */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=<?php echo $gtm_token; ?>"
          height="0"
          width="0"
          style="display:none;visibility:hidden"
        ></iframe>
      </noscript>
      {/* <!-- End Google Tag Manager (noscript) --> */}
    </Head>
  );
};

export default BodyTag;
