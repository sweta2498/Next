import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { tawkToToggle } from "../../common_function/functions";

const SeconddaryWrap = ({ categoryData }) => {
  // console.log('=-=s-=', cartID);
  // console.log(`/cart${cartID?.cart_id !==undefined ? '?cart_id='+cartID?.cart_id : ''}`);
  // console.log(cartID?.cart_id !==undefined);
  const storeData = useSelector((state) => state?.common?.store);
  const language = storeData?.language?.name || "English";
  const { t: translate } = useTranslation("home");
  // console.log(storeData?.store_id != 25);

  return (
    <div className="secondary-wrap">
      <div className="row align-items-center">
        <div className="col-md col-md-4 col-6">
          <div className="logo-wrap">
            <Link href="/">
              <img
                src={storeData?.image_path + storeData?.store_logo}
                title={storeData?.store_name}
                alt={storeData?.store_name}
              />
            </Link>
          </div>
        </div>

        <div className="col-lg-8 col-md-8 col-6">
          <div className="content-area">
            <ul className="entry-list">
              <li className="review-wrap">
                <Link
                  href="https://www.shopperapproved.com/reviews/carcoversfactory.com/"
                  target="_blank"
                >
                  <img
                    // src={translate("customer review image")}
                    src={
                      `/Images/${language}/review.png` ||
                      translate("customer review image")
                    }
                    alt="reviews"
                  />
                </Link>{" "}
              </li>
              {storeData?.language?.name !== "English" && (
                <li className="card-wrap mt-1">
                  <div
                    className="chat-wrap chat-top c-pointer"
                    // onClick=""
                  >
                    <Link
                      href={`/cart?cart_id=${
                        categoryData?.cart_id !== undefined
                          ? categoryData?.cart_id
                          : ""
                      }`}
                    >
                      <img
                        src="https://d68my205fyswa.cloudfront.net/ccf-static-12wteslcufpclziv6jsdnos8d9r4zhrvoy736jwr0dl8ewcrqv2fiv.png"
                        alt="cart"
                      />
                    </Link>
                  </div>
                </li>
              )}
              {storeData?.language?.name === "English" && (
                <li>
                  <div className="card-wrap">
                    <Link
                      href={`/cart?cart_id=${
                        categoryData?.cart_id !== undefined
                          ? categoryData?.cart_id
                          : ""
                      }`}
                    >
                      <img
                        src="https://d68my205fyswa.cloudfront.net/ccf-static-12wteslcufpclziv6jsdnos8d9r4zhrvoy736jwr0dl8ewcrqv2fiv.png"
                        alt="CarCoversFactoryCart"
                      />
                      {translate("cart")}
                    </Link>
                  </div>
                </li>
              )}
              {Boolean(storeData?.telephone) && (
                <li
                  className=" d-sm-block d-md-none"
                  style={{ marginTop: "15px", marginRight: "10px" }}
                >
                  <Link href={`tel:${storeData?.telephone}`} title="Call US">
                    <i className="fa fa-phone fa-3x" aria-hidden="true"></i>
                  </Link>
                </li>
              )}

              {storeData?.language?.name === "English" && (
                <li>
                  <div
                    className="chat-wrap c-pointer mt-3"
                    onClick={tawkToToggle}
                  >
                    <img
                      src="https://d68my205fyswa.cloudfront.net/ccf-static-2zoj4rjoefbk310rnqpmq137m9m40jtmc1hpdcnjj5h445a9ack8ea.png"
                      alt="Live Chat"
                    />
                  </div>
                </li>
              )}
              {(Boolean(storeData?.telephone) || Boolean(storeData?.Fax)) && (
                <li>
                  <div
                    className={`contact-wrap ${
                      storeData?.store_id == "30" ? "mt-2" : ""
                    }`}
                  >
                    <div className="order-first">
                      <i className="fa fa-phone"></i>
                      {translate("call us to order")} 24/7
                    </div>
                    <div className="entry-phone">
                      <Link href={`tel:${storeData?.telephone}`}>
                        {storeData?.telephone}
                      </Link>
                    </div>
                    {Boolean(storeData?.store_id != "30") && storeData?.Fax ? (
                      <div className="entry-small">
                        {translate("customer sevice")}&nbsp;
                        <Link href={`tel:${storeData?.Fax}`}>
                          {storeData?.Fax}
                        </Link>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeconddaryWrap;
