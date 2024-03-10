import React from "react";

import { wrapper } from "redux/store";
import ProductDetails from "../../component/productdetail/ProductDetails";

export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async (context) => {
          const language = store?.getState()?.common?.store?.language?.name;
            return {
                props: {
                    ...(await serverSideTranslations(language || 'English', ['home', 'footerpage', 'product'])),
                },
            }
        }
)

const productdetails = () => {
  return (
    <>
      <ProductDetails />
    </>
  );
};

export default productdetails;
