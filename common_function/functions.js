export const createMarkup = (htmlContent) => {
  return { __html: htmlContent };
};

export function debounce(func, timeout = 500){
  let timer;
  return (...args) => {
    console.log("called");
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

let timezoneOffsets = {
  "cet": 3,
  "moscow" : -9.48,
  "cst": -5,
}

export const timeZone = (offset) => {
  let date = new Date();
  let utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  // let timeOffset = Offset;
  let TimeZone = new Date(utcTime + (3600000 * timezoneOffsets?.[offset]));
  return TimeZone;
}

export const tawkToToggle = () => {
  if(window !== "undefined"){
    window.Tawk_API.toggle()
  }
}