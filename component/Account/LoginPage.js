import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import CoverCategoryList from "./CoverCategoryList";

const LoginPage = ({ categoryData }) => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const { t: translate } = useTranslation("login");
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
                  <Link href="/login">{translate("login")}</Link>
                </li>
              </ol>
            </nav>
            <div>
              <CoverCategoryList categoryData={categoryData} />
              {/* <div className="box sideBar" style={{ marginTop: "10px" }}>
                <div className="wrap sideMenu left-nav">
                  <h2>cover categories</h2>
                  <ul className="lp-list">
                    {categoryData?.map((item) => (
                      <li key={item?._id + "sm"}>
                        <Link
                          href={
                            item?.slug === "disposable-covers"
                              ? "disposable-covers"
                              : "/" + item?.slug
                          }
                          title={item?.details?.name}
                        >
                          <span className="arp color1">
                            {item?.details?.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>{" "} */}
            </div>

            <div id="banner0" className="banner"></div>
            <h1>{translate("account_login")}</h1>
            <div className="holder">
              <div className="login-content">
                <div className="left">
                  <h2>{translate("new_customer")}</h2>
                  <div className="content">
                    <p>
                      <b>{translate("register_account")}</b>
                    </p>
                    <p>{translate("login_header")}</p>
                    <Link href="/register" className="button">
                      {translate("continue")}
                    </Link>
                  </div>
                </div>
                <div className="right">
                  <h2>{translate("returning_customer")}</h2>
                  <form
                    action="/login"
                    method="post"
                    encType="multipart/form-data"
                  >
                    <div className="row col-sm-6">
                      <div className="form-group col-12">
                        {translate("iamareturning_customer")}
                      </div>
                      <div className="form-group col-12">
                        <label>{translate("email")}:</label>
                        <input
                          type="text"
                          name="email"
                          value={email || ""}
                          onChange={(e) => setEmail(e?.target?.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group col-12">
                        <label>{translate("pwd")}:</label>
                        <input
                          type="password"
                          name="password"
                          value={pwd || ""}
                          onChange={(e) => setPwd(e?.target?.value)}
                          className="form-control"
                        />
                      </div>
                      <Link className="mt-3" href="/forgotten">
                        {translate("forgotten_password")}
                      </Link>
                      <br />
                      <br />
                      <input
                        type="submit"
                        value={translate("login")}
                        className="btn btn-primary mt-3"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
