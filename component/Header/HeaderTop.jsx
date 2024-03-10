import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

const HeaderTop = () => {
  const { t: translate } = useTranslation("home");
  const storeData = useSelector((state) => state?.common?.store);

  return (
    <>
      <div className="head-top">
        {
          storeData?.language?.code == "en" ?
          <>
            {
              storeData?.store_id == "25" || storeData?.store_id == "30" ? 
              <>
                {storeData?.store_id == "25" && <>{translate("header_top_25")}</>}
                {storeData?.store_id == "30" && <>{translate("header_top_30")}</>}
                <span className="d-inline-block">
                  <span className="tpbtn">{translate("free_shipping 25 & 30")}</span>
                </span>
              </>:
              <>
                {translate("header_top")}
                <span className="d-inline-block">GET AN ADDITIONAL 10% OFF ON YOUR ORDER.</span>{" "}
                <span className="d-inline-block">
                  Use Code{" "}
                  <span className="tpbtn">{translate("free_shipping")}</span>
                </span>
              </>
            }
          </>:
          <>
          {translate("header_top")}
          <span className="d-inline-block">
            <span className="tpbtn">{translate("free_shipping")}</span>
          </span>
        </>
        }
      </div>
    </>
  );
};

export default HeaderTop;
