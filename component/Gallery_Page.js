import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import Lightbox from "react-spring-lightbox";
import axiosApi from "../axios_instance";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../redux/action/toastAction";
import { createMarkup } from "../common_function/functions";

const Gallery_Page = () => {
  const storeData = useSelector((state) => state?.common?.store);
  const dispatch = useDispatch();
  const [open, setopen] = useState(false);
  const { t: translate } = useTranslation("gallery");
  const [currentImageIndex, setCurrentIndex] = useState(0);
  const [totals, setTotals] = useState(1);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(50);
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [flag, setFlag] = useState(false)
  const regex = /(- Indoor Premium Satin Edition)|(- Premium Edition)|(- Indoor Standard Edition)|(- Standard Edition)|(- Basic Edition)|(- All body types)/g;

  useEffect(() => {
    setLoader(true);
    galleryData(page);
  }, []);

  const galleryData = (page) => {
    setLoader(true);
    axiosApi
      .get(`gallery_get_all?page=${page}&items=${items}`)
      .then((res) => {
        setImages(
          res?.data?.result?.map((x) => {
            return {
              src: storeData?.image_path + "fit-in/1000x1000/" + x?.image,
              alt: x?.product_title,
              caption: x?.product_title?.includes(' for ') ? x?.product_title?.slice(x?.product_title?.indexOf('for') + 4) : x?.product_title,
              comment: x?.comment,
            };
          })
        );
        setTotals(res?.data?.pagination?.pages);
        setLoader(false);
        setFlag(true);
      })
      .catch((err) => {
        setFlag(true);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      let elm = document.getElementsByClassName("gallery-image");
      let parents = document.getElementsByClassName("selectdiv");
      for (let i = 0; i < elm.length; i++) {
        elm[i].style.height = parents[0].offsetWidth - 50 + "px";
      }
    }
  }, [images]);

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      let elm = document.getElementsByClassName("gallery-image");
      let parents = document.getElementsByClassName("selectdiv");
      for (let i = 0; i < elm.length; i++) {
        elm[i].style.height = parents[0].offsetWidth - 50 + "px";
      }
    });
  }

  const gotoPrevious = () => {
    setCurrentIndex(currentImageIndex - 1);
    if (currentImageIndex == 0) {
      setCurrentIndex(images.length - 1);
    }
  };

  const gotoNext = () => {
    setCurrentIndex(currentImageIndex + 1);
    if (images?.length - 1 == currentImageIndex) {
      setCurrentIndex(0);
    }
  };

  const CustomHeader = () => {
    return (
      <>
        <div className="position-relative text-center text-white galleryImageHeader">
          <h5 className="pt-1 galleryImageTitle" dangerouslySetInnerHTML={createMarkup(`${images[currentImageIndex]?.comment ? images[currentImageIndex]?.comment + "<br />" : ""}${images[currentImageIndex]?.caption} - ${currentImageIndex + 1} / ${images?.length}`)}></h5>
          <button className="galleryClosebtn" onClick={() => setopen(false)}>
            ×
          </button>
        </div>
      </>
    );
  };
  const Nextbtn = () => {
    return (
      <button className="lb-next" onClick={() => gotoNext()}>
        ❯
      </button>
    );
  };
  const Prevbtn = () => {
    return (
      <button
        className="lb-prev"
        onClick={() => gotoPrevious()}
        style={{ zIndex: "999" }}
      >
        ❮
      </button>
    );
  };
  const handlesubmit = (i) => {
    setopen(true);
    setCurrentIndex(i);
  };

  const handlePageClick = (event) => {
    setPage(event?.selected + 1);
    galleryData(event?.selected + 1);
    document?.getElementById("nav-description")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {Boolean(loader) && (
        <div id={"cartError"}>
          <span className="loader-div">
            <i className="fa fa-cog fa-spin"></i>
          </span>
        </div>
      )}
      <section id="content" className="page-content single-wrapper ff">
        <div className="container">
          <div className="inner-wrap pb-5 pt-4" style={{ minHeight: "400px" }}>
            <h2 style={{ fontSize: "20px", lineHeight: "1.2" }}>
              {translate("gallery_description")}
            </h2>

            <div className="tab-content">
              <div
                className="tab-pane active mt-3"
                id="nav-description"
                role="tabpanel"
                aria-labelledby="nav-description-tab"
              >
                <div className="row justify-content-center container m-0 gallery_images_view">
                  {Boolean(images?.length) && images?.map((item, i) => {
                    return <button
                      className="col-6 col-md-4 mt-auto mb-auto text-center p-1 heightimg selectdiv"
                      key={i + "photo"}
                      style={{
                        maxWidth: "380px",
                        marginBottom: "0px",
                        border: "none",
                        background: "transparent",
                      }}
                      onClick={() => handlesubmit(i)}
                    >
                      <div
                        style={{
                          backgroundImage: `url(${item?.src})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center center",
                          border: "1px solid rgb(231, 231, 231)",
                          borderRadius: "6px",
                        }}
                        className="gallery-image heightimg"
                      >
                        {
                          Boolean(item?.caption) ?
                            <h2 className="vehicle-name">{
                              item?.caption?.replace(regex, '')
                            }</h2> : <></>
                        }
                        <img
                          src={item?.src}
                          style={{ display: "none" }}
                          alt={item?.alt}
                          title={item?.caption}
                        />
                      </div>
                    </button>
                  })}
                  {
                    (!Boolean(loader) && !Boolean(images?.length) && Boolean(flag)) && (<h2 className="text-center pt-5 mt-5">Data Not Found</h2>)
                  }
                </div>
              </div>

              <Lightbox
                isOpen={open}
                onNext={gotoNext}
                onPrev={gotoPrevious}
                renderHeader={() => <CustomHeader />}
                renderNextButton={() => <Nextbtn />}
                renderPrevButton={() => <Prevbtn />}
                style={{ background: "#020202de" }}
                images={images}
                currentIndex={currentImageIndex}
              />

              <div className="category_pagination text-center">
                {totals != 1 && (
                  <ReactPaginate
                    breakLabel="----"
                    nextLabel={<i className="fa fa-angle-right"></i>}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={Number(totals)}
                    marginPagesDisplayed={2}
                    previousLabel={<i className="fa fa-angle-left"></i>}
                    className="productReviewPagination pt-3"
                    renderOnZeroPageCount={null}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery_Page;
