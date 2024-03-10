import React from "react";
import Footer from "../../component/Footer/Footer";
import Header from "../../component/Header/index";
import Link from "next/link";

const index = () => {
  return (
    <>
      <Header categoryData={categoryData} />
      <section className="page-content single-wrapper">
        <div className="container">
          <div className="inner-wrap" style={{ backgroundColor: "#fff" }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="https://www.carcoversfactory.com/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="https://www.carcoversfactory.com/cart?gcart=">
                    Shopping Cart
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="https://www.carcoversfactory.com/checkout">
                    Checkout
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="https://www.carcoversfactory.com/checkout-success">
                    Success
                  </Link>
                </li>
              </ol>
            </nav>
            <div id="content">
              <h1>Your Order Has Been Processed!</h1>
              <div className="holder">
                <div style={{ fontsize: "12px", color: "#000000" }}>
                  <div
                    style={{ width: "680px", margin: "0 auto" }}
                    className="receipt-table"
                  >
                    <p
                      style={{
                        marginTop: "0px",
                        marginBottom: "20px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      Thank you for your interest in CarCoversFactory.com
                      products. A tracking number will be emailed to you once it
                      has been generated.
                    </p>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        borderTop: "1px solid #DDDDDD",
                        borderLeft: "1px solid #DDDDDD",
                        marginBottom: "20px",
                      }}
                    >
                      <thead>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "left",
                              padding: "7px",
                              color: "#222222",
                            }}
                            colspan="2"
                          >
                            Order Details
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "left",
                              padding: "7px",
                            }}
                          >
                            <b>Order ID:</b> 1426536
                            <br />
                            <b>Date Added:</b> 12/20/2022
                            <br />
                            <b>Payment Method:</b> Mail a Check/PO
                            <br />
                            <b>Delivery Date:</b> Fri 23 Dec, 2022
                            <br />
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "left",
                              padding: "7px",
                            }}
                          >
                            <b>Email:</b> adsfsdfsdfadf@gmail.com
                            <br />
                            <b>Telephone:</b> qwerqewr
                            <br />
                            <b>IP Address:</b> 10.25.2.33
                            <br />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        borderTop: "1px solid #DDDDDD",
                        borderLeft: "1px solid #DDDDDD",
                        marginBottom: "20px",
                      }}
                    >
                      <thead>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "left",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Instructions
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "left",
                              padding: "7px",
                            }}
                          >
                            <b>Make Payable To: </b>
                            <br />
                            ASA Brands Inc
                            <br />
                            <br />
                            <b>Send To: </b>
                            <br />
                            4000 Greenbriar Dr
                            <br />
                            Ste 200
                            <br />
                            Stafford, TX 77477
                            <br />
                            <br />
                            Your order will not ship until we receive payment.
                            <br />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        borderTop: "1px solid #DDDDDD",
                        borderLeft: "1px solid #DDDDDD",
                        marginBottom: "20px",
                      }}
                    >
                      <thead>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "left",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Billing Address
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "left",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Shipping Address
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "left",
                              padding: "7px",
                            }}
                          >
                            erwqewrqwer qewrqwer
                            <br />
                            qewrqwerqwe
                            <br />
                            rqewrqewr
                            <br />
                            wweqrw
                            <br />
                            qwerwq werew
                            <br />
                            Nord-Trondelag
                            <br />
                            Norway
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "left",
                              padding: "7px",
                            }}
                          >
                            erwqewrqwer qewrqwer
                            <br />
                            qewrqwerqwe
                            <br />
                            rqewrqewr
                            <br />
                            wweqrw
                            <br />
                            qwerwq werew
                            <br />
                            Nord-Trondelag
                            <br />
                            Norway
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        borderTop: "1px solid #DDDDDD",
                        borderLeft: "1px solid #DDDDDD",
                        marginBottom: "20px",
                      }}
                    >
                      <thead>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "left",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Product
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "left",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Model
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "right",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Quantity
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "right",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Price
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              backgroundColor: "#EFEFEF",
                              fontWeight: "bold",
                              textAlign: "right",
                              padding: "7px",
                              color: "#222222",
                            }}
                          >
                            Total
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "left",
                              padding: "7px",
                            }}
                          >
                            Standard Edition Truck Cover <br />
                            &nbsp;<small> - Year: 2021</small>
                            <br />
                            &nbsp;<small> - Make: GWM</small>
                            <br />
                            &nbsp;<small> - Model: Cannon L 4x4</small>
                            <br />
                            &nbsp;
                            <small>
                              {" "}
                              - Body: Dual Cab with 5.5ft Short Bed and Camper
                              Shell
                            </small>
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "left",
                              padding: "7px",
                            }}
                          >
                            CARCF-11
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                            }}
                          >
                            1
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                            }}
                          >
                            $154.95
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                            }}
                          >
                            $154.95
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                              colspan: "4",
                            }}
                          >
                            <b>Sub-Total:</b>
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                            }}
                          >
                            $154.95
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                            }}
                          >
                            <b>Delivery date Fri 23 Dec, 2022:</b>
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                            }}
                          >
                            $0.00
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                              colspan: "4",
                            }}
                          >
                            <b>Total:</b>
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              borderRight: "1px solid #DDDDDD",
                              borderBottom: "1px solid #DDDDDD",
                              textAlign: "right",
                              padding: "7px",
                            }}
                          >
                            $154.95
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <p>Your order has been successfully processed!</p>
                <p>Thanks for shopping with us online!</p>
                <div className="buttons">
                  <div className="right">
                    <Link
                      href="https://www.carcoversfactory.com/"
                      className="btn btn-warning text-white"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default index;
