import React from "react";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Sales.css";

const Salesrecipt = () => {
  return (
    <>
      <div className="recipts-outer-div w100 h1  bg p10">
        <span className="heading">Sales Recipt :</span>
        <div className="sales-recipt-div w100 h70 d-flex-col hidescrollbar ">
          <div className="sales-info-container w100 h1 d-flex-col">
            <div className="billno-date-div  d-flex center sb">
              <label className="text" htmlFor="">
                Bill No : 0000
              </label>

              <label className="text" htmlFor="">
                DD-MM-YYYY
              </label>
            </div>
            <div className="code-name-div w100 h10 d-flex-col">
              <label className="text" htmlFor="">
                Code no : 0000
              </label>

              <label className="text" htmlFor="">
                Name : smartdairy
              </label>
            </div>
            <span className="text py10" htmlFor="">
              List Of Items
            </span>
            <div className="list-of-items-div h50 bg5 br6">
              <div className="table w100 mh70 d-flex-col">
                <div className="table-headings w100 d-flex center sb">
                  <label className="w20 d-flex center heading">No.</label>
                  <label className="w20 d-flex center heading">Name</label>
                  <label className="w20 d-flex center heading">Qty</label>
                  <label className="w20 d-flex center heading">Rate</label>
                  <label className="w20 d-flex center heading">Price</label>
                </div>
                <div className="table-data-container mh50 hidescrollbar ">
                  <div className="table-data w100 d-flex center sb">
                    <label className="w20 d-flex center text">1</label>
                    <label className="w20 d-flex center text">smartdairy</label>
                    <label className="w20 d-flex center text">1</label>
                    <label className="w20 d-flex center text">00</label>
                    <label className="w20 d-flex center text">00</label>
                  </div>
                </div>
              </div>
              <hr className="hr" />
              <div className="totle d-flex center end">
                <label className="text" htmlFor="">
                  Totle :
                </label>
                <label className="text p10" htmlFor="">
                  00.0
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salesrecipt;
