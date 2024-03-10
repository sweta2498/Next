import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "./../component/Header/index";
import Footer from "../component/Footer/Footer";
import Link from "next/link";

export default function Custom404({ categoryData }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router?.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   // router?.push("/"+router?.query?.category+'/'+router?.query?.year+'/'+router?.query?.make+'/'+router?.query?.model+'/'+router?.query?.body+'/'+ router?.query?.slug);
  //   // const timer = setTimeout(() => {
  //   //   router?.push("/"+router?.query?.category+'/'+router?.query?.year+'/'+router?.query?.make+'/'+router?.query?.model+'/'+router?.query?.body+'/'+ router?.query?.slug);
  //   // }, 1000);
  //   // return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      <Header categoryData={categoryData} />
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="d-flex flex-column align-items-center">
          <h1>
            Welcome to <span style={{ color: "green" }}>carcoversfactory</span>
          </h1>

          <p>Sorry &cedil; The page you are looking for can&apos;t be found</p>

          <p>Try checking your URL</p>

          <h2>
            This is a <span style={{ color: "red" }}>404 page</span>
          </h2>

          <h5>Redirecting Home page</h5>
          <img
            src="https://d68my205fyswa.cloudfront.net/loading.gif"
            alt="loading"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
