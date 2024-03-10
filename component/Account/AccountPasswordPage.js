import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

const AccountPasswordPage = () => {
  const { t: translate } = useTranslation("changepwd");
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
                <li className="breadcrumb-item">
                  <Link href="/account-password">Change Password</Link>
                </li>
              </ol>
            </nav>
            <div id="content">
              <h1>Change Password</h1>
              <form
                action="https://www.carcoversfactory.com/account-password"
                method="post"
                enctype="multipart/form-data"
              >
                <h2>Your Password</h2>
                <div className="content">
                  <table className="form">
                    <tbody>
                      <tr>
                        <td>
                          <span className="required">*</span> Password:
                        </td>
                        <td>
                          <input type="password" name="password" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span> Password Confirm:
                        </td>
                        <td>
                          <input type="password" name="confirm" value="" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="buttons">
                  <div className="left">
                    <Link href="/account" className="button">
                      Back
                    </Link>
                  </div>
                  <div className="right">
                    <input type="submit" value="Continue" className="button" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountPasswordPage;
