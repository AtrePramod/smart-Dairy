import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchMaxRcCode,
  listRateCharts,
  saveRateChart,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import Spinner from "../../../../Home/Spinner/Spinner";

const SaveRateChart = ({ rate }) => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const status = useSelector((state) => state.ratechart.savercstatus);
  const maxRcCode = useSelector((state) => state.ratechart.maxRcCode);
  const ratechart = useSelector((state) => state.ratechart.excelRatechart);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    rccode: "",
    rctype: "",
    time: 2,
    animalType: 0,
    rcdate: "",
  });

  // Update rccode when maxRcCode changes
  useEffect(() => {
    if (maxRcCode) {
      setFormData((prevData) => ({ ...prevData, rccode: maxRcCode }));
    }
  }, [maxRcCode]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "rctype":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error[name] = "Invalid Ratechart Type.";
        } else {
          delete errors[name];
        }
        break;

      case "rccode":
      case "time":
      case "animalType":
        if (!/^\d$/.test(value.toString())) {
          errors[name] = `Invalid value of ${name}`;
        } else {
          delete errors[name];
        }
        break;
      case "rcdate":
        // Check if the value is in YYYY-MM-DD format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          errors[name] = `Invalid value of ${name}`;
        } else {
          delete errors[name];
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = [
      "rccode",
      "rctype",
      "time",
      "animalType",
      "rcdate",
    ];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  //Handling Save Ratechart
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ratechart) {
      toast.error("Ratechart not Available!");
      return;
    }

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
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

    if (
      !formData.rcdate ||
      new Date(formData.rcdate).toString() === "Invalid Date"
    ) {
      toast.error("Please provide a valid date.");
      return;
    }
    if (!Array.isArray(ratechart) || ratechart.length === 0) {
      toast.error("Ratechart cannot be empty.");
      return;
    }
    // Dispatch with validated and parsed data
    await dispatch(
      saveRateChart({
        rccode: numericRccode,
        rctype: formData.rctype,
        rcdate: formData.rcdate,
        time: numericTime,
        animal: formData.animalType,
        ratechart: ratechart,
      })
    );

    if (status === "succeeded") {
      toast.success("Ratechart saved successfully!");
      dispatch(fetchMaxRcCode());
      dispatch(listRateCharts());
      setFormData({
        rccode: maxRcCode,
        rctype: "",
        time: "",
        animalType: "",
        rcdate: "",
      });
      setRate([]);
    } else if (status === "failed") {
      toast.error("Failed to save ratechart, Please try again!");
    }
  };

  return (
    <>
      <form
        className="rate-chart-setting-div w100 h1 d-flex-col sa my10"
        onSubmit={handleSubmit}>
        <span className="heading">Save Selected Ratechart</span>
        {status === "loading" ? (
          <div className="loading-ToastContainer w100 h25 d-flex center">
            <Spinner />
          </div>
        ) : (
          <>
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
                <label htmlFor="time" className="info-text w30">
                  Time:
                </label>
                <select
                  className={`data w60 ${errors.time ? "input-error" : ""}`}
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
            <div className="select-animal-type w100 h25 a-center d-flex sb">
              <label htmlFor="rcdate" className="info-text w50">
                Ratechart date :{" "}
              </label>
              <input
                className={`data w40 ${errors.rcdate ? "input-error" : ""}`}
                type="date"
                name="rcdate"
                id="rcdate"
                value={formData.rcdate}
                onChange={handleInput}
              />
            </div>
          </>
        )}
        <div className="button-div w100 h20 d-flex j-end my10">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Save Ratechart"}
          </button>
        </div>
      </form>
    </>
  );
};

export default SaveRateChart;
