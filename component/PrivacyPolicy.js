import React from "react";
import PrivacyPolicy15 from "./common Privacy and Policy/PrivacyPolicy15";
import PrivacyPolicy20 from "./common Privacy and Policy/PrivacyPolicy20";
import PrivacyPolicy25 from "./common Privacy and Policy/PrivacyPolicy25";
import PrivacyPolicy30 from "./common Privacy and Policy/PrivacyPolicy30";
import PrivacyPolicy35 from "./common Privacy and Policy/PrivacyPolicy35";
import PrivacyPolicy40 from "./common Privacy and Policy/PrivacyPolicy40";
import PrivacyPolicy45 from "./common Privacy and Policy/PrivacyPolicy45";
import PrivacyPolicy50 from "./common Privacy and Policy/PrivacyPolicy50";
import { useSelector } from "react-redux";

const PrivacyPolicy = () => {
  const storeData = useSelector((state) => state?.common?.store);

  const PrivacyPolicySwitch = () => {
    switch(storeData?.store_id){
      case 15 :
        return <PrivacyPolicy15 />
      
      case 20 :
        return <PrivacyPolicy20 />

      case 25 :
        return <PrivacyPolicy25 />

      case 30 :
        return <PrivacyPolicy30 />

      case 35 :
        return <PrivacyPolicy35 />
      
      case 40 : 
        return <PrivacyPolicy40 />

      case 45 :
        return <PrivacyPolicy45 />

      case 50 :
        return <PrivacyPolicy50 />

      default :
        return <></>
    }
  }
  return (
    <>
      {PrivacyPolicySwitch()}
    </>
  );
};

export default PrivacyPolicy;
