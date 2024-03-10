import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LazyLoad from "react-lazy-load";
import { useSelector } from "react-redux";

const PageContentTiles = ({ tilesData, tilesTitle }) => {

  const storeData = useSelector((state) => state?.common?.store);
  const router = useRouter();
  const [loader, setLoader] = useState(false);

  return (
    <>
      {Boolean(loader) && (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      )}
      <section
        className="page-content single-wrapper mb-30"
        style={{ marginTop: "50px" }}
      >
        <div className="container">
          <div className="inner-wrap">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <h2 className="vehicle_heading1 text-center">{tilesTitle}</h2>
                </div>
              </div>
              <br />
              <div className="row">
                {tilesData?.map((item, i) => (
                  <div
                    className="col-sm-4 text-center mb-30"
                    key={i + "pagecontentimgges"}
                  >
                    <Link
                      href={"/" + router?.query?.category + "/" + item?.sluge}
                      onClick={(e) =>
                        !Boolean(e?.nativeEvent?.ctrlKey)
                          ? setLoader(true)
                          : ""
                      }
                    >
                      <LazyLoad height="100%" offset={120}>
                        <img
                          data-src={storeData?.image_path + item?.image}
                          style={{ width: "100%" }}
                          src={storeData?.image_path + item?.image}
                          className="custom-lazy loaded"
                        />
                      </LazyLoad>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageContentTiles;
