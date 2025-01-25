import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../../Home/Spinner/Spinner";
import { updateRatechart } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";

const UpdateRatechart = ({ isSet, ratechart }) => {
  const dispatch = useDispatch();

  const status = useSelector((state) => state.ratechart.updatestatus);
  const tDate = useSelector((state) => state.date.toDate);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    amount: "",
    rctype: "",
    animalType: "",
    rcdate: "",
    rccode: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name]; // Clear error if field is empty
      return updatedErrors;
    });
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "amount":
        if (!/^[-+]?\d+(\.\d{1,2})?$/.test(value)) {
          error[name] = `Invalid value of ${name}.`;
        } else {
          delete errors[name];
        }
        break;

      case "rcdate":
        // Check if the value is in YYYY-MM-DD format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          errors[name] = `Invalid value of ${name}.`;
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
    const fieldsToValidate = ["amount", "rcdate"];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  const updateRatechart = () =>{
    
  }

  const handleRatechartUpdate = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (!isSet) {
      toast.error("Please select a ratechart to Update!.");
      return;
    } else {
      dispatch(
        updateRatechart({
          amt: formData.amount,
          rccode: isSet.rccode,
          rcdate: isSet.rcdate.slice(0, 10),
          rctype: isSet.rctypename,
          rate: ratechart,
        })
      );
    }
  };

  return (
    <>
      <form
        className="rate-chart-setting-div w100 h1 d-flex-col my10"
        onSubmit={handleRatechartUpdate}>
        <span className="heading">Update Selected Ratechart</span>
        <div className="select-time-animal-type w100 h70 d-flex sb">
          {status === "loading" ? (
            <div className="loading-ToastContainer w100 h1 d-flex center">
              <Spinner />
            </div>
          ) : (
            <div className="update-rate-date-contaner w100 h1 d-flex-col">
              <div className="select-time w100 h50 a-center d-flex sb">
                <label htmlFor="amount" className="info-text w70">
                  Increase or decrease a specific amount from the selected rate
                  chart :
                </label>
                <input
                  className={`data w20 ${errors.amount ? "input-error" : ""}`}
                  type="text"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  placeholder="+0.0"
                  onChange={handleInput}
                />
              </div>
              <div className="select-animal-type w100 h30 a-center d-flex j-start sb">
                <label htmlFor="newdate" className="info-text w40">
                  New Ratechart Date :
                </label>
                <input className="data w30 " type="date" name="" id="newdate" />
              </div>
            </div>
          )}
        </div>
        <div className="button-div w100 h25 d-flex j-end my10">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}>
            {status === "loading" ? "Updating..." : "Update Ratechart"}
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateRatechart;
