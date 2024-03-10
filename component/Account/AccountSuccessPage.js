import Link from "next/link";
import React from "react";

const AccountSuccessPage = () => {
  return (
    <>
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="https://www.carcoversfactory.com/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="https://www.carcoversfactory.com/account">
                    Account
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="https://www.carcoversfactory.com/index.php?route=account/success">
                    Success
                  </Link>
                </li>
              </ol>
            </nav>

            <div id="content">
              {" "}
              <h1>Your Account Has Been Created!</h1>
              <div className="holder">
                <p>Thank you for registering with CarCoversFactory.com!</p>
                <p>
                  You will be notified by email once your account has been
                  activated by the store owner.
                </p>
                <p>
                  If you have ANY questions about the operation of this online
                  shop, please{" "}
                  <Link href="/contact">contact the store owner</Link>.
                </p>

                <div className="buttons">
                  <div className="right">
                    <Link href="/login" className="btn btn-warning text-white">
                      Continue
                    </Link>
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

export default AccountSuccessPage;
