import React, { useState } from "react";
import CoverCategoryList from "./CoverCategoryList";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const ForgottenPage = ({ categoryData }) => {
  const { t: translate } = useTranslation("forgotten");
  const [email, setEmail] = useState("");
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
                  <Link href="/login">{translate("forgotten_password")}</Link>
                </li>
              </ol>
            </nav>
            <div>
              <CoverCategoryList categoryData={categoryData} />
            </div>
            <div id="content">
              <div id="banner0" className="banner"></div>
              <h1>{translate("forgot_Your_password")}</h1>
              <div className="holder">
                <form action="" method="post" encType="multipart/form-data">
                  <p>{translate("forgot_msg")}</p>
                  <h2>{translate("your_email_address")}</h2>
                  <div className="content">
                    <table className="form">
                      <tbody>
                        <tr>
                          <td>{translate("email")}:</td>
                          <td>
                            <input
                              type="text"
                              name="email"
                              value={email || ""}
                              onChange={(e) => setEmail(e?.target?.value)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="buttons">
                    <div className="left">
                      <Link href="/login" className="button">
                        {translate("back")}
                      </Link>
                    </div>
                    apde thodi break lai ne javsu bahar thi
                    <div className="right">
                      <input
                        type="submit"
                        value={translate("continue")}
                        className="button"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgottenPage;
