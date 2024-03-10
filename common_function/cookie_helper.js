export const setSessionAxios = async (req) => {
  if (req && req?.cookies?.node_session) {
    // console.log("=-=-=-=-=====================",req?.cookies?.node_session);
    return {
      Cookie: "node_session=" + req?.cookies?.node_session,
    };
  } else if (req && !req?.cookies?.node_session) {
    return {
      Cookie: "",
    };
  }
};

export const setSessionRes = (resHeaders, res) => {
  if (resHeaders && res && resHeaders["set-cookie"]) {
    res?.setHeader("set-cookie", resHeaders["set-cookie"]); // to set cookie in browser using next response headers in getServerSideProps
  }
};

export const getCookie = (name = "node_session") => {
  // console.log(typeof window !== "undefined");
  if (typeof window !== "undefined") {
    let nameEq = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    console.log(ca);
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(nameEq) === 0) {
        return c.substring(nameEq.length, c.length);
      }
    }
  }
  return "";
};
