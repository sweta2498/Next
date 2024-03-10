import Link from "next/link";
import React from "react";

const CoverCategoryList = ({ categoryData = [] }) => {
  return (
    <>
      <div className="box sideBar" style={{ marginTop: "10px" }}>
        <div className="wrap sideMenu left-nav">
          <h2>cover categories</h2>
          <ul className="lp-list">
            {Array?.isArray(categoryData) &&
              Boolean(categoryData?.length) &&
              categoryData?.map((item) => (
                <li key={item?._id + "sm"}>
                  <Link
                    href={
                      item?.slug === "disposable-covers"
                        ? "disposable-covers"
                        : "/" + item?.slug
                    }
                    title={item?.details?.name}
                  >
                    <span className="arp color1">{item?.details?.name}</span>
                    {/* <span itemprop="name"></span></a> */}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>{" "}
    </>
  );
};

export default CoverCategoryList;
