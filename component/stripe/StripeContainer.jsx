import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutFrom from "./CheckOutFrom";

const PUBLIC_KEY =
  "pk_test_51IvdjGSBmFmiKlBdvjqb5Pb8TDJEkPZCy9yjdVTow4IC1RZWOQ0MnJJStkzWzZPyaU5p4h8ehxeR7njn5UdNWwet00pkZL315z";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckOutFrom />
    </Elements>
  );
};

export default StripeContainer;
