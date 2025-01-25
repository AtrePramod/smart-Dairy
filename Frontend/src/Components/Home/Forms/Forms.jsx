// import React, { useState } from "react";
// import Login from "./Login";
// import Register from "./Register";
// import logo from "../../../assets/samrtdairylogo.png";
// import "../../../Styles/Home/Forms.css";
//
// const Forms = () => {
//   const [isLoginForm, setIsLoginForm] = useState(true);
//
//   const switchToLogin = () => {
//     setIsLoginForm(true);
//   };
//
//   const switchToRegister = () => {
//     setIsLoginForm(false);
//   };
//
//
//   return (
//     <>
//       <div className="auth-container w100 h1 d-flex-col center">
//         <div className="app-logo-div w100 h10 d-flex center">
//           <img className="applogo" src={logo} alt="smartdairylogo" />
//         </div>
//         {isLoginForm ? (
//           <Login switchToRegister={switchToRegister} />
//         ) : (
//           <Register switchToLogin={switchToLogin} />
//         )}
//       </div>
//     </>
//   );
// };
//
// export default Forms;

import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
// import ForgotPassword from "./ForgotPassword"; // Create this component
import logo from "../../../assets/samrtdairylogo.png";
import "../../../Styles/Home/Forms.css";
import SendOtp from "./SendOtp";
import VerifyOtp from "./ConfirmOtp";
import UpdatePassword from "./UpdatePassword";

const Forms = () => {
  const [currentForm, setCurrentForm] = useState("login"); // Manage multiple forms

  const switchToLogin = () => {
    setCurrentForm("login");
  };

  const switchToRegister = () => {
    setCurrentForm("register");
  };

  const switchToOptSend = () => {
    setCurrentForm("SendOtp");
  };
  const switchVerify = () => {
    setCurrentForm("VerifyOtp");
  };
  const switchToUpdatePassword = () => {
    setCurrentForm("forgotPassword");
  };

  return (
    <>
      <div className="auth-container w100 h1 d-flex-col center">
        <div className="app-logo-div w100 h10 d-flex center">
          <img className="applogo" src={logo} alt="smartdairylogo" />
        </div>
        <div className="forms-container-div w100 h90 d-flex-col center">
          {currentForm === "login" && (
            <Login
              switchToRegister={switchToRegister}
              switchToOptSend={switchToOptSend}
            />
          )}
          {currentForm === "register" && (
            <Register switchToLogin={switchToLogin} />
          )}
          {currentForm === "SendOtp" && <SendOtp switchVerify={switchVerify} />}
          {currentForm === "VerifyOtp" && (
            <VerifyOtp switchToUpdatePassword={switchToUpdatePassword} />
          )}
        </div>
      </div>
    </>
  );
};

export default Forms;
