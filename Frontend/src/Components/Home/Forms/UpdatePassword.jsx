import React from "react";
import "../../../Styles/Home/Forms.css";

const UpdatePassword = () => {


  return (
    <div className="update-password w80 h90 d-flex-col">
      <span className="heading t-center">Update New Password</span>
      <form className="login-form w100 h50 d-flex-col">
        <div className="data-div w100">
          <span className="text">Enter Password</span>
          <input
            type="password"
            name="user_password"
            className="data"
            required
          />
        </div>
        <div className="data-div w100">
          <span className="text">Confirm Password</span>
          <input
            type="password"
            name="user_password"
            className="data"
            required
          />
        </div>
        <button onClick={""} className="form-btn" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
