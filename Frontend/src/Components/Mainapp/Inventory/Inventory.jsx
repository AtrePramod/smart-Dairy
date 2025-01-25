import axios from "axios";
import React, { useState } from "react";
import "../../../Styles/Mainapp/Inventory/Inventory.css";

const Inventory = () => {
  const [reportData, setReportData] = useState({});

  const [values, setValues] = useState({
    fromDate: "",
    toDate: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  const handleReportData = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    axios
      .post("/milkreport", values)
      .then((res) => {
        setReportData(res.data); // Set the report data received from the backend
      })
      .catch((err) => {
        if (err.response) {
          console.error(
            `Error during report generation: ${err.response.data.message}`
          );
        } else {
          console.error(`Error during report generation: ${err.message}`);
        }
      });
  };

  return (
    <>
      <div className="invoice-outer-div w100 h1 d-flex-col">
        <div className="invoice-title-div w100 d-flex">
          <div className="back-btn-title-div w70 d-flex"></div>
          <span>SAVE PDF</span>
        </div>
        <div className="invoice-date-div w100 h20 d-flex-col p10">
          <span className="w100 text">Select period : </span>
          <form onSubmit={handleReportData} className="text w50 d-flex">
            <span>
              From:{" "}
              <input type="date" name="fromDate" onChange={handleInputs} />{" "}
            </span>{" "}
            <span>
              To: <input type="date" name="toDate" onChange={handleInputs} />{" "}
            </span>
            <button className="form-btn" type="submit">
              Show
            </button>
          </form>
        </div>
        <div className="invoice-of-collection-div w100 h90 d-flex-col">
          <div className="invice-title-div w100 h5 d-flex a-center px10">
            <span className="heading">Collection</span>
          </div>
          <div className="content-titles-div w100 h5 d-flex center t-center sa bg6">
            <span className="text w10">Date</span>
            <span className="text w5">M/E</span>
            <span className="text w5">C/B</span>
            <span className="text w10">Liters</span>
            <span className="text w5">FAT</span>
            <span className="text w5">SNF</span>
            <span className="text w5">CLR</span>
            <span className="text w10">Rate</span>
            <span className="text w15">Amount</span>
          </div>
          {/* <div className="report-data-container w100  d-flex-col">
            <div className="content-values-div w100 h5 d-flex center t-center sa">
              <span className="text w10">0</span>
              <span className="text w5">0</span>
              <span className="text w5">0</span>
              <span className="text w10">0</span>
              <span className="text w5">0</span>
              <span className="text w5">0</span>
              <span className="text w5">0</span>
              <span className="text w10">0</span>
              <span className="text w15">0</span>
            </div>
          </div> */}

          {reportData.records &&
            reportData.records.map((record, index) => (
              <div
                key={index}
                className="content-values-div w100 h5 d-flex center t-center sa"
              >
                <span className="text w10">{record.ReceiptDate}</span>
                <span className="text w5">{record.ME}</span>
                <span className="text w5">{record.CB}</span>
                <span className="text w10">{record.Litres}</span>
                <span className="text w5">{record.fat}</span>
                <span className="text w5">{record.snf}</span>
                <span className="text w5">{record.CLR}</span>
                <span className="text w10">{record.Rate}</span>
                <span className="text w15">{record.Amt}</span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Inventory;
