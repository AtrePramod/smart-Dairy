import React from "react";
import "../../../Styles/Home/Spinner/Spinner.css";

const Spinner = () => {
  return (
    <div className="box d-flex center">
      <div className="spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
    </div>
  );
};

export default Spinner;
