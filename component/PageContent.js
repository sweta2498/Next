import React from "react";
import { useTranslation } from "next-i18next";
const PageContent = () => {
  const { t: translate } = useTranslation("pagecontent");
  // const { t: translate } = useTranslation("searchpage");
  return (
    <>
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap no-padding">
            <section className="page-content single-wrapper">
              <div className="container">
                <div className="inner-wrap">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <h2 className="vehicle_heading1 text-center">
                          {translate("pc_heading")}
                        </h2>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-sm-4 text-center hr-spacer">
                        <img
                          data-src="https://d68my205fyswa.cloudfront.net/ds5f4sf564ds4h2k4.png"
                          src="https://d68my205fyswa.cloudfront.net/ds5f4sf564ds4h2k4.png"
                          className="custom-lazy loaded"
                        />
                        <div className="col_head_vehicle">
                          {translate("free_shipping")}
                        </div>
                        <p className="vehicle_text1">
                          {translate("free_shipping_msg")}
                        </p>
                      </div>
                      <div className="col-sm-4 text-center hr-spacer">
                        <img
                          data-src="https://d68my205fyswa.cloudfront.net/ds5f4sf564dk243.png"
                          src="https://d68my205fyswa.cloudfront.net/ds5f4sf564dk243.png"
                          className="custom-lazy loaded"
                        />
                        <div className="col_head_vehicle">
                          {translate("guaranteed_cover")}
                        </div>
                        <p className="vehicle_text1">
                          {translate("guaranteed_cover_msg")}
                        </p>
                      </div>
                      <div className="col-sm-4 text-center hr-spacer">
                        <img
                          data-src="https://d68my205fyswa.cloudfront.net/ds5f4sf564ds.png"
                          style={{ width: "30%" }}
                          src="https://d68my205fyswa.cloudfront.net/ds5f4sf564ds.png"
                          className="custom-lazy loaded"
                        />
                        <div className="col_head_vehicle">
                          {translate("return_policy")}
                        </div>
                        <p className="vehicle_text1">
                          {translate("return_policy_msg")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>{" "}
          </div>
        </div>
      </section>
    </>
  );
};

export default PageContent;
