import React, { useMemo, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import styles from "./CheckOutForm.module.css";
import { useRouter } from "next/router";
import { url } from "../../api/Apiservices";

const useOptions = () => {
  const options = useMemo(() => ({
    style: {
      base: {
        color: "#424770",
        letterSpacing: "0.025em",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }));

  return options;
};

const CheckOutFrom = (props) => {
  const {
    cname,
    address,
    payment_method_type = "card",
    cityCode,
    countryCode,
    email,
    lname,
    phone,
    postCode,
    stateCode,
    fname,
    billingAddressCityCode,
    billingAddressCompanyName,
    billingAddressCountrycode,
    billingAddressEmail,
    billingAddressFirstName,
    billingAddressLastName,
    billingAddressPhone,
    billingAddressPostalCode,
    billingAddressStateCode,
    billingAddressone,
  } = props?.props;

  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();
  const [message, setMesage] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const router = useRouter();

  const handleCardDetailsChange = (event) => {
    event.error ? setCheckoutError(event.error.message) : setCheckoutError();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (payment_method_type == "paypal") {
        const data = {
          payment_method_type: "paypal",
          payment_method: "paypal",
          shipping_address: [
            {
              company_name: cname,
              e_mail: email,
              phone: phone,
              last_name: lname,
              state: stateCode,
              city: cityCode,
              postal_code: postCode,
              first_name: fname,
              country: countryCode,
            },
          ],
          billing_address: [
            {
              company_name: billingAddressCompanyName,
              last_name: billingAddressLastName,
              first_name: billingAddressFirstName,
              city: billingAddressCityCode,
              country: billingAddressCountrycode,
              e_mail: billingAddressEmail,
              postal_code: billingAddressPostalCode,
              state: billingAddressStateCode,
              phone: billingAddressPhone,
            },
          ],
          shipping: {
            name: "Jenny Rosen",
            address: {
              line1: "510 Townsend St",
              postal_code: "98140",
              city: "San Francisco",
              state: "CA",
              country: "US",
            },
          },
        };

        await axios
          .post(`${url}/order`, data, {
            withCredentials: true,
          })
          .then((res) => {
            router.push(res.data);
            setMesage(res.data);
          })
          .catch((err) => {});
      } else if (payment_method_type == "card") {
        const cardElement = elements.getElement(CardNumberElement);
        const billingDetails = {
          name: "John",
          email: "john@example.com",
          address: {
            city: "New York",
            line1: "896 Bell Street",
            state: "New York",
            postal_code: "10022",
          },
        };

        const paymentMethodReq = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: billingDetails,
        });

        const data = {
          payment_method: paymentMethodReq.paymentMethod.id,
          payment_method_type: "card",
          shipping_address: [
            {
              company_name: cname,
              e_mail: email,
              phone: phone,
              last_name: lname,
              state: stateCode,
              city: cityCode,
              postal_code: postCode,
              first_name: fname,
              country: countryCode,
            },
          ],
          billing_address: [
            {
              company_name: billingAddressCompanyName,
              last_name: billingAddressLastName,
              first_name: billingAddressFirstName,
              city: billingAddressCityCode,
              country: billingAddressCountrycode,
              e_mail: billingAddressEmail,
              postal_code: billingAddressPostalCode,
              state: billingAddressStateCode,
              phone: billingAddressPhone,
            },
          ],
          shipping: {
            name: "Jenny Rosen",
            address: {
              line1: "510 Townsend St",
              postal_code: "98140",
              city: "San Francisco",
              state: "CA",
              country: "US",
            },
          },
        };
        await axios
          .post(`${url}/order`, data, {
            withCredentials: true,
          })
          .then((res) => {
            router?.push(res.data);
          })
          .catch((err) => {});
      }
    } catch (error) {}
  };
  return (
    <>
      {payment_method_type == "card" ? (
        <form onSubmit={handleSubmit}>
          <div className={styles.checkOutBox}>
            <div className={styles.CheckOutFrom}>
              <span>Card number</span>
              <div>
                <label>
                  <CardNumberElement
                    options={options}
                    className={styles.cardElement}
                    onChange={handleCardDetailsChange}
                  />
                </label>
              </div>
              <span>Expiration date</span>
              <div className={styles.cardElement}>
                <label>
                  <CardExpiryElement
                    options={options}
                    className={styles.cardElement}
                    onChange={handleCardDetailsChange}
                  />
                </label>
              </div>
              <span>CVC</span>
              <div className={styles.cardElement}>
                <label>
                  <CardCvcElement
                    options={options}
                    className={styles.cardElement}
                    onChange={handleCardDetailsChange}
                  />
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isProcessing || !stripe}
              >
                Submit Order
              </button>
              <h6 style={{ color: "green" }}>{message}</h6>
            </div>
          </div>
        </form>
      ) : (
        <div className={`${styles["btn-wrap"]}`}>
          <button
            type="submit"
            className="btn btn-blue btnsubmit checkoutBtn"
            disabled={isProcessing || !stripe}
            onClick={handleSubmit}
          >
            <img src="https://d68my205fyswa.cloudfront.net/paypal-checkout.png" />
          </button>
        </div>
      )}
    </>
  );
};

export default CheckOutFrom;
