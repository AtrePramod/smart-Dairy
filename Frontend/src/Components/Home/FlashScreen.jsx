import React from "react";
import applogo from "../../assets/samrtdairylogo.png";

const FalshScreen = () => {
  return (
    <div className="w100 h100 d-flex-col center bg1">
      <span className="f-heading my10">Welcome To Smartdairy</span>
      <img src={applogo} alt="" width={"100px"} height={"100px"} />
      <span className="label-text">Powerd by Vikern Software Technology</span>
    </div>
  );
};

export default FalshScreen;
