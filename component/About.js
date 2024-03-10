import React from "react";
import About15 from "./common about-us/About15";
import About20 from "./common about-us/About20";
import About25 from "./common about-us/About25";
import About30 from "./common about-us/About30";
import About35 from "./common about-us/About35";
import About40 from "./common about-us/About40";
import About45 from "./common about-us/About45";
import About50 from "./common about-us/About50";
import { useSelector } from "react-redux";

const About = () => {
  const storeData = useSelector((state) => state?.common?.store);

  const AboutSwitch = () => {
    switch(storeData?.store_id){
      case 15 :
        return <About15 />
      
      case 20 :
        return <About20 />

      case 25 :
        return <About25 />

      case 30 :
        return <About30 />

      case 35 :
        return <About35 />
      
      case 40 : 
        return <About40 />

      case 45 :
        return <About45 />

      case 50 :
        return <About50 />

      default :
        return <></>
    }
  }
  return (
    <>
      {AboutSwitch()}
    </>
  );
};

export default About;
