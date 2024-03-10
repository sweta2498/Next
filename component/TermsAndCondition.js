import React from "react";
import { useSelector } from "react-redux";
import TermsAndCondition15 from "./common terms and condition/TermsAndCondition15";
import TermsAndCondition20 from "./common terms and condition/TermsAndCondition20";
import TermsAndCondition25 from "./common terms and condition/TermsAndCondition25";
import TermsAndCondition30 from "./common terms and condition/TermsAndCondition30";
import TermsAndCondition35 from "./common terms and condition/TermsAndCondition35";
import TermsAndCondition40 from "./common terms and condition/TermsAndCondition40";
import TermsAndCondition45 from "./common terms and condition/TermsAndCondition45";
import TermsAndCondition50 from "./common terms and condition/TermsAndCondition50";

const TermsAndCondition = () => {
  const storeData = useSelector((state) => state?.common?.store);

  const TermsandConditionSwitch = () => {
    switch(storeData?.store_id){
      case 15 :
        return <TermsAndCondition15 />
      
      case 20 :
        return <TermsAndCondition20 />

      case 25 :
        return <TermsAndCondition25 />

      case 30 :
        return <TermsAndCondition30 />

      case 35 :
        return <TermsAndCondition35 />
      
      case 40 : 
        return <TermsAndCondition40 />

      case 45 :
        return <TermsAndCondition45 />

      case 50 :
        return <TermsAndCondition50 />

      default :
        return <></>
    }
  }
  return (
    <>
      {TermsandConditionSwitch()}
    </>
  );
};

export default TermsAndCondition;
