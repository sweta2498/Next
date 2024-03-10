import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useSelector } from "react-redux";

const Contact_Us = () => {
  const [res, setres] = useState({});
  const [loading, setLoading] = useState(false);
  const storeData = useSelector((state) => state?.common?.store);
  const { t: translate } = useTranslation("contactuspage");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required(translate("e_name")),
      phone: Yup.string().required(translate("e_phone")),
      email: Yup.string().email().required(translate("e_email")),
      message: Yup.string().required(translate("e_message")),
    }),

    onSubmit: async (values, { resetForm }) => {
      // setLoading(true);
      // console.log(values);
      /////api call
    },
  });

  return (
    <>
      {loading && (
        <div className="loader-div">
          <div className="text-center">
            <span className="spinner-border text-light"></span>
            <p className="fw-bold text-light fs-5"> </p>
          </div>
        </div>
      )}

      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/">{translate("home")}</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/contact">{translate("contact_us")}</Link>
                </li>
              </ol>
            </nav>
            <h1 className="head text-center"> {translate("contact_us")} </h1>
            <p className="contsub">
              {translate("contact_describtion_1")} {storeData?.store_name}{" "}
              {translate("contact_describtion_2")}
            </p>
            <div className="row">
              <div className="col-xs-12 col-md-6 hr-spacer">
                <div className="theme_box">
                  <div className="panel-heading text-center">
                    <img
                      style={{ maxWidth: "100%" }}
                      src={storeData?.image_path + storeData?.store_logo}
                      alt={storeData?.store_name}
                    />
                  </div>
                  <div className="">
                    <address
                      className="contact-add text-center"
                      style={{ marginTop: "20px" }}
                    >
                      <dl>
                        {storeData?.address && (
                          <>
                            <h3>Address</h3>
                            <dd
                              style={{ color: "grey" }}
                              dangerouslySetInnerHTML={{
                                __html: storeData?.address,
                              }}
                            ></dd>
                          </>
                        )}

                        {storeData?.store_id == "20" && <p>VAT: 374 9104 82</p>}

                        {storeData?.telephone && (
                          <>
                            <h3>Telephone</h3>
                            <dd style={{ color: "grey" }}>
                              <Link href="tel:+1-877 300-9885">
                                {storeData?.telephone}
                              </Link>
                            </dd>
                          </>
                        )}

                        {storeData?.Fax && (
                          <>
                            <dt style={{ color: "grey" }}>Local:</dt>
                            <dd style={{ color: "grey" }}>
                              <Link href="tel:+1-281 909-5931">
                                {storeData?.Fax}
                              </Link>{" "}
                              (We are open 24/7)
                            </dd>
                          </>
                        )}
                        <h3>{translate("e_mail")}</h3>
                        <dd>
                          <Link href={`mailto:${storeData?.email}`}>
                            {storeData?.email}
                          </Link>
                        </dd>
                      </dl>
                    </address>
                  </div>
                </div>
              </div>

              <div className="col-xs-12 col-md-6 hr-spacer">
                <div className="panel panel-info">
                  <div className="panel-heading text-center alert alert-info">
                    {translate("form_header")}
                  </div>
                  <div className="panel-body">
                    <form
                      className="form-horizontal type_2"
                      onSubmit={formik?.handleSubmit}
                    >
                      <div className="form-group">
                        <label
                          className="control-label col-sm-12"
                          htmlFor="name"
                        >
                          {translate("enter_name")}
                        </label>
                        <div className="col-sm-8 verticallycenter">
                          <input
                            className="form-control"
                            type="text"
                            id="name"
                            placeholder={translate("placeholder_name")}
                            name="name"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.name}
                          />
                        </div>
                        {formik?.errors?.name && formik?.touched?.name && (
                          <span className="text-danger">
                            <i
                              className="fa fa-exclamation-triangle"
                              aria-hidden="true"
                            ></i>
                            {formik?.errors?.name}
                          </span>
                        )}
                      </div>

                      <div className="form-group">
                        <label
                          className="control-label col-sm-12"
                          htmlFor="email"
                        >
                          {translate("enter_email")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            className="form-control"
                            type="email"
                            id="email"
                            placeholder={translate("placeholder_email")}
                            name="email"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.email}
                          />
                        </div>
                        {formik?.errors?.email && formik?.touched?.email && (
                          <span className="text-danger">
                            <i
                              className="fa fa-exclamation-triangle"
                              aria-hidden="true"
                            ></i>
                            {formik?.errors?.email}
                          </span>
                        )}
                      </div>
                      <div className="form-group">
                        <label
                          className="control-label col-sm-12"
                          htmlFor="phone"
                        >
                          {translate("enter_phone")}
                        </label>
                        <div className="col-sm-8">
                          <input
                            className="form-control"
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder={translate("placeholder_phone")}
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.phone}
                          />
                        </div>
                        {formik?.errors?.phone && formik?.touched?.phone && (
                          <span className="text-danger">
                            <i
                              className="fa fa-exclamation-triangle"
                              aria-hidden="true"
                            ></i>
                            {formik?.errors?.phone}
                          </span>
                        )}
                      </div>

                      <div className="form-group spacer">
                        <label
                          className="control-label col-sm-12"
                          htmlFor="enquiry"
                        >
                          {translate("enter_message")}
                        </label>
                        <div className="col-sm-8">
                          <textarea
                            className="form-control"
                            name="message"
                            onChange={formik?.handleChange}
                            onBlur={formik?.handleBlur}
                            value={formik?.values?.message}
                          ></textarea>
                        </div>
                        {formik?.errors?.message &&
                          formik?.touched?.message && (
                            <span className="text-danger">
                              <i
                                className="fa fa-exclamation-triangle"
                                aria-hidden="true"
                              ></i>
                              {formik?.errors?.message}
                            </span>
                          )}
                      </div>

                      <div className="form-group spacer-sm">
                        <div className="col-sm-6 col-sm-offset-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                          >
                            <span
                              className="glyphicon glyphicon-send"
                              aria-hidden="true"
                            ></span>{" "}
                            {translate("send")}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact_Us;
