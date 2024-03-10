import React from "react";
import { useTranslation } from "next-i18next";

const CartBanner = () => {
  const { t: translate } = useTranslation("cartpage");

  return (
    <>
      <section className="banner">
        <div className="container">
          <div className="page-banner page-banner-cart">
            <div className="entry-content">
              <h1 className="page-title">{translate("SHOPPING CART")}</h1>
              <div className="description">
                {" "}
                {translate("REVIEW YOUR SHOPPING CART")}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CartBanner;
