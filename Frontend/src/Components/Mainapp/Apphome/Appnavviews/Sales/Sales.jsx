import React from "react";

import "../../../../../Styles/Mainapp/Apphome/Appnavview/Sales.css";
import Salesform from "./Salesform";
import Salesrecipt from "./Salesrecipt";

const Sales = () => {
  return (
    <div className="sales-details-container box">
      <div className="title-container w100 h10 d-flex a-center p10">
        <h2 className="subtitle">Sales Details</h2>
      </div>
      <div className="product-form-bill-container w100 h90 d-flex">
        <div className="add-products w30 h1 d-flex p10">
          <div className="product-info w100 h1 d-flex-col p10 bg">
            <span className="heading">Add New Product</span>
            <form className="product-form w100 h10 d-flex sb">
              <input
                className="form-inputs w70 p10"
                type="text"
                required
                placeholder="Enter Product Name"
              />
              <button className="btn w30">ADD</button>
            </form>
            <div className="all-products-list w100 h80 d-flex-col hidescrollbar">
              <span className="heading">Product List : </span>
              <div className="product-list w100 h1 d-flex-col hidescrollbar bg5 br6">
                <h2 className="prod-name text">product1</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="sales-bill-container w40 h1 d-flex-col p10 ">
          <div className="sales-details-div w100 h1 d-flex-col bg p10">
            <Salesform />
          </div>
        </div>
        <div className="sales-recipt-container w30 h1 d-flex-col p10">
          <Salesrecipt />
        </div>
      </div>
    </div>
  );
};

export default Sales;
