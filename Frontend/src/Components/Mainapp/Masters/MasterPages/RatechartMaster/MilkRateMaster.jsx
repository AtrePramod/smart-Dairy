import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as xlsx from "xlsx";
import {
  saveRateChart,
  resetProgress,
  fetchMaxRcCode,
  applyRateChart,
  listRateCharts,
  fetchselectedRateChart,
  fetchRateChart,
  setData,
  deleteRatechart,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import { toast } from "react-toastify";
import "../../../../../Styles/Mainapp/Masters/MilkRateMaster.css";
import RateChartOptions from "./RateChartOptions";

const MilkRateMaster = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const { status, error, progress } = useSelector((state) => state.ratechart);
  const maxRcCode = useSelector((state) => state.ratechart.maxRcCode);
  const ratechartlist = useSelector((state) => state.ratechart.ratechartList);
  const Selectedrc = useSelector((state) => state.ratechart.selectedRateChart);

  useEffect(() => {
    dispatch(fetchMaxRcCode());
    dispatch(listRateCharts());
  }, []);

  const fileInputRef = React.useRef(null);
  const [selectedRateChart, setSelectedRateChart] = useState(null);
  const [rate, setRate] = useState([]);
  const [localError, setLocalError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    rccode: maxRcCode,
    rctype: "",
    time: "",
    animalType: 0,
    rcdate: "",
  });

  // console.log(rate);

  // useEffect(() => {
  //   if (status === "succeeded") {
  //     toast.success("Rate chart saved successfully!");
  //     setLoading(false);
  //     dispatch(resetProgress());
  //     // Optionally, reset formData and rate
  //     setFormData({
  //       rccode: "",
  //       rctype: "",
  //       time: "",
  //       animalType: "",
  //       rcdate: "",
  //     });
  //     setRate([]);
  //   } else if (status === "failed") {
  //     toast.error(`Error: ${error}`);
  //     setLoading(false);
  //     dispatch(resetProgress());
  //   }
  // }, [status, error, dispatch]);

  // handling choose file button

  useEffect(() => {
    dispatch(fetchMaxRcCode());
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleExcel = async (e) => {
    const file = e.target.files[0];

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      setLocalError(
        "Please upload a valid Excel file with .xlsx or .xls extension."
      );
      return;
    }

    try {
      setLoading(true); // Start loading
      const data = await file.arrayBuffer();
      const excelFile = xlsx.read(data);
      const excelSheet = excelFile.Sheets[excelFile.SheetNames[0]];
      const excelJson = xlsx.utils.sheet_to_json(excelSheet, { defval: "" });

      // Transform the data
      const transformedData = transformExcelData(excelJson);
      setRate(transformedData);
      dispatch(setData(transformedData));
      setLocalError("");
    } catch (err) {
      console.error("Error reading Excel file:", err);
      setLocalError(
        "Failed to read the Excel file. Please ensure it is properly formatted."
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  // Transformation Function
  const transformExcelData = (data) => {
    const transformed = [];

    data.forEach((row, rowIndex) => {
      const fatSnfKey = "fat/snf";
      const commonFAT = parseFloat(row[fatSnfKey]);

      if (isNaN(commonFAT)) {
        console.warn(
          `Row ${rowIndex + 1}: Invalid or missing '${fatSnfKey}' value.`
        );
        return; // Skip this row if FAT is invalid
      }

      // Iterate over each key-value pair in the row
      Object.entries(row).forEach(([key, value]) => {
        if (key.toLowerCase() === fatSnfKey.toLowerCase()) {
          return; // Skip the 'fat/snf' entry
        }

        const snf = parseFloat(key);
        const rate = parseFloat(value);

        if (isNaN(snf) || isNaN(rate)) {
          console.warn(
            `Row ${
              rowIndex + 1
            }: Invalid SNF or Rate. SNF: ${key}, Rate: ${value}`
          );
          return; // Skip invalid entries
        }

        transformed.push({
          fat: commonFAT,
          snf: snf,
          rate: Math.round(rate * 100) / 100, // Round to two decimal places
        });
      });
    });

    return transformed;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateField = (name, value) => {
    const error = {};
    switch (name) {
      case "rccode":
        if (!/^\d+$/.test(value)) {
          error[name] = "Invalid RCCODE.";
        } else {
          delete errors[name];
        }
        break;
      case "rctype":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error[name] = "Invalid RCTYPE.";
        } else {
          delete errors[name];
        }
        break;
      case "time":
        if (!/^\d+$/.test(value)) {
          error[name] = "Invalid Time.";
        } else {
          delete errors[name];
        }
        break;
      case "animal":
        if (!/^\d+$/.test(value)) {
          error[name] = "Invalid Animal Type.";
        } else {
          delete errors[name];
        }
        break;
      case "rcdate":
        if (!value || formData.rcdate > today) {
          error[name] = "Implementation Date is Invalid.";
        } else {
          delete errors[name];
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.rccode ||
      !formData.rctype ||
      !formData.rcdate ||
      !formData.time ||
      !formData.animalType ||
      rate.length === 0
    ) {
      setLocalError(
        "Please fill out all required fields and upload a valid Excel file."
      );
      return;
    }

    // Ensure numerical fields are numbers
    const numericRccode = parseInt(formData.rccode, 10);
    // const numericRctype = parseInt(formData.rctype, 10);
    const numericTime = parseInt(formData.time, 10);

    if (isNaN(numericRccode) || isNaN(numericTime)) {
      setLocalError("RCCODE, RCTYPE, and Time must be valid numbers.");
      return;
    }

    // Optionally, validate rate array entries
    for (let i = 0; i < rate.length; i++) {
      const entry = rate[i];
      if (
        typeof entry.FAT !== "number" ||
        typeof entry.SNF !== "number" ||
        typeof entry.Rate !== "number"
      ) {
        setLocalError(`Invalid rate data at row ${i + 1}.`);
        return;
      }
    }

    // Dispatch with validated and parsed data
    await dispatch(
      saveRateChart({
        rccode: numericRccode,
        rctype: formData.rctype,
        rcdate: formData.rcdate,
        time: numericTime,
        animal: formData.animalType,
        rate,
      })
    );

    if (status === "succeeded") {
      toast.success("Rate chart saved successfully!");
      setFormData({
        rccode: "",
        rctype: "",
        time: "",
        animalType: "",
        rcdate: "",
      });

      setRate([]);

      dispatch(fetchMaxRcCode());
      dispatch(listRateCharts());
    } else {
      setLocalError("Failed to save rate chart. Please try again.");
    }

    setLocalError("");
  };

  // Function to handle row click
  const handleRowClick = async (ratechart) => {
    // If the clicked rate chart is already selected, deselect it
    if (selectedRateChart === ratechart) {
      setSelectedRateChart(null);
    } else {
      setSelectedRateChart(ratechart);
      await dispatch(
        fetchRateChart({
          cb: ratechart.cb,
          rccode: ratechart.rccode,
          rcdate: ratechart.rcdate,
          time: ratechart.time,
        })
      );
    }
  };

  // Handle show Ratechart button
  const ShowRatechart = async () => {
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to Show.");
      return;
    } else {
      await setRate(Selectedrc);
    }
  };

  const deleteRateChart = async () => {
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to download.");
      return;
    } else {
      dispatch(
        deleteRatechart({
          cb: ratechart.cb,
          rccode: ratechart.rccode,
          rcdate: ratechart.rcdate,
          time: ratechart.time,
        })
      );
      toast.success("Ratechart Deleted Successfully!")
    }
  };

  const downloadRateChart = async () => {
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to download.");
      return;
    } else {
      // Convert data to worksheet
      const worksheet = xlsx.utils.json_to_sheet(Selectedrc);

      // Create a new workbook and append the worksheet
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Rate Chart");

      // Generate a Blob for the Excel file
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      // Trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "rate_chart.xlsx"; // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleApplyRatechart = async (e) => {
    e.preventDefault();
    await dispatch(applyRateChart(selectedRateChart.rccode));
    dispatch(listRateCharts());
    toast.success("Rate chart Applied successfully!");
  };

  const handleRatechartUpdate = async () => {
    e.preventDefault();
    if (!selectedRateChart) {
      toast.error("Please select a ratechart to Update!.");
      return;
    } else {
    }
  };

  return (
    <>
      <div className="rate-chart-master-container w100 h1 d-flex sb">
        <div className="select-ratechart-container w40 h1 d-flex-col sa p10">
          <div className="select-excel-container w100 h10 d-flex a-center my10 sb">
            <span className="info-text w40">Select Excel File</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleExcel}
            />
            <button className="btn" onClick={handleButtonClick}>
              Choose File
            </button>
          </div>
          {localError && (
            <div className="error-message" style={{ color: "red" }}>
              {localError}
            </div>
          )}
          {loading && (
            <div className="loading-spinner" style={{ color: "blue" }}>
              Loading...
            </div>
          )}
          {/* Progress Bar */}
          {status === "loading" && (
            <div className="progress-bar-container w100 my10">
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                  height: "20px",
                  backgroundColor: "#4caf50",
                  transition: "width 0.5s",
                }}></div>
              <span>{progress}%</span>
            </div>
          )}
          <div className="rate-chart-container w100 h90 d-flex-col bg">
            <span className="heading p10">
              Selected Rate Chart from Excel :{" "}
            </span>
            <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 bg1">
              <span className="f-info-text w5">No.</span>
              <span className="f-info-text w15">FAT</span>
              <span className="f-info-text w10">SNF</span>
              <span className="f-info-text w15">Rate</span>
            </div>
            <div className="rate-chart-div w100 h90 mh90 d-flex-col hidescrollbar">
              {rate.length > 0 ? (
                rate.map((item, index) => (
                  <div
                    key={`${item.fat}-${item.snf}-${index}`}
                    className={`rate-chart-row-value w100 h10 d-flex a-center t-center sa ${
                      index % 2 === 0 ? "bg-light" : "bg-dark"
                    }`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}>
                    <span className="info-text w5">{index + 1}</span>
                    <span className="info-text w15">
                      {item.fat !== undefined ? item.fat.toFixed(1) : "N/A"}
                    </span>
                    <span className="info-text w10">
                      {item.snf !== undefined ? item.snf.toFixed(1) : "N/A"}
                    </span>
                    <span className="info-text w15">
                      {item.rate !== undefined ? item.rate.toFixed(2) : "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <div>Select a Rate Chart to display.</div>
              )}
            </div>
          </div>
        </div>
        <div className="save-ratechart-container w45 h1 d-flex-col p10">
          <div className="previous-rate-chart-container w100 h40 d-flex-col bg my10">
            <span className="heading p10">Previous Rate Charts : </span>
            <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 bg1">
              <span className="f-info-text w10">No.</span>
              <span className="f-info-text w20">Date</span>
              <span className="f-info-text w15">Time</span>
              <span className="f-info-text w15">Animal</span>
              <span className="f-info-text w25">Type</span>
            </div>
            <div className="rate-chart-div w100 h90 mh90 d-flex-col hidescrollbar">
              {ratechartlist.map((ratechart, index) => (
                <div
                  onClick={() => handleRowClick(ratechart)}
                  key={index}
                  className="rate-chart-row-value w100  d-flex a-center t-center py10 sa"
                  style={{
                    backgroundColor:
                      selectedRateChart === ratechart
                        ? "#d1e7dd"
                        : index % 2 === 0
                        ? "#faefe3"
                        : "#fff",
                    cursor: "pointer",
                  }}>
                  <span className="info-text w10">{ratechart.rccode}</span>
                  <span className="info-text w20">
                    {new Date(ratechart.rcdate).toLocaleDateString("en-GB", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="info-text w15">
                    {ratechart.time === 0
                      ? "Mrg"
                      : ratechart.time === 1
                      ? "Eve"
                      : ratechart.time === 2
                      ? "Both"
                      : ""}
                  </span>
                  <span className="info-text w15">
                    {ratechart.cb === 0 ? "Cow" : "Buffalo"}
                  </span>
                  <span className="info-text w25">{ratechart.rctypename}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="button-div w100 h10 d-flex j-end">
            <button
              type="submit"
              className="btn mx10"
              disabled={status === "loading"}
              onClick={deleteRateChart}>
              Delete
            </button>
            <button
              type="submit"
              className="btn mx10"
              disabled={status === "loading"}
              onClick={downloadRateChart}>
              Download
            </button>
            <button
              type="submit"
              className="btn mx10"
              disabled={status === "loading"}
              onClick={ShowRatechart}>
              Show
            </button>
          </div>
          <div className="rate-chart-options-container w100 h50 d-flex-col sa my10">
            <RateChartOptions
              isSet={selectedRateChart}
              ratechart={Selectedrc}
            />
          </div>
          {/* <form
            className="rate-chart-setting-div w100 h40 d-flex-col sa my10 px10"
            onSubmit={handleSubmit}>
            <div className="select-time-animal-type w100 h25 d-flex sb">
              <div className="select-time w25 h1 a-center d-flex-col ">
                <label htmlFor="rccode" className="info-text w100">
                  Ratechart No :
                </label>
                <input
                  className="data w100"
                  type="number"
                  name="rccode"
                  id="rccode"
                  value={formData.rccode}
                  onChange={handleInput}
                  readOnly
                />
              </div>
              <div className="select-animal-type w70 h1 a-center d-flex-col">
                <label htmlFor="rctype" className="info-text w100">
                  Ratechart Type:{" "}
                </label>
                <input
                  className={`data w100 ${errors.rctype ? "input-error" : ""}`}
                  type="text"
                  name="rctype"
                  id="rctype"
                  value={formData.rctype}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="select-time-animal-type w100 h25 d-flex sb">
              <div className="select-animal-type w50 h1 a-center d-flex">
                <label htmlFor="time" className="info-text w50">
                  Time:
                </label>
                <select
                  className={`data w45 ${errors.time ? "input-error" : ""}`}
                  name="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={handleInput}>
                  <option className="info-text" value="2">
                    Both
                  </option>
                  <option className="info-text" value="0">
                    Mornning
                  </option>
                  <option className="info-text" value="1">
                    Evenning
                  </option>
                </select>
              </div>
              <div className="select-animal-type w50 h1 a-center d-flex">
                <label htmlFor="animalType" className="info-text w50">
                  Animal Type:
                </label>
                <select
                  className="data w50 "
                  name="animalType"
                  id="animalType"
                  required
                  value={formData.animalType}
                  onChange={handleInput}>
                  <option className="info-text" value="">
                    --Select--
                  </option>
                  <option className="info-text" value="0">
                    Cow
                  </option>
                  <option className="info-text" value="1">
                    Buffalo
                  </option>
                  <option className="info-text" value="2">
                    Other
                  </option>
                </select>
              </div>
            </div>
            <div className="rate-chart-date w100 h25 d-flex sb">
              <label htmlFor="implementationDate" className="info-text w60">
                Rate Chart Implementation Date:
              </label>
              <input
                className="data w30 h50"
                required
                type="date"
                name="rcdate"
                id="implementationDate"
                value={formData.rcdate}
                onChange={handleInput}
                max={tDate}
              />
            </div>
            <div className="button-div w100 h25 d-flex j-end">
              <button
                type="submit"
                className="btn mx10"
                disabled={status === "loading"}
                onClick={handleApplyRatechart}>
                Apply Rate Chart
              </button>
              <button
                type="submit"
                className="btn mx10"
                disabled={status === "loading"}>
                Save Rate Chart
              </button>
            </div>
          </form> */}
        </div>
      </div>
    </>
  );
};

export default MilkRateMaster;
