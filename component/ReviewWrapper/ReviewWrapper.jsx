import React from "react";
import { useTranslation } from "next-i18next";
import LazyLoad from "react-lazy-load";

const ReviewWrapper = () => {
  const { t: translate } = useTranslation("home");

  return (
    <>
      <section className="review-wrapper">
        <div className="container">
          <h2 className="section-title">{translate("review_header")}!</h2>
          <div className="row">
            <div className="inner-wrap">
              <div className="entry-single">
                <div className="entry-img">
                  <LazyLoad height="100%" offset={120}>
                    <img
                      data-src="https://d68my205fyswa.cloudfront.net/ccf-static-9i0p682lo7dg6nrwpmhvartzv87lelh4cggh478uenb0owbfoglbkp.png"
                      src="https://d68my205fyswa.cloudfront.net/ccf-static-9i0p682lo7dg6nrwpmhvartzv87lelh4cggh478uenb0owbfoglbkp.png"
                      alt="Carcoversfactory.com"
                      className="custom-lazy loaded"
                    />
                  </LazyLoad>
                </div>
                <div className="entry-content">
                  <div className="content">{translate("review1")}</div>
                  <div className="rating">
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star me-1"></span>
                  </div>
                  <h4 className="entry-name">- John D.</h4>
                </div>
              </div>
              <div className="entry-single">
                <div className="entry-img">
                  <LazyLoad height="100%" offset={120}>
                    <img
                      data-src="https://d68my205fyswa.cloudfront.net/ccf-static-wf25ney28guiy4n2lyg4sjv0raqzy0sf0oq3bvcbt8f3gryjkle881.png"
                      src="https://d68my205fyswa.cloudfront.net/ccf-static-wf25ney28guiy4n2lyg4sjv0raqzy0sf0oq3bvcbt8f3gryjkle881.png"
                      alt="Carcoversfactory.com"
                      className="custom-lazy loaded"
                    />
                  </LazyLoad>
                </div>
                <div className="entry-content">
                  <div className="content">{translate("review2")}</div>
                  <div className="rating">
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star checked me-1"></span>
                    <span className="fa fa-star checked me-1"></span>
                  </div>
                  <h4 className="entry-name">- Marie L.</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewWrapper;
