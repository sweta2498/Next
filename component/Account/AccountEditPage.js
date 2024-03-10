import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useState } from "react";

const AccountEditPage = () => {
  const [state, setState] = useState({});

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
                  <Link href="/">home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/account">accoun</Link>
                </li>
              </ol>
            </nav>
            <div id="content">
              <h1>My Account Information</h1>
              <form>
                <h2>Your Personal Details</h2>
                <div className="content">
                  <table className="form">
                    <tbody>
                      <tr>
                        <td>
                          <span className="required">*</span> First Name:
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
                          <span className="required">*</span> Last Name:
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
                          <span className="required">*</span> E-Mail:
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
                          <span className="required">*</span> Telephone:
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
                        <td>Fax:</td>
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
                <div className="buttons">
                  <div className="left">
                    <Link
                      href="https://www.carcoversfactory.com/account"
                      className="button"
                    >
                      Back
                    </Link>
                  </div>
                  <div className="right">
                    <input
                      type="button"
                      value="Continue"
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

export default AccountEditPage;
