import React from "react";
import LazyLoad from "react-lazy-load";
import { useSelector } from "react-redux";

const Lower = () => {
  const language = useSelector((state) => state?.common?.store?.language?.name);

  return (
    <>
      <section className="lower-banner text-center abc">
        <div className="container">
          <div className="row">
            <div className="col">
              <LazyLoad height="100%" offset={120}>
                <img
                  data-src={`/Images/${language}/lower1.jpg`}
                  src={`/Images/${language}/lower1.jpg`}
                  className="img-fluid custom-lazy loaded"
                  alt="Shipping CarCoversFactory"
                />
              </LazyLoad>
            </div>
            <div className="col">
              <LazyLoad height="100%" offset={120}>
                <img
                  data-src={`/Images/${language}/lower2.jpg`}
                  src={`/Images/${language}/lower2.jpg`}
                  className="img-fluid custom-lazy loaded"
                  alt="Money Back CarCoversFactory"
                />
              </LazyLoad>
            </div>
            <div className="col">
              <LazyLoad height="100%" offset={120}>
                <img
                  data-src={`/Images/${language}/lower3.jpg`}
                  src={`/Images/${language}/lower3.jpg`}
                  className="img-fluid custom-lazy loaded"
                  alt="Cover Fit CarCoversFactory"
                />
              </LazyLoad>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Lower;
