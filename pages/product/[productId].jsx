import React from "react";
import { useRouter } from "next/router";
import Header from "../../component/Header/index";
import Footer from "../../component/Footer/Footer";

const Product = () => {
  const router = useRouter();
  const productId = router.query.productId;
  return (
    <>
      <Header categoryData={categoryData} />
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap p-info">
            <nav aria-label="breadcrumb">
              <ol>
                <ul></ul>
                <ul></ul>
                <ul></ul>
                <ul></ul>
              </ol>
            </nav>
            <div id="notification"></div>
            <h1 className="product-title">
              Hummer Cover for 2020 Hummer H2 - Premium Edition
            </h1>
            <div className="product-content">
              <div className="row">
                <div className="col-sm entry-thumb">
                  <div></div>
                  <ul className=""></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Product;
