import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

const AccountPage = () => {
  const { t: translate } = useTranslation("account");
  return (
    <>
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
              </ol>
            </nav>
            <div id="content">
              <h1>{translate("my_account")}</h1>
              <h2>{translate("my_account")}</h2>
              <div className="content">
                <ul>
                  <li>
                    <Link href="https://www.carcoversfactory.com/account-edit">
                      {translate("edit_info")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/account-password">
                      {translate("change_pwd")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/account-address">
                      {translate("modify_email_address")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/wishlist">
                      {translate("modify_wistlist")}
                    </Link>
                  </li>
                </ul>
              </div>
              <h2>{translate("my_orders")}</h2>
              <div className="content">
                <ul>
                  <li>
                    <Link href="https://www.carcoversfactory.com/order">
                      {translate("view_history")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/account-download">
                      {translate("download")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/account-reward">
                      {translate("reward_point")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/account-return">
                      {translate("reward_point")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/account-transaction">
                      {translate("view_return_request")}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.carcoversfactory.com/index.php?route=account/recurring">
                      {translate("transction")}
                    </Link>
                  </li>
                </ul>
              </div>
              <h2>{translate("newsletter")}</h2>
              <div className="content">
                <ul>
                  <li>
                    <Link href="https://www.carcoversfactory.com/newsletter">
                      {translate("subscribe")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountPage;
