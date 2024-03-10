import React, { useRef } from "react";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import axiosApi from "../../axios_instance";
import { useRouter } from "next/router";
import Script from "next/script";
import Link from "next/link";
import Head from "next/head";
// import { loadStripe } from "@stripe/stripe-js";
import { isBrowser, isMobile } from "react-device-detect";
import TermsAndCondition from "../TermsAndCondition";
import { setToast } from "../../redux/action/toastAction";

const yupSchema = yup.object().shape({
  shipping_company: yup
    .string()
    .max(150, "Company field can be maximum upto 150 characters."),
  shipping_first_name: yup
    .string()
    // .required("The first name field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "First name field can be maximum upto 100 characters."),
  shipping_last_name: yup
    .string()
    // .required("The last name field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "Last name field can be maximum upto 100 characters."),
  shipping_address_1: yup
    .string()
    // .required("The address field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(200, "Address field can be maximum upto 200 characters."),
  shipping_city: yup
    .string()
    // .required("The city field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(200, "City field can be maximum upto 200 characters."),
  // shipping_zone_id: yup.string().required("The State field is required."),
  shipping_zone_id: yup.string().required("THIS FIELD IS REQUIRED."),
  shipping_postcode: yup
    .string()
    // .required("The postcode field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "Postcode field can be maximum upto 100 characters."),
  shipping_phone: yup
    .string()
    // .required("The phone field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "Phone field can be maximum upto 100 characters."),
  shipping_email: yup
    .string()
    // .email("Shipping Email is not valid.")
    .email("PLEASE ENTER A VALID EMAIL ADDRESS.")
    // .required("The email field is required."),
    .required("THIS FIELD IS REQUIRED."),
  mobile_text_updates: yup.boolean(),
  sms_update_mobile: yup.string().when("mobile_text_updates", {
    is: true,
    then: yup.string().required("The mobile field is required."),
  }),
  billing_company: yup
    .string()
    .max(150, "Company field can be maximum upto 150 characters."),
  billing_first_name: yup
    .string()
    // .required("The first name field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "First name field can be maximum upto 100 characters."),
  billing_last_name: yup
    .string()
    // .required("The last name field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "Last name field can be maximum upto 100 characters."),
  billing_address_1: yup
    .string()
    // .required("The address field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(200, "Address field can be maximum upto 200 characters."),
  billing_city: yup
    .string()
    // .required("The city field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(200, "City field can be maximum upto 200 characters."),
  // billing_zone_id: yup.string().required("The state field is required."),
  billing_zone_id: yup.string().required("THIS FIELD IS REQUIRED."),
  billing_postcode: yup
    .string()
    // .required("The postcode field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "Postcode field can be maximum upto 100 characters."),
  billing_phone: yup
    .string()
    // .required("The phone field is required.")
    .required("THIS FIELD IS REQUIRED.")
    .max(100, "Phone field can be maximum upto 100 characters."),
  billing_email: yup
    .string()
    // .email("Billing Email is not valid.")
    .email("PLEASE ENTER A VALID EMAIL ADDRESS.")
    // .required("The email field is required."),
    .required("THIS FIELD IS REQUIRED."),
  payment_method_type: yup
    .string()
    .required("The payment method field is required."),
  card_holder_name: yup.string().when("payment_method_type", {
    is: "creditcard",
    // then: yup.string().required("The card holder name field is required."),
    then: yup.string().required("THIS FIELD IS REQUIRED."),
  }),
  card_no: yup
    .number("The card no must be a number.")
    .when("payment_method_type", {
      is: "creditcard",
      then: yup
        .number("The card no must be a number.")
        .typeError("PLEASE ENTER A VALID CREDIT CARD NUMBER.")
        // .required("The card number field is required."),
        .required("THIS FIELD IS REQUIRED."),
    }),
  expiry_month: yup.string().when("payment_method_type", {
    is: "creditcard",
    // then: yup.string().required("The expiry month field is required."),
    then: yup.string().required("THIS FIELD IS REQUIRED."),
  }),
  expiry_year: yup.string().when("payment_method_type", {
    is: "creditcard",
    // then: yup.string().required("The expiry year field is required."),
    then: yup.string().required("THIS FIELD IS REQUIRED."),
  }),
  cvv: yup.number("The cvv must be a number.").when("payment_method_type", {
    is: "creditcard",
    then: yup
      .number("The cvv must be a number.")
      .typeError("PLEASE ENTER A VALID NUMBER.")
      // .required("The cvv field is required."),
      .required("THIS FIELD IS REQUIRED."),
  }),
  // tax_exemption_number: yup.string().required("THIS FIELD IS REQUIRED."),
  termsconditions: yup
    .bool()
    // .required("The terms and conditions must be accepted.")
    // .oneOf([true], "The terms and conditions must be accepted."),
    .required("THIS FIELD IS REQUIRED.")
    .oneOf([true], "THIS FIELD IS REQUIRED."),
});

const paymentFields = [
  "card_holder_name",
  "card_no",
  "expiry_month",
  "expiry_year",
  "cvv",
  "termsconditions",
  "recaptcha",
];

const taxFields = ["tax_exemption_number"];

const convertYupErrors = (err) => {
  let temp_errors = {};
  err?.inner?.forEach((e) => {
    temp_errors = {
      ...temp_errors,
      [e.path]: e.message,
    };
  });
  return temp_errors;
};

const focusErrorInput = (errors) => {
  if (typeof errors == "object" && !Array.isArray(errors)) {
    if (Object?.keys(errors)?.length > 0) {
      let id = Object?.keys(errors)[0];
      let ele = document?.getElementById(id);
      if (Boolean(ele)) {
        ele?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => ele?.focus(), 400);
      }
    }
  }
};

const cardDropIn = require("braintree-web-drop-in");

const extraShippingState = ["3614", "3633", "3664", 3614, 3633, 3664];
let abortController;
var kemail, kfirstname, klastname, ktelephone, kcompnay;

const Checkout = ({ cartID }) => {
  const storeData = useSelector((state) => state?.common?.store);
  const language = storeData?.language?.name || "English";
  const storeCountryCodes = [
    { store_id: "15", country_id: "223", countryCode: "USA" },
    { store_id: "20", country_id: "222", countryCode: "GBR" },
    { store_id: "25", country_id: "38", countryCode: "CAN" },
    { store_id: "30", country_id: "13", countryCode: "AUS" },
    { store_id: "35", country_id: "74", countryCode: "FRA" },
    { store_id: "40", country_id: "105", countryCode: "ITA" },
    { store_id: "45", country_id: "81", countryCode: "DEU" },
    { store_id: "50", country_id: "150", countryCode: "NLD" },
  ];
  const [default_selected_country, setDefault_selected_country] = useState(
    storeCountryCodes?.find((x) => x?.store_id == storeData?.store_id)
      ?.country_id
  );
  const [state, setState] = useState({
    payment_method_type: "creditcard",
    shipping_country_id: default_selected_country,
    billing_country_id: default_selected_country,
    tax: false,
    termsconditions: true,
  });
  const [cartProduct, setCartProduct] = useState([]);
  const [checkoutData, setCheckoutData] = useState({});
  const [cartsTotals, setCartsTotals] = useState([]);
  const [countries, setCountries] = useState([]);
  const [affrimCountryCode, setAffrimCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [shippingStates, setShippingState] = useState([]);
  const [billingStates, setBillingState] = useState([]);
  const [package_protection, setPackage_protection] = useState(true);
  const [taxTitle, setTaxTitle] = useState({});
  const [taxExemption, setTaxExemption] = useState(false);
  const [totalValue, setTotalValue] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [shippingCountryLoader, setShippingCountryLoader] = useState(false);
  const [billingCountryLoader, setBillingCountryLoader] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState({});
  const [successpayment, setSucceessPayment] = useState(false);
  const [billingAddressPopup, setBillingAddressPopup] = useState(true);
  // const [cardPayInstance, setCardPayInstance] = useState(null);
  const [affirmScript, setAffirmScript] = useState(false);
  const [smallSize, setSmallSize] = useState(false);
  const [width, setWidth] = useState(0);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [validateError, setValidateError] = useState("");
  const [packageProtectionValue, setPackageProtectionValue] = useState("");
  const [taxNumberError, setTaxNumberError] = useState(false);

  const stateRef = useRef();
  const shippingStateRef = useRef();
  const billingStateRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t: translate } = useTranslation("checkoutpage");
  const currentYear = new Date()?.getFullYear();

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    if (Boolean(loading == false)) {
      function applyGoogleAutoComplete() {
        var shipping_input = document.getElementById("shipping_address_1");
        var billing_input = document.getElementById("billing_address_1");
        if (window?.google?.maps?.hasOwnProperty("places")) {
          setTimeout(() => {
            let google_places_autocomplete_shipping =
              new window.google.maps.places.Autocomplete(shipping_input, {
                types: ["geocode"],
              });
            let google_places_autocomplete_billing =
              new window.google.maps.places.Autocomplete(billing_input, {
                types: ["geocode"],
              });
            if (Boolean(google_places_autocomplete_shipping)) {
              window.google.maps.event.addListener(
                google_places_autocomplete_shipping,
                "place_changed",
                function () {
                  handleGoogleAutocompleteChange(
                    "shipping",
                    google_places_autocomplete_shipping?.getPlace()
                  );
                }
              );
            }
            if (Boolean(google_places_autocomplete_billing)) {
              window.google.maps.event.addListener(
                google_places_autocomplete_billing,
                "place_changed",
                function () {
                  handleGoogleAutocompleteChange(
                    "billing",
                    google_places_autocomplete_billing?.getPlace()
                  );
                }
              );
            }
          }, 1000);
        }
      }
      if (typeof window !== "undefined") {
        window.initMap = () => {
          // console.log("autocomplete loaded");
        };
        if (
          window?.hasOwnProperty("google") &&
          window?.google?.hasOwnProperty("maps")
        ) {
          applyGoogleAutoComplete();
        } else {
          let script = document?.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=${process?.env?.NEXT_PUBLIC_GOOGLE_AUTOCOMPLETE_KEY}&callback=initMap`;
          document.body.appendChild(script);
          script.onload = () => applyGoogleAutoComplete();
        }
      }
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    width <= 767 ? setSmallSize(true) : setSmallSize(false);
  }, [width]);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // useEffect(() => {
  //     if (isMobile) {
  //         setSmallSize(true)
  //     }
  // }, [isMobile]);

  useEffect(() => {
    checkoutApi();
    handleCountryChange({
      target: { name: "shipping_country_id", value: default_selected_country },
    });
  }, []);

  // useEffect(() => {
  //   packageProtectionFun(package_protection);
  // }, []);

  useEffect(() => {
    axiosApi
      .post("/state", {
        country_id: default_selected_country,
      })
      .then((res) => {
        setShippingState(res?.data?.result || []);
        setBillingState(res?.data?.result || []);
      })
      .catch((err) => {});
  }, []);

  // useEffect(() => {
  //     if (state?.payment_method_type == "creditcard") {
  //         const initializeCardBraintree = () =>
  //             cardDropIn.create(
  //                 {
  //                     authorization: "sandbox_38prfvrf_m2vfwcmfgb9hj7yr",
  //                     container: "#dropin-card-container",
  //                 },
  //                 (err, instance) => {
  //                     if (err) {
  //                         if (!Boolean(instance)) {
  //                             console.log("Could not initialize card payment option please try other payment options");
  //                         }
  //                     } else {
  //                         setCardPayInstance(instance);
  //                     }
  //                     // console.log("dropin error", err);
  //                     // console.log("dropin instance", instance);
  //                 }
  //             );
  //         if (cardPayInstance) {
  //             cardPayInstance.teardown().then(() => {
  //                 initializeCardBraintree();
  //             });
  //         } else {
  //             initializeCardBraintree();
  //         }
  //     }
  // }, [state?.payment_method_type]);

  const checkoutApi = (package_protection = true) => {
    try {
      axiosApi
        .post("cart/cart_checkout", {
          state: state?.shipping_zone_id,
          package_protection,
        })
        .then((res) => {
          // console.log(res);
          setCartProduct(res?.data?.result);
          setCartsTotals(res?.data?.carts_total);
          let PackageProtection = res?.data?.carts_total?.find(
            (x) => x.key == "PackageProtection"
          );
          if (package_protection == true) {
            setPackageProtectionValue(PackageProtection?.value_text);
          } else {
            setPackageProtectionValue("");
          }
          setCountries(res?.data?.country);
          setDefault_selected_country(
            res?.data?.country?.find((c) => c?.name === storeData?.country)?.id
          );
          setAffrimCountryCode(
            res?.data?.country?.find((c) => c?.name === storeData?.country)
              ?.iso_code_3
          );
          setTotalValue(res?.data?.total);
          setPackage_protection(res?.data?.package_protection);
          // packageProtectionFun(package_protection)
          setLoading(false);
          setUpdateLoader(false);
        })
        .catch((err) => {
          if (err?.response?.data?.status == false) {
            router?.push(
              `/cart?cart_id=${
                cartID?.cart_id !== undefined ? cartID?.cart_id : ""
              }`
            );
          }
          setUpdateLoader(false);
          router?.push(
            `/cart?cart_id=${
              cartID?.cart_id !== undefined ? cartID?.cart_id : ""
            }`
          );
          // console.log(err?.response);
          // setLoading(false);
        });
    } catch (e) {
      if (err?.response?.data?.message) {
        let errors = err?.response?.data?.message;
        if (typeof errors == "string") {
          dispatch(
            setToast({
              open: true,
              type: "danger",
              message: errors,
            })
          );
        }
      } else {
        dispatch(
          setToast({
            open: true,
            type: "danger",
            message: translate("There has been an error."),
          })
        );
      }
    }
  };

  const packageProtectionFun = (package_protection) => {
    setUpdateLoader(true);
    try {
      axiosApi
        .post("packageprotection", { package_protection })
        .then((res) => {
          // console.log("============", res?.data);
          checkoutApi();
          let PackageProtection = cartsTotals?.find(
            (x) => x.key == "PackageProtection"
          );
          if (package_protection == true) {
            setPackageProtectionValue(PackageProtection?.value_text);
          } else {
            setPackageProtectionValue("");
          }
        })
        .catch((err) => {
          // console.log(err);
          setUpdateLoader(false);
        });
    } catch (e) {}
  };

  const validateSingleField = async (schema, state, name, value) => {
    return schema
      .validate(
        { payment_method_type: state?.payment_method_type, [name]: value },
        { abortEarly: false }
      )
      .then((res) => {
        return false;
      })
      .catch((err) => {
        // console.log(err);
        let tErrors = convertYupErrors(err);
        // console.log(tErrors);
        if (tErrors[name]) {
          // console.log([name], tErrors[name]);
          return { [name]: tErrors[name] };
        } else {
          return false;
        }
      });
  };

  async function handleChange(e) {
    // console.log(e?.target);
    const { name, value, type, checked } = e?.target;
    if (["checkbox", "radio"].includes(type)) {
      // console.log(checked);
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

    // console.log(state);

    const error = await validateSingleField(
      yupSchema,
      state,
      name,
      ["checkbox", "radio"].includes(type) ? checked : value
    );
    if (error) {
      setErrors({
        ...errors,
        ...error,
      });
    } else {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  }

  const handleGoogleAutocompleteChange = (which, data) => {
    let details = {
      [which + "_postcode"]: "",
    };
    data?.address_components?.map((e) => {
      let y = e?.types[0];
      if (y == "country") {
        let country = countries?.find(
          (country) =>
            country?.iso_code_2 == e?.short_name ||
            country?.iso_code_3 == e?.short_name
        );
        if (Boolean(country)) {
          details = {
            ...details,
            [which + "_country_id"]: country?.id,
          };
          if (which == "shipping") {
            handleCountryChange(
              {
                target: {
                  name: "shipping_country_id",
                  value: country?.id,
                  type: "select",
                  checked: false,
                },
              },
              false,
              data?.address_components?.find(
                (i) => i?.types?.[0] == "administrative_area_level_1"
              )
            );
          } else if (which == "billing") {
            handleCountryChange(
              {
                target: {
                  name: "billing_country_id",
                  value: country?.id,
                  type: "select",
                  checked: false,
                },
              },
              false,
              data?.address_components?.find(
                (i) => i?.types?.[0] == "administrative_area_level_1"
              )
            );
          }
        }
      }
      if (y == "locality") {
        details = {
          ...details,
          [which + "_city"]: e?.long_name,
        };
      }
      if (y == "administrative_area_level_1") {
        // setTimeout(() => setAutocompletState(which, e), 2000);
      }
      if (y == "postal_code") {
        details = {
          ...details,
          [which + "_postcode"]: e?.long_name,
        };
      }
    });
    // console.log("asdasd", details);
    if (which == "shipping") {
      details = {
        ...details,
        shipping_address_1: data?.formatted_address,
      };
    } else if (which == "billing") {
      details = {
        ...details,
        billing_address_1: data?.formatted_address,
      };
    }
    setState({
      ...stateRef?.current,
      ...details,
    });
  };

  const handleCountryChange = async (e, update = true, addressData) => {
    // console.log(errors);
    if (abortController) {
      abortController?.abort();
    }

    abortController = new AbortController();

    const { name, value, type, checked } = e?.target;
    if (value) {
      let councode = countries?.find((x) => x.id == e?.target?.value);
      setAffrimCountryCode(councode?.iso_code_3);
    }
    let zone_id = name?.includes("shipping")
      ? "shipping_zone_id"
      : "billing_zone_id";
    if (name?.includes("shipping")) {
      setShippingCountryLoader(true);
    } else {
      setBillingCountryLoader(true);
    }
    const error = await validateSingleField(yupSchema, state, name, value);
    if (error) {
      setErrors({
        ...errors,
        ...error,
      });
    } else {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (Boolean(value)) {
      Boolean(update) &&
        setState({
          ...state,
          [name]: value,
          [zone_id]: "",
        });
      if (name?.includes?.("shipping")) {
        setTaxExemption(false);
        setStateCode("");
        setTaxTitle({});
        setPackage_protection(true);
        setPackageProtectionValue("");
        setTotalValue("");
        if (name?.includes("shipping")) {
          setShippingState([]);
          shippingStateRef.current = [];
        } else {
          setBillingState([]);
          billingStateRef.current = [];
        }
      }

      axiosApi
        .post(
          "/state",
          {
            country_id: value,
          },
          { signal: abortController?.signal }
        )
        .then((res) => {
          if (name?.includes("shipping")) {
            if (res?.data?.result?.length == 0) {
              setShippingState(
                countries.filter((country) => country.id == value)
              );
              shippingStateRef.current = countries.filter(
                (country) => country.id == value
              );
              setShippingCountryLoader(false);
            } else {
              setShippingState(res?.data?.result || []);
              shippingStateRef.current = res?.data?.result || [];
              setShippingCountryLoader(false);
            }
          } else {
            if (res?.data?.result?.length == 0) {
              setBillingState(
                countries.filter((country) => country.id == value)
              );
              billingStateRef.current = countries.filter(
                (country) => country.id == value
              );
              setBillingCountryLoader(false);
            } else {
              setBillingState(res?.data?.result || []);
              billingStateRef.current = res?.data?.result || [];
              setBillingCountryLoader(false);
            }
          }
          if (Boolean(addressData)) {
            setAutocompletState(
              name?.includes("shipping") ? "shipping" : "billing",
              addressData
            );
          }
        })
        .catch((err) => {
          setShippingCountryLoader(false);
          setBillingCountryLoader(false);
          if (err?.response?.data?.message) {
            let errors = err?.response?.data?.message;
            if (typeof errors == "string") {
              dispatch(
                setToast({
                  open: true,
                  type: "danger",
                  message: errors,
                })
              );
            }
          } else {
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: translate("There has been an error."),
              })
            );
          }
        });
    }
    // } catch (err) {}
  };

  function setAutocompletState(which, e) {
    if (which === "shipping") {
      if (
        shippingStateRef?.current?.length > 0 /* &&
        shippingStateRef?.current[0]?.country_id ===
          stateRef?.current?.shipping_country_id */
      ) {
        let se = shippingStateRef?.current?.find(
          (s) => s?.code == e?.short_name || s?.name == e?.long_name
        );
        if (Boolean(se)) {
          setState({
            ...stateRef?.current,
            shipping_zone_id: se?.id,
          });
          handleStateChange(
            {
              target: {
                name: "shipping_zone_id",
                value: se?.id,
                type: "text",
              },
            },
            true
          );
        }
      }
    } else if (which === "billing") {
      if (
        billingStateRef?.current?.length > 0 /* &&
        billingStateRef?.current[0]?.country_id ===
          stateRef?.current?.billing_country_id */
      ) {
        let se = billingStateRef?.current?.find(
          (s) => s?.code == e?.short_name || s?.name == e?.long_name
        );
        if (Boolean(se)) {
          setState({
            ...stateRef?.current,
            billing_zone_id: se?.id,
          });
          handleStateChange(
            {
              target: {
                name: "billing_zone_id",
                value: se?.id,
                type: "text",
              },
            },
            true
          );
        }
      }
    }
  }

  const handleStateChange = async (e, useStateRef = false, taxExemptionBox) => {
    // setUpdateLoader(true)
    // console.log(abc,"============");
    const { name, value, type, checked } = e?.target;
    try {
      const { name, value, type, checked } = e?.target;
      if (!Boolean(taxExemptionBox)) {
        if (value && (name == "shipping_zone_id" || name == "tax")) {
          let statecode = shippingStates?.find((x) => x.id == e?.target?.value);
          setStateCode(statecode?.code);
        }
      }
      // console.log(name, value, checked);
      const error = await validateSingleField(yupSchema, state, name, value);
      if (error) {
        setErrors({
          ...errors,
          ...error,
        });
      } else {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
      if (Boolean(value)) {
        let stateData = useStateRef ? stateRef?.current : state;
        setState({
          ...stateData,
          [name]: value,
          tax_exemption_number: "",
        });

        if (name == "shipping_zone_id" || name == "tax") {
          axiosApi
            .post("/tax", {
              state: value == "false" ? state?.shipping_zone_id : value,
              tax: Boolean(checked),
            })
            .then((res) => {
              setCheckoutData(res?.data);
              if (name == "shipping_zone_id" || name == "tax") {
                setTaxExemption(res?.data?.tax_exemption);
              }
              // setTaxExemption(res?.data?.tax_exemption);
              setCartsTotals(res?.data?.carts_total);
              setTaxTitle(res?.data?.title);
              setPackage_protection(res?.data?.package_protection);
              setPackageProtectionValue(
                res?.data?.title?.package_protection
                  ? res?.data?.title?.package_protection
                  : ""
              );
              setTotalValue(res?.data?.total);
              // setUpdateLoader(false)
            })
            .catch((err) => {
              // setUpdateLoader(false);
              // console.log(err);
            });
        }
      }
    } catch (err) {
      //   console.log(err);
      if (err?.response?.data?.message) {
        let errors = err?.response?.data?.message;
        if (typeof errors == "string") {
          dispatch(
            setToast({
              open: true,
              type: "danger",
              message: errors,
            })
          );
        }
      } else {
        dispatch(
          setToast({
            open: true,
            type: "danger",
            message: translate("There has been an error."),
          })
        );
      }
    }
  };

  const handleCopy = () => {
    let data = {
      ...stateRef?.current,
      billing_company: stateRef?.current?.shipping_company,
      billing_first_name: stateRef?.current?.shipping_first_name,
      billing_last_name: stateRef?.current?.shipping_last_name,
      billing_address_1: stateRef?.current?.shipping_address_1,
      billing_address_2: stateRef?.current?.shipping_address_2,
      billing_city: stateRef?.current?.shipping_city,
      billing_zone_id: stateRef?.current?.shipping_zone_id,
      billing_postcode: stateRef?.current?.shipping_postcode,
      billing_country_id: stateRef?.current?.shipping_country_id,
      billing_phone: stateRef?.current?.shipping_phone,
      billing_email: stateRef?.current?.shipping_email,
    };
    setBillingState(shippingStates);
    setState(data);
    stateRef.current = data;
    yupSchema
      .validate(data, { abortEarly: false })
      .then((res) => {
        setErrors({});
      })
      .catch((err) => {
        let temp_errors = convertYupErrors(err);
        let errors = {};
        Object.keys(temp_errors).map((key) => {
          if (!paymentFields.includes(key)) {
            errors[key] = temp_errors[key];
          }
        });
        setErrors(errors);
      });
  };

  const handleMethodChange = (data, event) => {
    setState({
      ...state,
      payment_method_type: data,
    });
  };

  useEffect(() => {
    if (taxExemption) {
      setTaxNumberError(false);
    }
  }, [taxExemption]);

  // console.log(!taxExemption && state.tax_exemption_number == "");

  const handleSubmit = async (e) => {
    // if(!taxExemption){
    //   if(state.tax_exemption_number == ''){
    //     console.log("errr");
    //     setTaxNumberError(true)
    //     focusErrorInput({tax_exemption_number:"THIS FIELD IS REQUIRED."})
    //   }
    // }

    if (Boolean(smallSize)) {
      // console.log(billingAddressPopup);
      if (Boolean(billingAddressPopup)) {
        handleCopy();
      }
    }
    if (e && e?.preventDefault && typeof e?.preventDefault == "function") {
      e?.preventDefault();
    }
    const isValid = await yupSchema.isValid(stateRef?.current, {
      abortEarly: false,
    });
    if (!isValid) {
      yupSchema
        .validate(stateRef?.current, { abortEarly: false })
        // .then((res) => console.log("yup", res))
        .catch((err) => {
          // console.log("====", err);
          let temp_errors = convertYupErrors(err);
          // console.log("before", temp_errors);
          let errors = {};
          // if(taxExemption){
          //   // console.log("if");
          //   Object.keys(temp_errors).map((key) => {
          //     // console.log("loop");
          //     if (!taxFields.includes(key)) {
          //       // console.log("condition");
          //         errors[key] = temp_errors[key];
          //     }
          // });
          focusErrorInput(temp_errors);
          setErrors(temp_errors);

          // let errors = {};
          // Object.keys(temp_errors).map((key) => {
          //     if (!paymentFields.includes(key)) {
          //         errors[key] = temp_errors[key];
          //     }
          // });
          // setErrors(errors);
        });
    } else {
      if (
        storeData?.store_id == "15" &&
        !taxExemption &&
        state.tax_exemption_number == "" &&
        stateCode == "TX"
      ) {
        setTaxNumberError(true);
        focusErrorInput({ tax_exemption_number: "THIS FIELD IS REQUIRED." });
      } else {
        if (state?.payment_method_type == "affirm") {
          setAffirmScript(true);
          finalSubmit();
        } else if (state?.payment_method_type == "creditcard") {
          if (storeData?.creditcard_pay_method === "braintree") {
            finalSubmit();
          } else if (storeData?.creditcard_pay_method === "stripe") {
            if (typeof window?.Stripe !== "undefined") {
              setLoadingPayment(true);
              await window?.Stripe?.setPublishableKey(
                process?.env?.NEXT_PUBLIC_STRIPE_KEY
              );
              await window?.Stripe.createToken(
                {
                  number: state?.card_no,
                  cvc: state?.cvv,
                  exp_month: state?.expiry_month,
                  exp_year: state?.expiry_year,
                },
                (status, response) => {
                  // console.log(response);
                  // setLoading(false);

                  if (response?.error) {
                    // console.log("err");
                    setLoadingPayment(false);
                    setError(response || "Could not make payment");
                    document?.getElementById("notification")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  } else {
                    // alert("token" + response?.id);
                    setState({
                      ...state,
                      stripeToken: response?.id,
                    });
                    finalSubmit(response?.id);
                  }
                }
              );
            } else {
              // finalSubmit();
            }
          }
        } else {
          finalSubmit();
        }
      }
      // if(state?.payment_method_type == "creditcard")
      // {
      //     cardPayInstance.requestPaymentMethod((err, payload) => {
      //         // console.log("Heeeeet", err, payload);
      //         if (Boolean(err)) {
      //          console.log(err);
      //         } else {
      //         //   setLoading(true);
      //         //   setLoadingMsg("Processing request.");
      //           finalSubmit(payload?.nonce);
      //         }
      //       });
      // }
    }
  };

  const finalSubmit = (token) => {
    setLoadingPayment(true);
    let data = state;
    data.is_mobile = isMobile;
    if (state?.payment_method_type == "creditcard") {
      if (storeData?.creditcard_pay_method === "stripe") {
        if (token) {
          data = {
            ...data,
            stripeToken: token,
          };
        }
      }
    }
    // if (!data?.nonce && Boolean(token)) {
    //     data.nonce = token;
    // }
    axiosApi
      .post("/order", data)
      .then((res) => {
        // console.log(res?.data);
        // console.log(
        //   Math.abs(
        //     res?.data?.result?.total?.find((item) => item?.key == "coupon")
        //       ?.value
        //   )
        // );
        setSucceessPayment(true);

        if (state?.payment_method_type == "affirm") {
          let item_object = [];
          res?.data?.result?.products?.map((item) => {
            return item_object?.push({
              display_name: item?.product_name,
              sku: "2",
              unit_price: item?.price * 100,
              qty: item?.quantity,
              categories: [item?.product_name],
            });
          });
          try {
            affirm.checkout({
              merchant: {
                user_confirmation_url:
                  window?.location?.origin + "/checkout-success",
                user_cancel_url: window?.location?.origin + "/checkout",
                user_confirmation_url_action: "POST",
              },
              shipping: {
                name: {
                  first: res?.data?.result?.shipping_address?.first_name,
                  last: res?.data?.result?.shipping_address?.last_name,
                },
                address: {
                  // line1: "6406 caparra rock ln",
                  // line2: "",
                  // city: "Sugar land",
                  // state: "TX",
                  // zipcode: "77479",
                  // country: "USA",
                  line1:
                    res?.data?.result?.shipping_address?.address?.address1 ||
                    "",
                  line2:
                    res?.data?.result?.shipping_address?.address?.address1 ||
                    "",
                  city: res?.data?.result?.shipping_address?.city,
                  state: stateCode,
                  zipcode: res?.data?.result?.shipping_address?.postal_code,
                  country: affrimCountryCode,
                },
                // phone_number: 2066561175,
                email: res?.data?.result?.shipping_address?.e_mail,
              },
              // billing: {
              //     name: {
              //         first:"abc",
              //         last: "abc",
              //     },
              //     address: {
              //         line1: "6406 caparra rock ln",
              //         line2: "",
              //         city: "Sugar land",
              //         state: "TX",
              //         zipcode: "77479",
              //         country: "USA",
              //     },
              //     // phone_number: 2066561175,
              //     email: "kapil.sabhaya50@gmail.com",
              // },
              items: item_object,
              metadata: {
                shipping_type: new Date(res?.data?.result?.delivery_date),
                mode: "modal",
                entity_name: "CarCoversFactory.com",
                // platform_type: 'VTEX',
                // platform_version: "version",
                // platform_affirm: 'Affirm_2.0',
              },
              order_id: res?.data?.result?.order_id,
              currency: "USD",
              //discounts: parseInt(res?.data?.result?.total?.find((item) => item?.key == 'coupon')?.value) || 0,
              //shipping_amount: parseInt(res?.data?.result?.total?.find((item) => item?.key == 'shipping')?.value) || 0,
              //tax_amount: parseInt(res?.data?.result?.total?.find((item) => item?.key == 'tax')?.value) || 0,
              //total: parseInt(res?.data?.result?.total?.find((item) => item?.key == 'total')?.value) || 0,
              // discounts: 1000,
              discounts: {
                coupon: {
                  discount_amount:
                    Math.abs(
                      res?.data?.result?.total?.find(
                        (item) => item?.key == "coupon"
                      )?.value
                    ) * 100 || 0,
                  discount_display_name: res?.data?.result?.total?.find(
                    (item) => item?.key == "coupon"
                  )?.text,
                },
              },
              shipping_amount:
                res?.data?.result?.total?.find(
                  (item) => item?.key == "shipping"
                )?.value * 100 || 0,
              tax_amount:
                res?.data?.result?.total?.find((item) => item?.key == "tax")
                  ?.value * 100 || 0,
              package_protection:
                res?.data?.result?.total?.find(
                  (item) => item?.key == "package_protection"
                )?.value * 100 || 0,
              total:
                res?.data?.result?.total?.find((item) => item?.key == "total")
                  ?.value * 100 || 0,
            });
          } catch (e) {
            setLoadingPayment(false);
            setLoading(false);
            dispatch(
              setToast({
                open: true,
                type: "danger",
                message: translate("There has been an error."),
              })
            );
            // console.log("568", e);
          }

          affirm.checkout.open({
            onFail: function (e) {
              setLoadingPayment(false);
              setLoading(false);
              // console.log("error", e);
            },
            onSuccess: function (a) {
              router?.push(
                "/checkout-success?checkout_token=" + a.checkout_token
              );
              // alert(
              //     "Affirm checkout successful, checkout token is: " +
              //     a.checkout_token
              // );
              // console.log(a.checkout_token);
            },
          });

          affirm.ui.ready(function () {
            affirm.ui.error.on("close", function () {
              setLoadingPayment(false);
              // console.log("vlodr");
              setLoading(false);
              // alert("Please check your contact information for accuracy.");
            });
          });
        } else {
          // setLoadingPayment(false);
          setLoading(false);
          if (res?.data?.redirect_url) {
            router?.push(res?.data?.redirect_url);
            // router?.push('/checkout-success')
          }
          if (res?.data?.redirect_urls) {
            router?.push(res?.data?.redirect_urls);
            // router?.push('/checkout-success')
          }
          if (res?.data?.paypal_url) {
            router?.push(res?.data?.paypal_url);
            // router?.push('/checkout-success')
          }
          if (res?.data?.card_url) {
            router?.push(res?.data?.card_url);
            // router?.push('/checkout-success')
          }
          if (res?.data?.check_url) {
            router?.push(res?.data?.check_url);
            // router?.push('/checkout-success')
          }
        }
      })
      .catch((err) => {
        // console.log(err?.response?.data);
        if (err?.response?.data?.message?.success == false) {
          focusErrorInput({ message: err?.response?.data?.message?.message });
          setValidateError(err?.response?.data?.message?.message);
        } else {
          focusErrorInput({ message: err?.response?.data?.message });
          setValidateError(err?.response?.data?.message);
        }
        setLoading(false);
        setLoadingPayment(false);
        setSucceessPayment(false);
        // if (err?.response?.data?.redirect_url) {
        //     router?.push(err?.response?.data?.redirect_url);
        // }
      });
  };

  useEffect(() => {
    if (cartProduct.length) klaviyoStartedCheckout();
  }, [cartProduct.length]);

  // console.log(cartProduct);
  let productName = "";
  var klaviyoStartedCheckout = function () {
    try {
      if (
        typeof window.klaviyo !== "undefined" &&
        Boolean(cartProduct.length)
      ) {
        const products = cartProduct; // global variable
        const cartTotal =
          cartsTotals?.find((ct) => ct?.key == "total")?.value || 0;
        const products_array = [];
        const products_categories = [];
        const products_names = [];
        let totalQty = 0;
        products.forEach(function (product) {
          productName = "";
          totalQty += product?.quantity;
          if (Object.keys(product?.slugs)?.length) {
            if (product?.slugs?.body) {
              productName =
                product?.slugs?.category_name +
                " " +
                product?.slugs?.year +
                " " +
                product?.slugs?.make_name +
                " " +
                product?.slugs?.model_name +
                " " +
                product?.slugs?.body_name +
                " - " +
                product?.product_name;
            } else if (product?.slugs?.model_name) {
              productName =
                product?.slugs?.category_name +
                " " +
                product?.slugs?.year +
                " " +
                product?.slugs?.make_name +
                " " +
                product?.slugs?.model_name +
                " - " +
                product?.product_name;
            }
          } else if (Object.keys(product?.tiles_slug)?.length) {
            if ([3, 4]?.includes(product?.tiles_slug?.category_id)) {
              productName = product?.product_name;
            } else
              productName =
                product?.tiles_slug?.tiles_name + " - " + product?.product_name;
          } else {
            productName = product?.product_name;
          }

          const vehicle_id = product?.vehicle_id
            ? product?.vehicle_id
            : product?.tiles_slug?.tiles_id
            ? "tile_id_" + product?.tiles_slug?.tiles_id
            : "";
          const category_id = product?.slugs?.category_id
            ? product?.slugs?.category_id
            : [3, 4]?.includes(product?.tiles_slug?.category_id)
            ? ""
            : product?.tiles_slug?.category_id;
          const skuName =
            (Boolean(vehicle_id) ? vehicle_id + "_" : "") +
            (Boolean(category_id) ? category_id + "_" : "");
          let productURL = "";
          // console.log("===-=-=-=-=product=-=----", product);
          if (Object.keys(product?.slugs)?.length) {
            if (product?.slugs?.body) {
              productURL =
                product?.slugs?.category +
                "/" +
                product?.slugs?.year +
                "/" +
                product?.slugs?.make +
                "/" +
                product?.slugs?.model +
                "/" +
                product?.slugs?.body +
                "/" +
                product?.product_slug;
            } else if (product?.slugs?.model_name) {
              productURL =
                product?.slugs?.category +
                "/" +
                product?.slugs?.year +
                "/" +
                product?.slugs?.make +
                "/" +
                product?.slugs?.model +
                "/" +
                product?.product_slug;
            }
          } else if (Object.keys(product?.tiles_slug)?.length) {
            if ([3, 4]?.includes(product?.tiles_slug?.category_id)) {
              productURL =
                product?.tiles_slug?.category_slug +
                "/" +
                product?.product_slug;
            } else
              productURL =
                product?.tiles_slug?.category_slug +
                "/" +
                product?.tiles_slug?.tiles_slug +
                "/" +
                product?.product_slug;
          } else {
            productURL = product?.product_slug;
          }
          products_array.push({
            ProductID: product?.product_id,
            SKU: Boolean(skuName)
              ? skuName + product?.product_id
              : product?.product_id?.toString(),
            ProductName: productName || product?.product_name,
            Quantity: product?.quantity,
            ItemPrice: product?.price || 0,
            RowTotal: product?.total || 0,
            ProductURL: window.location.origin + "/" + productURL,
            ImageURL: storeData?.image_path + product?.image,
            ProductCategories: product?.slugs?.category_name
              ? [product?.slugs?.category_name]
              : product?.tiles_slug?.category_name
              ? [product?.tiles_slug?.category_name]
              : "",
          });

          if (
            products_categories.indexOf(product?.slugs?.category_name) === -1 ||
            products_categories.indexOf(product?.tiles_slug?.category_name) ===
              -1
          ) {
            if (product?.slugs?.category_name) {
              products_categories?.push(product?.slugs?.category_name);
            } else if (product?.tiles_slug?.category_name) {
              products_categories?.push(product?.tiles_slug?.category_name);
            }
          }
          if (products_names.indexOf(product?.product_name) === -1) {
            products_names?.push(productName);
          }
        });
        const lastCartProduct = products[products.length - 1];
        // console.log("totalQty", totalQty);
        klaviyo.push([
          "track",
          "Started Checkout",
          {
            $event_id: lastCartProduct?._id + "_" + totalQty,
            $value: cartTotal,
            ItemNames: products_names,
            CheckoutURL:
              window.location.origin + `/cart?cart_id=${cartID?.cart_id}`,
            CartURL:
              window.location.origin + `/cart?cart_id=${cartID?.cart_id}`,
            Categories: products_categories,
            Items: products_array,
          },
          function () {
            klaviyoStartedCheckoutEventFired = true;
          },
        ]);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  function validateEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  var klaviyoIdentify = function () {
    console.log("sasadsad");
    try {
      if (typeof window.klaviyo !== "undefined") {
        const semail = state?.shipping_email || "";
        const scompany = state?.shipping_company;
        const sfirstname = state?.shipping_first_name;
        const slastname = state?.shipping_last_name;
        const stelephone = state?.shipping_phone;

        //const shipping_zone_id = $('select[name="shipping_zone_id"]').val();
        //const shipping_zone_text = $('select[name="shipping_zone_id"]').find('option:selected').text();
        //const shipping_country_id = $('select[name="shipping_country_id"]').val();
        //const shipping_country_text = $('select[name="shipping_country_id"]').find('option:selected').text();
        const emptyReg = /([^\s])/;

        if (
          validateEmail(semail) &&
          emptyReg.test(sfirstname) &&
          emptyReg.test(slastname) &&
          emptyReg.test(stelephone)
          /*&& emptyReg.test(shipping_country_text)  && emptyReg.test(shipping_zone_text) &&
            emptyReg.test(shipping_country_id)  && emptyReg.test(shipping_zone_id)*/
        ) {
          if (
            // kcompnay != scompany ||
            kemail != semail ||
            kfirstname != sfirstname ||
            klastname != slastname ||
            ktelephone != stelephone
          ) {
            console.log("=if==");
            kemail = semail;
            kfirstname = sfirstname;
            klastname = slastname;
            ktelephone = stelephone;
            kcompnay = scompany;
            window.klaviyo.identify(
              {
                $email: semail,
                $first_name: sfirstname,
                $last_name: slastname,
                $phone_number: stelephone,
                //'$country' : shipping_country_text,
                //'$state' : shipping_zone_text,
                $organization: scompany,
              },
              klaviyoStartedCheckout
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const klaviyoFun=()=>{
  //   var klaviyoStartedCheckoutEventFired = false;
  //   var cartURL = $('#cartURL').val();
  //   var klaviyoCartProducts,klaviyoCartTotal,checkoutURL;

  //   $(document).on('focusout', 'input[name="semail"],input[name="sfirstname"],input[name="slastname"],input[name="stelephone"]', function () {
  //       if (typeof klaviyo !== 'undefined' && !klaviyoStartedCheckoutEventFired && typeof klaviyoCartProducts !== 'undefined' && typeof klaviyoCartTotal !== 'undefined') {
  //           klaviyoIdentify();
  //       }
  //   })
  //   $(document).on('input', 'input[name="semail"],input[name="sfirstname"],input[name="slastname"],input[name="stelephone"]', function () {
  //       if (typeof klaviyo !== 'undefined' && klaviyoStartedCheckoutEventFired && typeof klaviyoCartProducts !== 'undefined' && typeof klaviyoCartTotal !== 'undefined') {
  //           klaviyoStartedCheckoutEventFired = false;
  //       }
  //   })

  //   if(typeof window.klaviyo !== undefined){
  //       $.ajax({
  //           url: 'index.php?route=checkout/checkout/getKlaviyoData',
  //           dataType: 'json',
  //           success: function (json) {
  //               if(typeof json['cartProducts'] !== 'undefined' && typeof json['cartTotal'] !== 'undefined'){
  //                   klaviyoCartProducts = json['cartProducts'];
  //                   klaviyoCartTotal = json['cartTotal'];
  //                   checkoutURL = json['checkoutURL'];
  //                   klaviyoStartedCheckout();
  //               }
  //               if(typeof json['google_EC_data'] !== 'undefined'){
  //                   googleEcommerceCheckout(json['google_EC_data']);
  //               }
  //           },
  //           error: function (xhr, ajaxOptions, thrownError) {
  //               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
  //           }
  //       });
  //   }
  // }

  const Package_protection_data = (checked) => {};

  // useEffect(() => {
  //   if (!state?.tax) {
  //     setState({
  //       ...state,
  //       tax_exemption_number: "",
  //     });
  //   }
  // }, [state?.tax]);

  return (
    <>
      <Head>
        <title>{translate("checkout")}</title>

        {storeData?.creditcard_pay_method === "stripe" && (
          <script
            id="stripeLoad"
            src="https://js.stripe.com/v2/"
            strategy="beforeInteractive"
          />
        )}

        {Boolean(affirmScript) && (
          <script id="affirmCheckout">
            {`
                            _affirm_config = {
                            public_api_key:  "VZKF88IM1ST82LG7",
                            script: "https://cdn1-sandbox.affirm.com/js/v2/affirm.js"};
                            (function(m,g,n,d,a,e,h,c)
                            {
                                var b=m[n]||{ },
                                k=document.createElement(e),
                                p=document.getElementsByTagName(e)[0],
                                l=function(a,b,c)
                                {
                                    return function(){a[b]._.push([c, arguments])
                                }
                            };
                            b[d]=l(b,d,"set");
                            var f=b[d];
                            b[a]={ };
                            b[a]._=[];
                            f._=[];
                            b._=[];
                            b[a][h]=l(b,a,h);
                            b[c]=function()
                            {
                                b._.push([h, arguments])
                            };
                            a=0;
                            for(c="set add save post open empty reset on off trigger ready setProduct".split(" ");
                            a<c.length;
                            a++)
                            f[c[a]]=l(b,d,c[a]);
                            a=0;
                            for(c=["get","token","url","items"];
                            a<c.length;
                            a++)
                            f[c[a]]=function(){ };
                            k.async=!0;
                            k.src=g[e];
                            p.parentNode.insertBefore(k,p);
                            delete g[e];
                            f(g);
                            m[n]=b
                        })
                        (window,_affirm_config,"affirm","checkout","ui","script","ready","jsReady");
                        `}
          </script>
        )}
      </Head>

      {updateLoader && (
        <span className="loader-div">
          <i className="fa fa-cog fa-spin"></i>
        </span>
      )}

      {Boolean(loading) ? (
        <>
          <div className="single-wrapper-glob cart-wrapper cfc">
            <div className="container">
              <div className="information-wrap">
                <div className="inner-wrapper checkout-form">
                  <div className="row row-cols-md-2 row-cols-1">
                    <div className="col">
                      <div className="card h-100" aria-hidden="true">
                        <div className="card-header placeholder-glow">
                          <h3 className="col-12 placeholder mb-0"></h3>
                        </div>
                        <div className="card-body placeholder-glow">
                          <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                          <div className="row">
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                          <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                          <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                          <div className="row">
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col-md-6 col-12">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <button className="btn btn-primary disabled placeholder col-5 mb-4"></button>
                        </div>
                      </div>
                    </div>
                    <div className="col d-md-block d-none">
                      <div className="card h-100" aria-hidden="true">
                        <div className="card-header placeholder-glow">
                          <h3 className="col-12 placeholder mb-0"></h3>
                        </div>
                        <div className="card-body placeholder-glow">
                          <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                          <div className="row">
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                          <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                          <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                          <div className="row">
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                            <div className="col">
                              <h4 className="mb-4 mt-2 col-12 placeholder"></h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <section className="banner">
            <div className="container">
              <div className="page-banner page-banner-checkout">
                <div className="entry-content">
                  <h1 className="page-title">{translate("checkout")}</h1>
                  <div className="description">
                    {translate("secure Checkout process")}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="single-wrapper-glob cart-wrapper cfc">
            <div className="container">
              <div className="information-wrap">
                <div
                  className="inner-wrapper checkout-form"
                  id="payment-address"
                >
                  <div id="message">
                    {validateError && (
                      <div className="warning alert alert-danger">
                        {validateError}
                      </div>
                    )}
                  </div>

                  <div id="notification">
                    {error?.error?.message && (
                      <div
                        className="warning alert alert-danger"
                        id={"errorMsg"}
                      >
                        {error?.error?.message}
                      </div>
                    )}
                  </div>

                  <form
                    action=""
                    method="post"
                    className="form_validate"
                    noValidate="novalidate"
                    onSubmit={handleSubmit}
                  >
                    <div className="row checkout-content form-group">
                      <div className="col-md-6 shipaddr">
                        <div className="form-wrap ">
                          <h4 className="title">
                            <strong>{translate("shipping")}</strong>
                            {storeData?.language?.name == "English" &&
                              " Address"}
                          </h4>
                          <div className="form-inside">
                            <div className="form-row">
                              <div className="col-12">
                                <label>
                                  {translate("Company Name")} :{" "}
                                  {"(" + translate("optional") + ")"}
                                </label>
                                <input
                                  type="text"
                                  name="shipping_company"
                                  id="shipping_company"
                                  placeholder={translate("Company Name") + ":"}
                                  value={state?.shipping_company || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  onBlur={(e) => {
                                    klaviyoIdentify();
                                  }}
                                />
                                {errors?.shipping_company && (
                                  <span className="text-danger">
                                    {errors?.shipping_company}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("First Name")}: *</label>
                                <input
                                  type="text"
                                  name="shipping_first_name"
                                  id="shipping_first_name"
                                  placeholder={translate("First Name") + ":"}
                                  value={state?.shipping_first_name || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  onBlur={(e) => {
                                    klaviyoIdentify();
                                  }}
                                />
                                {errors?.shipping_first_name && (
                                  <span className="text-danger">
                                    {errors?.shipping_first_name}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("Last Name")}: *</label>
                                <input
                                  type="text"
                                  name="shipping_last_name"
                                  id="shipping_last_name"
                                  placeholder={translate("Last Name") + ":"}
                                  value={state?.shipping_last_name || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  onBlur={(e) => {
                                    klaviyoIdentify();
                                  }}
                                />
                                {errors?.shipping_last_name && (
                                  <span className="text-danger">
                                    {errors?.shipping_last_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-12">
                                <label>{translate("Address")}: *</label>
                                <input
                                  type="text"
                                  name="shipping_address_1"
                                  id="shipping_address_1"
                                  value={state?.shipping_address_1 || ""}
                                  onChange={handleChange}
                                  placeholder={translate("addressline1") + " :"}
                                  className="form-control"
                                />
                                {errors?.shipping_address_1 && (
                                  <span className="text-danger">
                                    {errors?.shipping_address_1}
                                  </span>
                                )}
                                <em
                                  style={{
                                    color: "#a10",
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                    display: "block",
                                  }}
                                >
                                  {translate("ship_msg")}
                                </em>
                                <input
                                  type="text"
                                  name="shipping_address_2"
                                  id="shipping_address_2"
                                  value={state?.shipping_address_2 || ""}
                                  onChange={handleChange}
                                  placeholder={translate("addressline2") + " :"}
                                  className="form-control mt-2"
                                />
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("City")}: *</label>

                                <input
                                  type="text"
                                  name="shipping_city"
                                  id="shipping_city"
                                  value={state?.shipping_city || ""}
                                  onChange={handleChange}
                                  placeholder={translate("City") + ":"}
                                  className="form-control"
                                />
                                {errors?.shipping_city && (
                                  <span className="text-danger">
                                    {errors?.shipping_city}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("State")}: *</label>
                                <select
                                  type="text"
                                  name="shipping_zone_id"
                                  id="shipping_zone_id"
                                  className="form-control"
                                  value={state?.shipping_zone_id || ""}
                                  onChange={handleStateChange}
                                >
                                  <option value="" style={{ color: "#6c757d" }}>
                                    {translate("Select state") + ":"}
                                  </option>
                                  {Boolean(shippingStates) &&
                                    Array?.isArray(shippingStates) &&
                                    shippingStates?.length > 0 &&
                                    shippingStates?.map((state) => (
                                      <option
                                        key={state?.id + "shipping_zone_id"}
                                        value={state?.id}
                                      >
                                        {state?.name}
                                      </option>
                                    ))}
                                </select>
                                {errors?.shipping_zone_id && (
                                  <span className="text-danger">
                                    {errors?.shipping_zone_id}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("Postal code")} *</label>
                                <input
                                  type="text"
                                  name="shipping_postcode"
                                  id="shipping_postcode"
                                  className="form-control"
                                  value={state?.shipping_postcode || ""}
                                  onChange={handleChange}
                                  placeholder={translate("Postal code")}
                                />
                                {errors?.shipping_postcode && (
                                  <span className="text-danger">
                                    {errors?.shipping_postcode}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("Country code")}: *</label>
                                {Boolean(shippingCountryLoader) && (
                                  <span>
                                    &nbsp;
                                    <img src="images/smallLoading.gif" alt="" />
                                  </span>
                                )}

                                <select
                                  type="text"
                                  name="shipping_country_id"
                                  id="shipping_country_id"
                                  value={
                                    state?.shipping_country_id ||
                                    default_selected_country ||
                                    ""
                                  }
                                  onChange={handleCountryChange}
                                  className="form-control"
                                >
                                  <option value="">
                                    {translate("Select Country")}
                                  </option>

                                  {Boolean(countries?.length) &&
                                    Array?.isArray(countries) &&
                                    countries?.length > 0 &&
                                    countries?.map((country) => (
                                      <option
                                        key={
                                          country?.id + "shipping_country_id"
                                        }
                                        value={country?.id}
                                        id={"shipping_" + country.id}
                                      >
                                        {country?.name}
                                      </option>
                                    ))}
                                </select>
                                {errors?.shipping_country_id && (
                                  <span className="text-danger">
                                    {errors?.shipping_country_id}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("Phone")}: *</label>
                                <input
                                  type="text"
                                  name="shipping_phone"
                                  id="shipping_phone"
                                  placeholder={translate("Phone") + ":"}
                                  value={state?.shipping_phone || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  onBlur={(e) => {
                                    klaviyoIdentify();
                                  }}
                                />

                                {errors?.shipping_phone && (
                                  <span className="text-danger">
                                    {errors?.shipping_phone}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("Email")}: *</label>
                                <input
                                  type="text"
                                  name="shipping_email"
                                  id="shipping_email"
                                  placeholder={translate("Email") + ":"}
                                  value={state?.shipping_email || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  onBlur={(e) => {
                                    klaviyoIdentify();
                                  }}
                                />
                                {errors?.shipping_email && (
                                  <span className="text-danger">
                                    {errors?.shipping_email}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="btn-wrap d-none d-md-block">
                              <a
                                className="btn btn-primary text-white c-pointer"
                                id="btncopy"
                                onClick={handleCopy}
                              >
                                <span className="fa fa-files-o"></span>
                                &nbsp;&nbsp;{translate("copy_btn")}
                              </a>
                            </div>

                            <div className="btn-wrap d-sm-block d-md-none text-white">
                              <Link
                                href={""}
                                className={`btn label-toogle-check c-pointer
                                                                ${
                                                                  Boolean(
                                                                    billingAddressPopup
                                                                  )
                                                                    ? "btn-success"
                                                                    : "btn-primary"
                                                                }`}
                                data-bs-toggle="button"
                                aria-pressed="true"
                                onClick={() => {
                                  setBillingAddressPopup(
                                    Boolean(billingAddressPopup) ? false : true
                                  );
                                }}
                              >
                                {Boolean(billingAddressPopup) && (
                                  <i
                                    className="fa fa-check-circle"
                                    aria-hidden="true"
                                  ></i>
                                )}
                                &nbsp;Billing address is same as shipping
                                address
                              </Link>
                            </div>
                            {Boolean(
                              extraShippingState?.includes(
                                state?.shipping_zone_id
                              )
                            ) && (
                              <div id="tax-info">
                                <div style={{ marginTop: "15px" }}>
                                  <span
                                    style={{
                                      lineHeight: "1.3",
                                      color: "#A84442",
                                      fontWeight: "bold",
                                      fontSize: "14px",
                                      display: "block",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    Your address is in a remote area of the
                                    country. There will be a{" "}
                                    <span className="extra-shipping-charge-value">
                                      $30.00
                                    </span>{" "}
                                    shipping surcharge added to your order.
                                    <br />
                                  </span>
                                  <span
                                    style={{
                                      lineHeight: "1.5",
                                      color: "#05a205",
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                      display: "block",
                                    }}
                                  >
                                    Old Cost: {taxTitle?.Old_Cost} +{" "}
                                    {taxTitle?.extra_shipping_fee}
                                    <span
                                      style={{
                                        fontWeight: "normal",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {" "}
                                      (extra shipping charge){" "}
                                    </span>
                                    {Boolean(package_protection == true) ? (
                                      <>
                                        {"+ "} {packageProtectionValue}
                                        <span
                                          style={{
                                            fontWeight: "normal",
                                            fontSize: "14px",
                                          }}
                                        >
                                          {" "}
                                          (package protection)
                                        </span>
                                      </>
                                    ) : (
                                      <></>
                                    )}{" "}
                                    ={" "}
                                    <span style={{ display: "inline-block" }}>
                                      Total Cost:{totalValue || 0}
                                    </span>
                                  </span>
                                </div>
                                <input
                                  type="hidden"
                                  className="total-cost"
                                  value="$239.94"
                                />
                              </div>
                            )}

                            {Boolean(
                              storeData?.store_id == "15" && stateCode == "TX"
                            ) && (
                              <div id="tax-info">
                                <div style={{ marginTop: "15px" }}>
                                  <span
                                    style={{
                                      lineHeight: "1.3",
                                      color: "#A84442",
                                      fontWeight: "bold",
                                      fontSize: "14px",
                                      display: "block",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    8.25% Tax will be charged if Shipping
                                    Address state would be "Texas".
                                    <br />
                                    <span
                                      style={{
                                        lineHeight: "30px",
                                        color: "#A84442",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        display: "block",
                                      }}
                                    >
                                      Tax Exemption?&nbsp;
                                      <input
                                        type="checkbox"
                                        name="tax"
                                        id="tax"
                                        value={state?.tax}
                                        onChange={handleChange}
                                        onClick={(e) =>
                                          handleStateChange(e, false, true)
                                        }
                                      />
                                      &nbsp;
                                      <span style={{ display: "inline-block" }}>
                                        {" "}
                                        Tax Exemption Number&nbsp;
                                        <input
                                          type="text"
                                          style={{
                                            width: "130px",
                                            lineHeight: "1.5",
                                            color: "black",
                                          }}
                                          value={
                                            state?.tax_exemption_number || ""
                                          }
                                          name="tax_exemption_number"
                                          id="tax_exemption_number"
                                          // placeholder={
                                          //   !Boolean(taxExemption)
                                          //     ? "Tax Exemption Number"
                                          //     : ""
                                          // }
                                          placeholder={
                                            !Boolean(taxExemption)
                                              ? "Tax Exemption Number"
                                              : ""
                                          }
                                          disabled={Boolean(taxExemption)}
                                          // disabled={Boolean(taxExemption)}
                                          // disabled={!Boolean(state?.tax)}
                                          onChange={handleChange}
                                        />
                                        {Boolean(taxNumberError) && (
                                          <label
                                            htmlFor="tax_exemption_number"
                                            generated="true"
                                            className="error"
                                          >
                                            &nbsp;This field is required.
                                          </label>
                                        )}
                                      </span>{" "}
                                      <br />
                                    </span>
                                  </span>

                                  <span
                                    style={{
                                      lineHeight: "1.5",
                                      color: "#05a205",
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                      display: "block",
                                    }}
                                  >
                                    {Boolean(taxExemption) &&
                                      Boolean(taxTitle?.Old_Cost) && (
                                        <>
                                          Old Cost:
                                          {taxTitle?.Old_Cost || 0} {" + "}{" "}
                                          {taxTitle?.tax || 0}
                                          <span
                                            style={{
                                              fontWeight: "normal",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {" "}
                                            (8.25% tax)
                                          </span>{" "}
                                          {package_protection == true ? (
                                            <>
                                              {"+ "} {packageProtectionValue}
                                              <span
                                                style={{
                                                  fontWeight: "normal",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                {" "}
                                                (package protection)
                                              </span>
                                            </>
                                          ) : (
                                            <></>
                                          )}{" "}
                                          ={" "}
                                        </>
                                      )}
                                    {/* {Boolean(taxExemption) &&
                                      Boolean(taxTitle?.Old_Cost) && (
                                        <>
                                          Old Cost:
                                          {taxTitle?.Old_Cost || 0} {" + "}{" "}
                                          {taxTitle?.tax || 0}
                                          <span
                                            style={{
                                              fontWeight: "normal",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {" "}
                                            (8.25% tax)
                                          </span>{" "}
                                          {packageProtectionValue != "" ? (
                                            <>
                                              {"+ "} {packageProtectionValue}
                                              <span
                                                style={{
                                                  fontWeight: "normal",
                                                  fontSize: "14px",
                                                }}
                                              >
                                                {" "}
                                                (package protection)
                                              </span>
                                            </>
                                          ) : (
                                            <></>
                                          )}{" "}
                                          ={" "}
                                        </>
                                      )} */}
                                    <span style={{ display: "inline-block" }}>
                                      Total Cost: {totalValue || 0}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-md-6 billaddr d-md-block "
                        style={{
                          display: Boolean(billingAddressPopup)
                            ? "none"
                            : "block",
                        }}
                      >
                        <div
                          className="form-wrap"
                          style={{ height: "100%", backgroundColor: "#f5f5f5" }}
                        >
                          <h4 className="title">
                            <strong>{translate("Billing")}</strong>
                            {storeData?.language?.name == "English" &&
                              " Address"}
                          </h4>
                          <div className="form-inside">
                            <div className="form-row">
                              <div className="col-12">
                                <label>
                                  {translate("Company Name")} :{" "}
                                  {`(${translate("optional")})`}
                                </label>
                                <input
                                  type="text"
                                  name="billing_company"
                                  id="billing_company"
                                  value={state?.billing_company || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder={translate("Company Name") + ":"}
                                />
                                {errors?.billing_company && (
                                  <span className="text-danger">
                                    {errors?.billing_company}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("First Name")}: *</label>
                                <input
                                  type="text"
                                  name="billing_first_name"
                                  id="billing_first_name"
                                  value={state?.billing_first_name || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder={translate("First Name") + ":"}
                                />
                                {errors?.billing_first_name && (
                                  <span className="text-danger">
                                    {errors?.billing_first_name}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("Last Name")}: *</label>
                                <input
                                  type="text"
                                  name="billing_last_name"
                                  id="billing_last_name"
                                  value={state?.billing_last_name || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder={translate("Last Name") + ":"}
                                />
                                {errors?.billing_last_name && (
                                  <span className="text-danger">
                                    {errors?.billing_last_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-12">
                                <label>{translate("Address")}: *</label>
                                <input
                                  type="text"
                                  id="billing_address_1"
                                  name="billing_address_1"
                                  value={state?.billing_address_1 || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder={translate("addressline1") + " :"}
                                />
                                {errors?.billing_address_1 && (
                                  <span className="text-danger">
                                    {errors?.billing_address_1}
                                  </span>
                                )}
                                <em
                                  style={{
                                    color: "#a10",
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                    display: "block",
                                  }}
                                >
                                  {translate("ship_msg")}
                                </em>
                                <input
                                  type="text"
                                  name="address_2"
                                  id="address_2"
                                  value={state?.billing_address_2 || ""}
                                  onChange={handleChange}
                                  className="form-control mt-2"
                                  placeholder={translate("addressline2") + " :"}
                                />
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("City")}: *</label>
                                <input
                                  type="text"
                                  name="billing_city"
                                  id="billing_city"
                                  value={state?.billing_city || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder={translate("City") + ":"}
                                />
                                {errors?.billing_city && (
                                  <span className="text-danger">
                                    {errors?.billing_city}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("Select state")}: *</label>
                                <select
                                  type="text"
                                  name="billing_zone_id"
                                  id="billing_zone_id"
                                  className="form-control"
                                  value={state?.billing_zone_id || ""}
                                  onChange={handleStateChange}
                                >
                                  <option value="0">
                                    {translate("Select state") + ":"}
                                  </option>
                                  {Boolean(billingStates) &&
                                    Array?.isArray(billingStates) &&
                                    billingStates?.length > 0 &&
                                    billingStates?.map((state) => (
                                      <option
                                        key={state?.id + "billing_zone_id"}
                                        value={state?.id}
                                      >
                                        {state?.name}
                                      </option>
                                    ))}
                                </select>
                                {errors?.billing_zone_id && (
                                  <span className="text-danger">
                                    {errors?.billing_zone_id}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("Postal code")} *</label>
                                <input
                                  type="text"
                                  name="billing_postcode"
                                  id="billing_postcode"
                                  className="form-control"
                                  value={state?.billing_postcode || ""}
                                  onChange={handleChange}
                                  placeholder={translate("Postal code")}
                                />
                                {errors?.billing_postcode && (
                                  <span className="text-danger">
                                    {errors?.billing_postcode}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("Country code")}: *</label>
                                {Boolean(billingCountryLoader) && (
                                  <span>
                                    &nbsp;
                                    <img src="images/smallLoading.gif" alt="" />
                                  </span>
                                )}
                                <select
                                  name="billing_country_id"
                                  id="billing_country_id"
                                  value={
                                    state?.billing_country_id ||
                                    default_selected_country ||
                                    ""
                                  }
                                  className="form-control"
                                  onChange={handleCountryChange}
                                >
                                  <option value="0">
                                    {translate("Select Country")}
                                  </option>

                                  {Boolean(countries) &&
                                    Array?.isArray(countries) &&
                                    countries?.length > 0 &&
                                    countries?.map((country) => (
                                      <option
                                        key={country?.id + "billing_country_id"}
                                        value={country?.id}
                                        id={"billing_" + country.id}
                                      >
                                        {country?.name}
                                      </option>
                                    ))}
                                </select>
                                {errors?.billing_country_id && (
                                  <span className="text-danger">
                                    {errors?.billing_country_id}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="col-md-6">
                                <label>{translate("Phone")}: *</label>
                                <input
                                  type="text"
                                  name="billing_phone"
                                  id="billing_phone"
                                  value={state?.billing_phone || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder={translate("Phone") + ":"}
                                />
                                {errors?.billing_phone && (
                                  <span className="text-danger">
                                    {errors?.billing_phone}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6">
                                <label>{translate("Email")}: *</label>
                                <input
                                  type="text"
                                  name="billing_email"
                                  id="billing_email"
                                  value={state?.billing_email || ""}
                                  onChange={handleChange}
                                  className="form-control"
                                  placeholder={translate("Email") + ":"}
                                />
                                {errors?.billing_email && (
                                  <span className="text-danger">
                                    {errors?.billing_email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row justify-content-md-center mt-50"
                      id="payment-method"
                    >
                      <div className="col-md-8">
                        <div className="checkout-content">
                          {Boolean(loading) ? (
                            <span className="loader-div">
                              <i className="fa fa-cog fa-spin"></i>
                            </span>
                          ) : (
                            <>
                              <div id="cart-total-details">
                                <div
                                  className="table-responsive mb-4"
                                  style={{ maxWidth: "550px", margin: "auto" }}
                                >
                                  <table
                                    className="table table"
                                    style={{
                                      border: "4px solid #f2f2f2",
                                      fontSize: "1.1rem",
                                      fontWeight: "600",
                                    }}
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          colSpan="2"
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                            fontSize: "1.25rem",
                                            fontWeight: "700",
                                          }}
                                        >
                                          <h4 className="text-center mb-0">
                                            {translate("cart_totals")}
                                          </h4>
                                        </td>
                                      </tr>
                                      {Array?.isArray(cartsTotals) &&
                                        cartsTotals?.map((item, i) => (
                                          <tr
                                            style={{ color: "#424242" }}
                                            key={i + "cartstotals"}
                                            className={
                                              item?.key == "total"
                                                ? "checkoutTotal"
                                                : ""
                                            }
                                          >
                                            <td className="p-2">
                                              {item?.text}
                                              {item?.key ==
                                                "package_protection" && " "}
                                              {item?.key ==
                                                "package_protection" && (
                                                // <sup className="package-protection-info-sup">
                                                <Link
                                                  className="package-protection-info-icon"
                                                  href=""
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#package-protection-info-modal"
                                                >
                                                  <i className="fa fa-info"></i>
                                                </Link>
                                                // </sup>
                                              )}
                                              :
                                            </td>
                                            <td className="p-2">
                                              {item?.value_text}
                                              {item?.key ==
                                                "package_protection" && (
                                                <span className="custom-switch d-inline">
                                                  <>
                                                    &nbsp;
                                                    <input
                                                      type="checkbox"
                                                      className="custom-control-input"
                                                      id="orderProtectionOnOffToggle"
                                                      name="orderProtectionOnOffToggle"
                                                      onClick={(e) => {
                                                        checkoutApi(
                                                          e?.target?.checked
                                                        ),
                                                          setUpdateLoader(true);
                                                      }}
                                                      onChange={(e) => {
                                                        checkoutApi(
                                                          e?.target?.checked
                                                        ),
                                                          setUpdateLoader(true);
                                                      }}
                                                      checked={
                                                        package_protection
                                                      }
                                                    />
                                                  </>
                                                  <label
                                                    className="custom-control-label c-pointer"
                                                    htmlFor="orderProtectionOnOffToggle"
                                                  ></label>
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>{" "}
                              </div>{" "}
                            </>
                          )}

                          <div className="package-protection-info-modal">
                            <div
                              className="modal fade"
                              id="package-protection-info-modal"
                              tabIndex="-1"
                              role="dialog"
                              aria-labelledby="myModalLabel"
                              aria-modal="true"
                            >
                              <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <button
                                      type="button"
                                      className="close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    >
                                      <span aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                  <div className="modal-body p-0">
                                    <img
                                      style={{ maxWidth: "100%" }}
                                      src={
                                        `/Images/${language}/productprotection.png` ||
                                        translate("product_protection_image")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="form-wrap">
                            <h4 className="title">
                              {storeData?.language?.code == "en" ? (
                                <strong>{translate("Payment")}</strong>
                              ) : (
                                <>{translate("Payment")}</>
                              )}
                              &nbsp;
                              {translate("method")}{" "}
                              <span className="price pull-right">
                                {totalValue != 0 && (
                                  <>
                                    {translate("Total")}:{" "}
                                    <span
                                      className="order_total"
                                      data-total="644.73"
                                      data-currency-symbol="$"
                                    >
                                      {totalValue || 0}
                                    </span>
                                  </>
                                )}
                              </span>
                            </h4>
                            <div className="form-inside">
                              <div className="inner-wrap">
                                <div className="form-row justify-center">
                                  <ul
                                    className="payment-method-ul d-flex justify-content-center text-center nav nav-tabs payment-options"
                                    role="tab-list"
                                    id="paymentTab"
                                  >
                                    <div
                                      className="checkout_options form-check form-check-inline text-center show active"
                                      data-filter="all"
                                      data-value="creditcard"
                                      role="prensentation"
                                      data-bs-toggle="tab"
                                      aria-selected="true"
                                      tabIndex="-1"
                                      id="creditcard"
                                      data-bs-target="#creditCardTab"
                                      onClick={(e) => {
                                        handleMethodChange("creditcard", e);
                                      }}
                                      style={{ padding: "0px 10px " }}
                                    >
                                      <input
                                        style={{
                                          marginTop: "3px",
                                          appearance: "auto",
                                          width: "0.8em",
                                        }}
                                        className="form-check-input"
                                        type="radio"
                                        name="payment_method_type"
                                        id="btncc"
                                        value="pp_pro_pf"
                                        onChange={(e) => {
                                          handleMethodChange("creditcard", e);
                                        }}
                                        checked={
                                          state?.payment_method_type ==
                                            "creditcard" && "checked"
                                        }
                                      />
                                      <label className="form-check-label">
                                        {translate("CreditCard")}
                                      </label>
                                    </div>

                                    <div
                                      className="checkout_options form-check form-check-inline text-center"
                                      data-value="paypal"
                                      data-bs-toggle="tab"
                                      aria-selected="false"
                                      tabIndex="-1"
                                      id="paypal"
                                      data-bs-target="#payPalTab"
                                      role="presentation"
                                      onClick={(e) => {
                                        handleMethodChange("paypal", e);
                                      }}
                                      style={{ padding: "0px 10px " }}
                                    >
                                      <input
                                        style={{
                                          marginTop: "3px",
                                          appearance: "auto",
                                          width: "0.8em",
                                        }}
                                        className="form-check-input"
                                        type="radio"
                                        name="payment_method_type"
                                        id="btnpp"
                                        value="pp_standard"
                                        onChange={(e) => {
                                          handleMethodChange("paypal", e);
                                        }}
                                        checked={
                                          state?.payment_method_type ==
                                            "paypal" && "checked"
                                        }
                                      />
                                      <label className="form-check-label">
                                        {translate("Paypal")}
                                      </label>
                                    </div>
                                    {storeData?.store_id == "15" && (
                                      <>
                                        <div
                                          className="checkout_options form-check form-check-inline text-center"
                                          id="affirm"
                                          data-bs-toggle="tab"
                                          aria-selected="false"
                                          tabIndex="-1"
                                          data-bs-target="#affirmTab"
                                          data-value="affirm"
                                          onClick={(e) => {
                                            handleMethodChange("affirm", e);
                                          }}
                                          style={{ padding: "0px 10px " }}
                                        >
                                          <input
                                            style={{
                                              marginTop: "3px",
                                              appearance: "auto",
                                              width: "0.8em",
                                            }}
                                            className="form-check-input"
                                            type="radio"
                                            name="payment_method_type"
                                            id="btnaffirm"
                                            value="affirm"
                                            onChange={(e) => {
                                              handleMethodChange("affirm", e);
                                            }}
                                            checked={
                                              state?.payment_method_type ==
                                                "affirm" && "checked"
                                            }
                                          />
                                          <label className="form-check-label">
                                            {translate("Affirm")}
                                          </label>
                                        </div>

                                        <div
                                          className="checkout_options form-check form-check-inline text-center"
                                          data-value="cheque"
                                          id="cheque"
                                          data-bs-toggle="tab"
                                          aria-selected="false"
                                          tabIndex="-1"
                                          data-bs-target="#checkTab"
                                          role="presentation"
                                          onClick={(e) => {
                                            handleMethodChange("cheque", e);
                                          }}
                                          style={{ padding: "0px 10px " }}
                                        >
                                          <input
                                            style={{
                                              marginTop: "3px",
                                              appearance: "auto",
                                              width: "0.8em",
                                            }}
                                            className="form-check-input"
                                            type="radio"
                                            name="payment_method_type"
                                            id="btnpo"
                                            value="cheque"
                                            onChange={(e) => {
                                              handleMethodChange("cheque", e);
                                            }}
                                            checked={
                                              state?.payment_method_type ==
                                                "cheque" && "checked"
                                            }
                                          />
                                          <label className="form-check-label">
                                            {translate("Check/PO")}
                                          </label>
                                        </div>
                                      </>
                                    )}
                                  </ul>
                                </div>

                                {/* {error?.error?.message && (
                                  <div id="notification">
                                    <div className="warning alert alert-danger">
                                      {error?.error?.message}
                                    </div>
                                  </div>
                                )} */}

                                <div
                                  className="tab-content"
                                  id="paymentTabContent"
                                >
                                  <div
                                    id="creditCardTab"
                                    className="tab-pane fade show active"
                                  >
                                    <div className="form_cc">
                                      <div id="dropin-card-container"></div>
                                      <div className="form-row">
                                        <div className="col-12">
                                          <label>
                                            {translate("card_name")}:
                                          </label>
                                          <input
                                            type="text"
                                            id="card_holder_name"
                                            name="card_holder_name"
                                            className="required form-control"
                                            value={
                                              state?.card_holder_name || ""
                                            }
                                            onChange={handleChange}
                                          />
                                          {errors?.card_holder_name && (
                                            <span className="text-danger">
                                              {errors?.card_holder_name}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="form-row">
                                        <div className="col-12">
                                          <label>
                                            {translate("card_number")}:
                                          </label>
                                          <input
                                            type="text"
                                            id="card_no"
                                            name="card_no"
                                            inputMode="decimal"
                                            pattern="\d*"
                                            className="required creditcard number form-control"
                                            autoComplete="off"
                                            maxLength="19"
                                            value={state?.card_no || ""}
                                            onChange={handleChange}
                                          />
                                          {errors?.card_no && (
                                            <span className="text-danger">
                                              {errors?.card_no}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="form-row">
                                        <div className="col-md-6">
                                          <label>
                                            {translate("card_date")}:
                                          </label>
                                          <div className="form-row">
                                            <div className="col-md-6">
                                              <select
                                                className="required select2 custom-select"
                                                id="expiry_month"
                                                name="expiry_month"
                                                onChange={handleChange}
                                                value={
                                                  state?.expiry_month || ""
                                                }
                                              >
                                                <option value="">
                                                  {translate("month")}
                                                </option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                                <option value="11">11</option>
                                                <option value="12">12</option>
                                              </select>
                                              {errors?.expiry_month && (
                                                <span className="text-danger">
                                                  {errors?.expiry_month}
                                                </span>
                                              )}
                                            </div>
                                            <div className="col-md-6">
                                              <select
                                                id="expiry_year"
                                                name="expiry_year"
                                                value={state?.expiry_year || ""}
                                                onChange={handleChange}
                                                className="required select2 custom-select"
                                              >
                                                <option value="">
                                                  {translate("year")}
                                                </option>
                                                {Array(10)
                                                  .fill(1)
                                                  .map((s, i) => (
                                                    <option
                                                      key={
                                                        currentYear + i + "year"
                                                      }
                                                      value={currentYear + i}
                                                    >
                                                      {currentYear + i}
                                                    </option>
                                                  ))}
                                              </select>
                                              {errors?.expiry_year && (
                                                <span className="text-danger">
                                                  {errors?.expiry_year}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <label>
                                            {translate("card_cvv")}:
                                          </label>
                                          <div className="inline-field d-flex align-items-center">
                                            <input
                                              type="text"
                                              inputMode="decimal"
                                              pattern="\d*"
                                              id="cvv"
                                              name="cvv"
                                              size="4"
                                              className="txtcvv required number form-control"
                                              value={state?.cvv || ""}
                                              onChange={handleChange}
                                            />
                                            <div>
                                              <Link
                                                href={""}
                                                data-bs-toggle="modal"
                                                className="c-pointer"
                                                data-bs-target="#cvvDialogId"
                                              >
                                                {translate("what_cvv")}
                                              </Link>
                                            </div>
                                          </div>
                                          {errors?.cvv && (
                                            <span className="text-danger">
                                              {errors?.cvv}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    id="payPalTab"
                                    className="tab-pane fade mb-2"
                                  >
                                    <div className="pp_info">
                                      <p
                                        style={{
                                          padding: "10px",
                                          border: "1px dashed #f45d01",
                                          color: "#f45d01",
                                          textAlign: "center",
                                        }}
                                      >
                                        {translate("paypal_msg")}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    id="checkTab"
                                    className="tab-pane fade mb-2"
                                  >
                                    <div className="affirm_info">
                                      <p
                                        style={{
                                          padding: "10px",
                                          border: "1px dashed #f45d01",
                                          color: "#f45d01",
                                          textAlign: "center",
                                        }}
                                      >
                                        {translate("check/po_msg")}
                                      </p>
                                      <div className="checkout_obj"></div>
                                    </div>
                                  </div>
                                  <div id="affirmTab" className="tab-pane mb-2">
                                    <div className="po_info">
                                      <p
                                        style={{
                                          padding: "10px",
                                          border: "1px dashed #f45d01",
                                          color: "#f45d01",
                                          textAlign: "center",
                                        }}
                                      >
                                        {translate("affirm_msg")}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="form-row justify-center">
                                  <div className="custom-control custom-checkbox privacy">
                                    <input
                                      type="checkbox"
                                      id="chkterms"
                                      name="termsconditions"
                                      className="custom-control-input required"
                                      value={state?.termsconditions || false}
                                      checked={state?.termsconditions}
                                      onChange={handleChange}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="chkterms"
                                    >
                                      {translate("accept_condtion")}{" "}
                                      <Link
                                        href={""}
                                        data-bs-toggle="modal"
                                        data-bs-target="#terms_dialog"
                                      >
                                        {translate("terms_condition")}
                                      </Link>
                                    </label>
                                    <div className="text-left">
                                      {errors?.termsconditions && (
                                        <span className="text-danger">
                                          {errors?.termsconditions}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="btn-wrap">
                                  {(state?.payment_method_type ===
                                    "creditcard" ||
                                    state?.payment_method_type ===
                                      "cheque") && (
                                    <button
                                      type="submit"
                                      disabled={
                                        Boolean(loadingPayment) && "disabled"
                                      }
                                      className="btn btn-blue btnsubmit checkoutBtn"
                                    >
                                      {translate("submit_order")}
                                    </button>
                                  )}
                                  {state?.payment_method_type == "paypal" && (
                                    <button
                                      type="submit"
                                      disabled={
                                        Boolean(loadingPayment) && "disabled"
                                      }
                                      className="btn btnsubmit p-0 btnpaypal"
                                    >
                                      <img
                                        className="w-100"
                                        src="https://d68my205fyswa.cloudfront.net/paypal-checkout.png"
                                      />
                                    </button>
                                  )}
                                  {state?.payment_method_type == "affirm" && (
                                    <button
                                      type="submit"
                                      disabled={
                                        Boolean(loadingPayment) && "disabled"
                                      }
                                      className="btn btnsubmit p-0 checkout-btn-affirm"
                                    >
                                      <img
                                        className="w-100"
                                        src="https://d68my205fyswa.cloudfront.net/affirm-checkout.png"
                                      />
                                    </button>
                                  )}
                                  {Boolean(loadingPayment) && (
                                    <span className="wait d-inline-block">
                                      &nbsp;
                                      <img
                                        src="https://d68my205fyswa.cloudfront.net/loading.gif"
                                        alt=""
                                      />
                                      &nbsp; Please wait...
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="modal fade"
                            id="terms_dialog"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="terms_ModalLabel"
                          >
                            <div
                              className="modal-dialog modal-lg modal-dialog-scrollable"
                              role="document"
                            >
                              <div className="modal-content">
                                <div className="modal-header">
                                  <button
                                    type="button"
                                    className="close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">×</span>
                                  </button>
                                  <h4
                                    className="modal-title"
                                    id="terms_ModalLabel"
                                  >
                                    {storeData?.store_name}
                                  </h4>
                                </div>
                                <div className="modal-body terms_modal_body">
                                  <TermsAndCondition />
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-default"
                                    data-bs-dismiss="modal"
                                  >
                                    {translate("close")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="modal fade"
                            id="cvvDialogId"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="cvv_ModalLabel"
                          >
                            <div
                              className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                              role="document"
                            >
                              <div className="modal-content">
                                <div className="modal-header">
                                  <button
                                    type="button"
                                    className="close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  >
                                    <span aria-hidden="true">×</span>
                                  </button>
                                  <h4
                                    className="modal-title"
                                    id="cvv_ModalLabel"
                                  >
                                    {translate("cvv_code")}
                                  </h4>
                                </div>
                                <div className="modal-body text-center">
                                  <p>
                                    <img
                                      src="https://d68my205fyswa.cloudfront.net/ccf-static-R92GfJNwg5BjzYUeNYibw5un.png"
                                      className="img-fluid"
                                    />
                                  </p>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-default"
                                    data-bs-dismiss="modal"
                                  >
                                    {translate("close")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <br />
                  {Boolean(successpayment) &&
                    state?.payment_method_type == "cheque" && (
                      <div className="poForm">
                        <h2>Mail a Check/PO Instructions</h2>
                        <div className="content">
                          <p>
                            <b>Make Payable To: </b>
                          </p>
                          <p>{storeData?.payable_to}</p>
                          <b>Send To: </b>
                          <br />
                          <p>{storeData?.address}</p>
                          <p>
                            Your order will not ship until we receive payment.
                          </p>
                        </div>
                        <div className="buttons">
                          <div className="right">
                            <input
                              type="button"
                              value="Confirm Order"
                              id="button-confirm"
                              className="button"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* <Script src="https://js.stripe.com/v2/" strategy="beforeInteractive" /> */}
    </>
  );
};

export default Checkout;
