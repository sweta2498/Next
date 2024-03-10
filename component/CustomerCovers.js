import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import axiosApi from "../axios_instance";
import { setToast } from "../redux/action/toastAction";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <div className="customarrow">
    <button
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
      style={{ zIndex: "500" }}
    >
      Previous
    </button>
  </div>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <div className="customarrow">
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      Next
    </button>
  </div>
);

const CustomerCovers = () => {
  const storeData = useSelector((state) => state?.common?.store);
  const dispatch = useDispatch();
  const { t: translate } = useTranslation("searchpage");
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    galleryData();
  }, []);

  const galleryData = () => {
    setLoader(true);
    axiosApi
      .get(`gallery_get_all?page=${1}&items=${15}`)
      .then((res) => {
        setLoader(false);
        setImages(res?.data?.result);
      })
      .catch((err) => {
        setLoader(false);
        if (err?.response?.data?.message) {
          let errors = err?.response?.data?.message;
          if (typeof errors == "string") {
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: errors,
              })
            );
          }
        } else {
          dispatch(
            setToast({
              open: true,
              type: "danger",
              message: translate("There has been an error."),
            })
          );
        }
      });
  };

  let settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    variableWidth: true,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {Boolean(images?.length != 0) && (
        <div className="container product-customer-images max-auto mt-4 p-0 ">
          <div className="row m-0">
            <div className="line-title">
              <h2 className="title theme-color both-side-line">
                Our Customer's Vehicle Covers
              </h2>
            </div>
          </div>
          {!Boolean(loader) && Boolean(images?.length) ? (
            <div
              className="text-center ctmp p-2"
              style={{
                border: "2px solid #EBEBEB",
                borderRadius: "10px",
                maxHeight: "300px !imaportant",
              }}
            >
              <Slider {...settings}>
                {images?.map((item, index) => (
                  <React.Fragment key={index}>
                    <div
                      className="galleryImages"
                      style={{
                        backgroundImage: `url(${
                          storeData?.image_path +
                          "fit-in/1000x1000/" +
                          item?.image
                        })`,
                      }}
                    ></div>
                  </React.Fragment>
                ))}
              </Slider>
            </div>
          ) : (
            <div
              className="text-center ctmp p-2"
              style={{
                border: "2px solid #EBEBEB",
                borderRadius: "10px",
                maxHeight: "300px !important",
              }}
            >
              <section className="grid-wrapper" id="brands0">
                <div className="container">
                  <div
                    className="d-flex align-items-center"
                    style={{ overflow: "hidden" }}
                  >
                    {[...Array(5)]?.map((iten, index) => (
                      <div className="entry-single m-1" key={index}>
                        <div
                          style={{
                            height: "245px",
                            width: "245px",
                            backgroundColor: "#808080b5",
                          }}
                          className="img-fluid custom-lazy loaded placeholder"
                          alt={""}
                          title={"Buy "}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="w-100 text-center mt-2 mb-3">
            <Link
              href="/gallery"
              className="btn btn-lg btn-warning text-light"
              style={{ borderRadius: "15px" }}
            >
              View Entire Gallery
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerCovers;
