import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LazyLoad from "react-lazy-load";

const Banner = ({ data = [] }) => {
  const router = useRouter();
  const bannerdata = Array?.isArray(data)
    ? data?.filter((dt) => dt?.slug === router?.query?.category)
    : [];
  const storeData = useSelector((state) => state?.common?.store);

  return (
    <>
      <section className="banner-wrap">
        <div className="container">
          <LazyLoad height="100%" offset={120}>
            <img
              className="img-fluid w-100 d-none d-md-block"
              id="page-cat-banner"
              src={
                storeData?.image_path +
                "fit-in/1270x287/" +
                (Boolean(bannerdata?.length)
                  ? bannerdata[0]?.details?.banner
                  : Boolean(data?.length)
                  ? data[0]?.details?.banner
                  : null)
              }
              alt={bannerdata[0]?.details?.name || "Car Covers"}
              title={bannerdata[0]?.details?.name || "Car Covers"}
            />
          </LazyLoad>
          <LazyLoad height="100%" offset={120}>
            <img
              className="img-fluid w-100 d-md-none"
              id="page-cat-banner"
              src={
                storeData?.image_path +
                "fit-in/767x173/" +
                (Boolean(bannerdata?.length)
                  ? bannerdata[0]?.details?.banner
                  : Boolean(data?.length)
                  ? data[0]?.details?.banner
                  : null)
              }
              alt={bannerdata[0]?.details?.name || "Car Covers"}
              title={bannerdata[0]?.details?.name || "Car Covers"}
            />
          </LazyLoad>
        </div>
      </section>
    </>
  );
};

export default Banner;
