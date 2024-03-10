import React from "react";

const Error_500 = () => {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', 'Fira Sans', Avenir, 'Helvetica Neue', 'Lucida Grande', sans-serif",
        height: "100vh",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <h1
          className="next-error-h1"
          style={{
            display: "inline-block",
            margin: 0,
            marginRight: "20px",
            padding: "0 23px 0 0",
            fontSize: "24px",
            fontWeight: 500,
            verticalAlign: "top",
            lineHeight: "49px",
            borderRight: "2px solid",
            paddingRight: "3px !important",
            marginRight: "3px !important",
          }}
        >
          500
        </h1>
        <div
          style={{
            display: "inline-block",
            textAlign: "left",
            lineHeight: "49px",
            height: "49px",
            verticalAlign: "middle",
          }}
        >
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "normal",
              lineHeight: "49px",
              margin: 0,
              padding: 0,
            }}
          >
            There has been an error.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Error_500;
