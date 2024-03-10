import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import BodyTag from "../component/BodyTag";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="preload"
          href={"/font/avenirnextltpro-bold-webfont.woff2"}
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href={"/font/AvenirNextLTPro-DemiCn.woff"}
          as="font"
          crossOrigin="anonymous"
          type="font/woff"
        />
        <link
          rel="preload"
          href={"/font/avenirnextltpro-demicnit-webfont.woff2"}
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href={"/font/avenirnextltpro-mediumcn-webfont.woff2"}
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href={"/font/AvenirNextLTPro-Regular.woff"}
          as="font"
          crossOrigin="anonymous"
          type="font/woff"
        />
        <link
          rel="preload"
          href={"/font/fontawesome-webfont.woff2"}
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link rel="stylesheet" href="/css/font.css" key="main" />

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          // integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossOrigin="anonymous"
        />

        {/* <link rel="stylesheet" href="/css/carcovers.css" /> */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/category-menu.css" />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* <BodyTag /> */}

        <Script
          src="/bootstrap/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        ></Script>
        <Script
          src="/bootstrap/jquery-3.2.1.slim.min.js"
          strategy="beforeInteractive"
        ></Script>
        <Script
          src="/bootstrap/popper.min.js"
          strategy="beforeInteractive"
        ></Script>
        <Script
          src="/bootstrap/bootstrap.min.js"
          strategy="beforeInteractive"
        ></Script>

        {/* <Script
          src="https://js.stripe.com/v2/"
          strategy="beforeInteractive"
        /> */}
      </body>
    </Html>
  );
}
