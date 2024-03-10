import React, { useState } from "react";
import CoverCategoryList from "./CoverCategoryList";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const RegisterPage = ({ categoryData }) => {
  const [state, setState] = useState({});

  const { t: translate } = useTranslation("register");

  async function handleChange(e) {
    const { name, value, type, checked } = e?.target;
    if (["checkbox", "radio"].includes(type)) {
      setState({
        ...state,
        [name]: checked,
      });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  }

  const handleSubmit = () => {
    console.log(state);
  };

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
                  <Link href="/register">{translate("register")}</Link>
                </li>
              </ol>
            </nav>
            <div>
              <CoverCategoryList categoryData={categoryData} />
            </div>

            <div id="banner0" className="banner"></div>
            <h1>{translate("register_account")}</h1>
            <div className="holder">
              <p>
                {translate("register_header")}{" "}
                <Link href="/login">{translate("login_page")}</Link>.
              </p>
              <form
              // action="https://www.carcoversfactory.com/register"
              // method="post"
              // encType="multipart/form-data"
              >
                <h2>{translate("your_personal_details")}</h2>
                <div className="content">
                  <table className="form">
                    <tbody>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("firstname")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="firstname"
                            value={state?.firstname || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("lastname")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="lastname"
                            value={state?.lastname || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("email")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="email"
                            value={state?.email || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("telephone")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="telephone"
                            value={state?.telephone || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>{translate("fax")}:</td>
                        <td>
                          <input
                            type="text"
                            name="fax"
                            value={state?.fax || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h2>{translate("your_address")}</h2>
                <div className="content">
                  <table className="form">
                    <tbody>
                      <tr>
                        <td>{translate("company")}:</td>
                        <td>
                          <input
                            type="text"
                            name="company"
                            value={state?.company || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>

                      <tr id="company-id-display">
                        <td>
                          <span id="company-id-required" className="required">
                            *
                          </span>{" "}
                          {translate("company_id")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="company_id"
                            value={state?.company_id || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr id="tax-id-display">
                        <td>
                          <span id="tax-id-required" className="required">
                            *
                          </span>{" "}
                          {translate("tax_id")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="tax_id"
                            value={state?.tax_id || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("address")} 1:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="address_1"
                            value={state?.address_1 || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>{translate("address")} 2:</td>
                        <td>
                          <input
                            type="text"
                            name="address_2"
                            value={state?.address_2 || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("city")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="city"
                            value={state?.city || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span id="postcode-required" className="required">
                            *
                          </span>{" "}
                          {translate("postcode")}:
                        </td>
                        <td>
                          <input
                            type="text"
                            name="postcode"
                            value={state?.postcode || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("country")}:
                        </td>
                        <td>
                          <select
                            name="country_id"
                            value={state?.country_id || ""}
                            onChange={handleChange}
                          >
                            <option value="">Country</option>
                            <option value="193">South Africa</option>
                            <option value="195">Spain</option>
                            <option value="202">Swaziland</option>
                            <option value="204">Switzerland</option>
                            <option value="209">Thailand</option>
                            <option value="222">United Kingdom</option>
                            <option value="223">United States</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("state")}:
                        </td>
                        <td>
                          <select
                            name="zone_id"
                            value={state?.zone_id || ""}
                            onChange={handleChange}
                          >
                            {/* <option value=""></option> */}
                            <option value="3613">Alabama</option>
                            <option value="3614">Alaska</option>
                            <option value="3615">American Samoa</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h2>{translate("your_pwd")}</h2>
                <div className="content">
                  <table className="form">
                    <tbody>
                      <tr>
                        <td>
                          <span className="required">*</span> {translate("pwd")}
                          :
                        </td>
                        <td>
                          <input
                            type="password"
                            name="password"
                            value={state?.password || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span>{" "}
                          {translate("pwd_confirm")}:
                        </td>
                        <td>
                          <input
                            type="password"
                            name="confirm"
                            value={state?.confirm || ""}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h2>{translate("newsletter")}</h2>
                <div className="content">
                  <table className="form">
                    <tbody>
                      <tr>
                        <td>{translate("subscribe")}:</td>
                        <td>
                          {" "}
                          <input
                            type="radio"
                            name="newsletter"
                            value={state?.newsletter || ""}
                            onChange={handleChange}
                          />
                          {translate("yes")}{" "}
                          <input
                            type="radio"
                            name="newsletter"
                            value={state?.newsletter || ""}
                            onChange={handleChange}
                            // value="0"
                            // checked="checked"
                          />
                          {translate("no")}{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="buttons">
                  <div className="right">
                    <input
                      type="button"
                      value={translate("continue")}
                      className="button"
                      onClick={handleSubmit}
                    />
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

export default RegisterPage;
