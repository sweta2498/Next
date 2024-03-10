import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { tawkToToggle } from "../../common_function/functions";

const Category = ({ categoryData = [] }) => {
  const { t: translate } = useTranslation("category");
  const storeData = useSelector((state) => state?.common?.store);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const category_slug = router?.query?.category;

  const collapseclose = () => {
    document?.getElementById("btnclose").click();
  };

  useEffect(() => {
    setLoader(false);
  }, [category_slug]);

  useEffect(() => {
    setLoader(false);
  }, [categoryData]);

  const styles1 = {
    width : '7.6923076923077%'
  }
  const styles2 = {
    width : '9.0909090909091%',
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
  }
  const styleforline = {
    lineHeight : 1,
    overflow : 'hidden',
    paddingBottom : '5px',
    paddingTop : '5px'
  }

  return (
    <>
      {Boolean(loader) && (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      )}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler p-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          <span className="fa fa-bars fa-lg text-dark"></span>
        </button>
        <div className="collapse navbar-collapse">
          <ul
            className="navbar-nav mr-auto"
            style={{ width: "100%", background: "#fff" }}
          >
            {Array?.isArray(categoryData) &&
              Boolean(categoryData?.length) &&
              categoryData?.map((cd) => (
                <li
                  className="nav-item active"
                  style={categoryData.length > 12 ? styles1 : styles2}
                  key={cd?._id + "cd"}
                >
                  <Link
                    onClick={(e) =>
                      !Boolean(e?.nativeEvent?.ctrlKey)
                        ? setLoader(true)
                        : ""
                    }
                    className="nav-link"
                    href={"/" + cd?.slug}
                    // style={{margin : 'auto'}}
                  >
                    <img
                      src={storeData?.image_path + cd?.image}
                      alt={cd?.details?.short_name}
                      title={cd?.details?.short_name}
                    />
                    <div style={categoryData.length >= 12 ? null : styleforline }>{cd?.details?.short_name}</div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>
      <div className="ctm" id="main">
        <div
          className="offcanvas offcanvas-start border border-0"
          tabIndex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
          data-bs-scroll="true"
        >
          <div className="offcanvas-body">
            <nav id="sidebar" className="active">
              <div className="sidebar-header" onClick={collapseclose}>
                <h3>
                  <Link href="/">
                    <img
                      src={storeData?.image_path + storeData?.store_logo}
                      title={storeData?.store_name}
                      alt={storeData?.store_name}
                    />
                  </Link>
                  <button
                    type="button"
                    className="shadow navbarCloseBtn"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    id={"btnclose"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 17.619 17.619"
                    >
                      <g id="S0uz0h" transform="translate(-2043.222 -313.928)">
                        <g id="Group_934" data-name="Group 934">
                          <path
                            id="Path_702"
                            data-name="Path 702"
                            d="M2059.774,313.928h.344a1.034,1.034,0,0,1,.723.723v.378a1.726,1.726,0,0,1-.472.661q-3.45,3.444-6.9,6.892a1.017,1.017,0,0,1-.17.116v.079a1.059,1.059,0,0,1,.17.116q3.454,3.451,6.909,6.9a1.691,1.691,0,0,1,.46.648v.379a1.042,1.042,0,0,1-.723.722h-.344a1.528,1.528,0,0,1-.646-.432q-3.467-3.475-6.939-6.945a.935.935,0,0,1-.108-.175l-.083.013a1.208,1.208,0,0,1-.12.168q-3.463,3.467-6.927,6.932a1.477,1.477,0,0,1-.662.439h-.344a1.046,1.046,0,0,1-.723-.757v-.31a1.661,1.661,0,0,1,.479-.694q3.445-3.438,6.886-6.881a1.834,1.834,0,0,1,.227-.156c-.111-.088-.174-.128-.226-.179q-3.444-3.441-6.886-6.881a1.658,1.658,0,0,1-.48-.694v-.31a1.046,1.046,0,0,1,.723-.757h.378a1.824,1.824,0,0,1,.684.495q3.438,3.445,6.882,6.885c.047.047.1.092.167.16.059-.072.1-.134.154-.186q3.459-3.462,6.917-6.922A1.5,1.5,0,0,1,2059.774,313.928Z"
                            fill="#FF3F12"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </button>
                </h3>
              </div>

              <ul className="list-unstyled components">
                <li onClick={collapseclose}>
                  <Link href="/">
                    <span className="fa fa-home fa-menu-icon"></span>
                    <span>{translate("home")}</span>
                  </Link>
                </li>
                <li className="active">
                  <Link
                    href="#homeSubmenu"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    className="dropdown-toggle"
                  >
                    <i className="fa fa-sort-alpha-asc fa-menu-icon"></i>
                    {translate("vehicles")}
                  </Link>
                  <ul
                    className="list-unstyled collapse show"
                    id="homeSubmenu"
                    onClick={collapseclose}
                  >
                    {Array?.isArray(categoryData) &&
                      Boolean(categoryData?.length) &&
                      categoryData?.map((item) => (
                        <li key={item?._id + "category"}>
                          <Link href={"/" + item?.slug} className="row d-flex align-items-center">
                            <div className="d-inline-block col-4">
                              <img
                                src={storeData?.image_path + item?.image}
                                alt={item?.details?.short_name}
                                title={item?.details?.short_name}
                              />
                            </div>
                            <div className="d-inline-block menu-cat-name col-8">
                              {item?.details?.short_name}
                            </div>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
                <li onClick={collapseclose}>
                  <Link href="/about-us">
                    <span className="fa fa-plug fa-menu-icon"></span>
                    <span>{translate("about_us")}</span>
                  </Link>
                </li>
                {
                  storeData?.language?.code == "en" && (
                    <li onClick={collapseclose}>
                      <Link href="/gallery">
                        <span className="fa fa-image fa-menu-icon"></span>
                        <span>{translate("gallery")}</span>
                      </Link>
                    </li>
                  )
                }
                <li onClick={collapseclose}>
                  <Link href="/contact">
                    <span className="fa fa-envelope fa-menu-icon"></span>
                    <span>{translate("contact_us")}</span>
                  </Link>
                </li>
                <li onClick={collapseclose}>
                  <Link href="/terms-and-conditions">
                    <span className="fa fa-file-text-o fa-menu-icon"></span>
                    <span>{translate("terms_condition")}</span>
                  </Link>
                </li>
                {
                  storeData?.language?.code == "en" && (
                    <li
                      onClick={collapseclose}
                      className="chat-wrap chat-top c-pointer"
                    >
                      <a onClick={tawkToToggle}>
                        <span className="fa fa-wechat fa-menu-icon"></span>
                        <span>{translate("live_chat")}</span>
                      </a>
                    </li>
                  )
                }
                <li id="cart" onClick={collapseclose}>
                  <Link href={`/cart?cart_id=${categoryData?.cart_id !== undefined ? categoryData?.cart_id : ""}`}>
                    <span className="fa fa-shopping-cart fa-menu-icon"></span>
                    <span>{translate("cart")}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
