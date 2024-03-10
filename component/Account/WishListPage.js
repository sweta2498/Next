import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

const WishListPage = () => {
  const { t: translate } = useTranslation("wishlist");
  return (
    <section className="page-content single-wrapper">
      <div className="container">
        <div className="inner-wrap">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">{translate("home")}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/account">{translate("account")}</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/wishlist">Wish List</Link>
              </li>
            </ol>
          </nav>
          <div id="content">
            <h1>My Wish List</h1>
            <div className="content">Your wish list is empty.</div>
            <div className="buttons">
              <div className="right">
                <Link href="/account" className="button">
                  Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishListPage;
