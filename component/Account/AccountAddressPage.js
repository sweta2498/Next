import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

const AccountAddressPage = () => {
  const { t: translate } = useTranslation("accountaddress");
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
                <Link href="/login">{translate("addressbook")}</Link>
              </li>
            </ol>
          </nav>
          <div id="content">
            <div id="banner0" className="banner"></div>

            <h1>{translate("addressbook")}</h1>
            <h2>{translate("addressbook_entry")}</h2>
            <div className="content">
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>
                      abc abc
                      <br />
                      9089,Amrica
                      <br />
                      Landon
                      <br />
                      Swizerland 1452
                      <br />
                      Delhi
                      <br />
                      India
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href="https://www.carcoversfactory.com/index.php?route=account/address/update&amp;address_id=54"
                        className="button"
                      >
                        {translate("edit")}
                      </Link>
                      &nbsp;{" "}
                      <Link
                        href="https://www.carcoversfactory.com/index.php?route=account/address/delete&amp;address_id=54"
                        className="button"
                      >
                        {translate("delete")}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <div className="left">
                <Link
                  href="https://www.carcoversfactory.com/account"
                  className="button"
                >
                  {translate("back")}
                </Link>
              </div>
              <div className="right">
                <Link
                  href="https://www.carcoversfactory.com/index.php?route=account/address/insert"
                  className="button"
                >
                  {translate("new_address")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountAddressPage;
