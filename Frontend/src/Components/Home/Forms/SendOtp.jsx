import React from "react";
import "../../../Styles/Home/Forms.css";

const SendOtp = ({switchVerify}) => {
  return (
    <form className="update-container w80 h90 d-flex-col a-center">
      <span className="heading t-center">Forget Password</span>
      <span className="info-text t-center my10">Send OTP on vsivXXXXX@gmail.com</span>
      <button onClick={switchVerify} type="submit" className="w50 form-btn">
        Send
      </button>
    </form>
  );
};

export default SendOtp;
