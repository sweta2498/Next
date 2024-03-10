import Head from "next/head";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { tagConfig } from "../common_function/tagConfig";
import countriesList from "../countriesList.json";
import moment from "moment";
// let countryIsoCode;

const ThankYouTag = ({ data }) => {
  const storeData = useSelector((state) => state?.common?.store);
  const [currentStore, setCurrentStore] = useState(
    tagConfig?.find((state) => state?.store_id == storeData?.store_id) || {}
  );
  const date = new Date();
  const [countryIsoCode, setCountryIsoCode] = useState(
    countriesList?.find((item) => item?.name == data?.shipping_address?.country)
  );

  var moment = require("moment");
  // console.log(`${moment(data?.delivery_date).format("YYYY-MM-DD")}`);
  // console.log(data?.delivery_date);
  //   useEffect(() => {

  //   }, []);

  // console.log(countryIsoCode);

  // useEffect(() => {
  //   setCurrentStore(
  //     tagConfig?.find((state) => state?.store_id == storeData?.store_id)
  //   );
  // }, [storeData]);

  return (
    <>
      {/* <!-- Google conversion --> */}
      {Boolean(Object.keys(countryIsoCode)?.length) && (
        <Script id="googlePurchaseConversion">
          {`
           try {
             gtag('set', 'user_data', {
                 "email":"${data?.shipping_address?.email}",
                 "phone_number": "${
                   countryIsoCode?.code + data?.shipping_address?.phone
                 }",
                 "address": {
                     "first_name": "${data?.shipping_address?.first_name}",
                     "last_name": "${data?.shipping_address?.last_name}",
                     "street": "${data?.shipping_address?.address?.address1}",
                     "city": "${data?.shipping_address?.city}",
                     "region": "${data?.shipping_address?.state}",
                     "postal_code": "${data?.shipping_address?.postal_code}",
                     "country":"${countryIsoCode?.iso_code_2}"
                 }
             });
         }catch(e){
             console.log(e);
         }
        `}
        </Script>
      )}

      {Boolean(currentStore?.gtag?.ads_conversion_id) && (
        <Script id={"googleConversion"}>
          {`
            gtag('event', 'conversion', {
              'send_to': "${currentStore?.gtag?.ads_conversion_id}",
              'value': "${data?.total_price}",
              'currency': "${storeData?.currency?.code}",
              'transaction_id': "${data?.order_id}"
            });
         `}
        </Script>
      )}
      {/* <!--End Google conversion --> */}

      {/* <!-- bing conversion code starts --> */}
      {Boolean(currentStore?.bing?.id) && (
        <Script id={"bingConversion"}>
          {`    
            window.uetq = window.uetq || [];
            window.uetq.push({ 'gv': ${
              data?.total?.find((dt) => dt?.key === "total")?.value || 0
            }, 'gc': '${storeData?.currency?.code}' });
          `}
        </Script>
      )}
      {/* <!-- bing conversion code ends --> */}

      <Script id={"trackPurchase"}>
        {`
          if(typeof window.fbq !== 'undefined'){
            try {
              window.fbq('track', 'Purchase', {currency: "${storeData?.currency?.code}", value: "${data?.total_price}"});
            } catch (e) {
              console.log(e)
            }
          }
        `}
      </Script>

      {/* <!-- Google ecommerce Code --> */}
      {Boolean(currentStore?.gtm?.token) && (
        <Script type="text/javascript" id={"googleGA4PurchaseConversion"}>
          {`        
               // <!-- Event snippet for GA-4 purchase datalayer -->
               //dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
               window.dataLayer.push({
                   event: 'GA4Purchase',
                   ecommerce: {
                       transaction_id:  ${data?.order_id},
                       affiliation: "GA4 Purchase - www${storeData?.domain}",
                       value: ${
                         data?.total?.find((dt) => dt?.key === "total")
                           ?.value || 0
                       },
                       tax: ${
                         data?.total?.find((dt) => dt?.key === "tax")?.value ||
                         0
                       },
                       shipping:  ${
                         data?.total?.find((dt) => dt?.key === "shipping")
                           ?.value || 0
                       },
                       currency: "${storeData?.currency?.code}",
                       coupon: ${
                         data?.total?.find((dt) => dt?.key === "coupon")
                           ?.value || 0
                       },
                       items: ${JSON.stringify(
                         data?.products?.map((item, i) => {
                           return {
                             item_id: item?._id,
                             item_name: item?.product_name,
                             affiliation: `www${storeData?.domain}`,
                             currency: storeData?.currency?.code,
                             discount: 0.0,
                             index: i,
                             item_brand: item?.option?.make,
                             item_category: "",
                             item_category1: item?.option?.model,
                             price: item?.price,
                             quantity: item?.quantity,
                             coupon: data?.total?.find(
                               (dt) => dt?.key === "coupon"
                             )?.value,
                           };
                         })
                       )}
                   }
               });
              `}
        </Script>
      )}

      {/* <!-- Google ecommerce Code --> */}
      {Boolean(storeData?.retention_id) && (
        <Script id={"rententionGoogleTrackOrder"}>
          {`
              if(typeof window.geq !== 'undefined'){//rentention
                try {
                  window.geq.trackOrder({order_number: "${data?.order_id}", order_amount: "${data?.total_price}", order_email: "${data?.shipping_address?.email}"})
                } catch (e) {
                    console.log(e)
                }
              }
         `}
        </Script>
      )}
      {/* <!-- End Google ecommerce Code --> */}

      {/* <!-- google review code starts --> */}
      {Boolean(currentStore?.merchant_id) && (
        <>
          <Script
            id={"googleReview"}
            src="https://apis.google.com/js/platform.js?onload=renderOptIn"
            async
            defer
          ></Script>
          <Script id={"googlereview_gapi"}>
            {`(window.renderOptIn = function () {
                window.gapi.load("surveyoptin", function () {
                  window.gapi.surveyoptin.render({
                    merchant_id: "${currentStore?.merchant_id}",
                    order_id: "${data?.order_id}",
                    email: "${data?.shipping_address?.email}",
                    delivery_country: "${countryIsoCode?.iso_code_2}",
                    estimated_delivery_date:"${moment(
                      data?.delivery_date
                    ).format("YYYY-MM-DD")}",
                  });
                });
              })`}
          </Script>
        </>
      )}
      {/* <!-- google review code ends --> */}

      {/* <!-- shoppers code starts --> */}
      {Boolean(currentStore?.shopper_approved?.site) && (
        <>
          <Script type="text/javascript" id={"shoppersCode"}>
            {`
                var sa_values = { "site":${
                  currentStore?.shopper_approved?.site
                }, "token":${currentStore?.shopper_approved?.token} }; 
                function saLoadScript(src) 
                {
                    var js = window.document.createElement("script");
                    js.src = src; js.type = "text/javascript"; 
                    js.onload = function (e) {
                     setTimeout(() => {
                       try {
                         let input = document.getElementsByClassName("sa_followup");
                         if(Boolean(input?.length)){
                           for(let i=0;i<input.length;i++){
                             input[i].addEventListener("click" , () => {
                               document.getElementById("sa_email").setAttribute("value" , "${
                                 data?.shipping_address?.email
                               }")
                               document.getElementById("sa_name").setAttribute("value" , "${
                                 data?.shipping_address?.first_name +
                                 " " +
                                 data?.shipping_address?.last_name
                               }")
                             })
                           }
                         }
                       }
                       catch(e) { 
                         console.log(e)
                       }
                     } , 2500)
                    }
                    document.getElementsByTagName("head")[0].appendChild(js); 
                }
                var d = new Date(); 
                if (d.getTime() - 172800000 > 1477399567000) saLoadScript("//www.shopperapproved.com/thankyou/rate/${
                  currentStore?.shopper_approved?.site
                }.js"); 
                else saLoadScript("//direct.shopperapproved.com/thankyou/rate/${
                  currentStore?.shopper_approved?.site
                }.js?d=" + d.getTime()); `}
          </Script>
        </>
      )}
    </>
  );
};

export default ThankYouTag;
