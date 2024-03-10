import React, { useState } from "react";
import Category from "../category/Category";
import HeaderTop from "./HeaderTop";
import SeconddaryWrap from "./SeconddaryWrap";

const index = ({ categoryData = [] }) => {
  // const [category_Data,setCategory_Data]=useState(categoryData?.result)

  return (
    <>
      <div className="header-wrapper">
        <HeaderTop />
        <div className="container">
          <SeconddaryWrap categoryData={categoryData} />
          <Category categoryData={categoryData?.result} />
        </div>
      </div>
    </>
  );
};

export default index;
