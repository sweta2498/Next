import Link from "next/link";
import React, { Fragment } from "react";
import LazyLoad from "react-lazy-load";
import { useSelector } from "react-redux";

const Brand = ({ categoryData = [] }) => {
  const storeData = useSelector((state) => state?.common?.store);
  // console.log( storeData?.image_path);
  // console.log(categoryData);
  return (
    <>
      <section className="grid-wrapper " id="brands0">
        <div className="container">
          <div className="row">
            {Boolean(categoryData?.length == 0)
              ? [...Array(8)]?.map((iten, i) => (
                  <div className="col-lg-3 col-sm-4 col-6" key={i + "brand"}>
                    <div className="entry-single placeholder-glow">
                      <img
                        data-src={""}
                        style={{ height: "200px" }}
                        src={""}
                        className="img-fluid custom-lazy loaded placeholder"
                        alt={""}
                        title={"Buy "}
                      />
                      <div className="d-flex flex-grow-1 justify-content-center align-items-center mt-2 mb-1 pb-2">
                        <span className="placeholder placeholder-lg w-75"></span>
                      </div>
                    </div>
                  </div>
                ))
              : Array?.isArray(categoryData) &&
                Boolean(categoryData?.length) &&
                categoryData?.map((dt, i) => {
                  return (
                    <Fragment key={i + "c"}>
                      {Boolean(dt?.details?.cover_image) && (
                        <div className="col-lg-3 col-sm-4 col-6">
                          <Link href={"/" + dt?.slug}>
                            <div className="entry-single">
                              <LazyLoad height="100%" offset={120}>
                                <img
                                  data-src={
                                    storeData?.image_path +
                                    "fit-in/315x236/" +
                                    dt?.details?.cover_image
                                  }
                                  src={
                                    storeData?.image_path +
                                    "fit-in/315x236/" +
                                    dt?.details?.cover_image
                                  }
                                  className="img-fluid custom-lazy loaded"
                                  alt={dt?.details?.name}
                                  title={"Buy " + dt?.details?.name}
                                />
                              </LazyLoad>
                            </div>
                          </Link>
                        </div>
                      )}
                    </Fragment>
                  );
                })}

            {}
          </div>
        </div>
      </section>

      {/* <section className="grid-wrapper" id="brands0">
        <div className="container">
          <div className="row">
            {Array?.isArray(categoryData) &&
              Boolean(categoryData?.length) &&
              categoryData?.map((dt, i) => {
                return (
                  <Fragment key={i + "c"}>
                    {Boolean(dt?.details?.cover_image) && (
                      <div className="col-lg-3 col-sm-4 col-6">
                        <Link href={"/" + dt?.slug}>
                          <div className="entry-single">
                            <img
                              data-src={
                                storeData?.image_path +
                                "fit-in/315x236/" +
                                dt?.details?.cover_image
                              }
                              src={
                                storeData?.image_path +
                                "fit-in/315x236/" +
                                dt?.details?.cover_image
                              }
                              className="img-fluid custom-lazy loaded"
                              alt={dt?.details?.name}
                              title={"Buy " + dt?.details?.name}
                            />
                          </div>
                        </Link>
                      </div>
                    )}
                  </Fragment>
                );
              })}
          </div>
        </div>
      </section> */}
    </>
  );
};
export default Brand;
