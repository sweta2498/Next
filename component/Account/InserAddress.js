import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

const InserAddress = () => {
  const { t: translate } = useTranslation("insertaddress");
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
              <div id="banner0" className="banner"></div>

              <h1>Address Book</h1>
              <form
              // action="https://www.carcoversfactory.com/index.php?route=account/address/insert"
              // method="post"
              // enctype="multipart/form-data"
              >
                <h2>Edit Address</h2>
                <div className="content">
                  <table className="form">
                    <tbody>
                      <tr>
                        <td>
                          <span className="required">*</span> First Name:
                        </td>
                        <td>
                          <input type="text" name="firstname" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span> Last Name:
                        </td>
                        <td>
                          <input type="text" name="lastname" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>Company:</td>
                        <td>
                          <input type="text" name="company" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>Company ID:</td>
                        <td>
                          <input type="text" name="company_id" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span> Address 1:
                        </td>
                        <td>
                          <input type="text" name="address_1" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>Address 2:</td>
                        <td>
                          <input type="text" name="address_2" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span> City:
                        </td>
                        <td>
                          <input type="text" name="city" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span id="postcode-required" className="required">
                            *
                          </span>{" "}
                          Post Code:
                        </td>
                        <td>
                          <input type="text" name="postcode" value="" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span> Country:
                        </td>
                        <td>
                          <select name="country_id">
                            <option value=""></option>
                            <option value="244">Aaland Islands</option>
                            <option value="1">Afghanistan</option>
                            <option value="2">Albania</option>
                            <option value="3">Algeria</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="required">*</span> Region / State:
                        </td>
                        <td>
                          <select name="zone_id">
                            <option value=""></option>
                            <option value="3613">Alabama</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Default Address:</td>
                        <td>
                          {" "}
                          <input type="radio" name="default" value="1" />
                          Yes{" "}
                          <input
                            type="radio"
                            name="default"
                            value="0"
                            checked="checked"
                          />
                          No{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="buttons">
                  <div className="left">
                    <Link href="/account-address" className="button">
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

export default InserAddress;
