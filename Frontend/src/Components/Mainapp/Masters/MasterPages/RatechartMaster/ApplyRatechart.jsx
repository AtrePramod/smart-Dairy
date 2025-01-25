import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getMaxCustNo } from "../../../../../App/Features/Customers/customerSlice";
import Spinner from "../../../../Home/Spinner/Spinner";
import { applyRateChart } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";

const ApplyRatechart = ({ isSet, ratechart }) => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const status = useSelector((state) => state.ratechart.applyrcstatus);
  const custno = useSelector((state) => state.customer.maxCustNo);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    rcdate: "",
    fromCust: 1,
    toCust: "",
  });

  useEffect(() => {
    dispatch(getMaxCustNo());
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      toCust: `${custno - 1}`,
    }));
  }, [custno]);

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "fromCust":
      case "toCust":
        if (!/^[0-9]+$/.test(value)) {
          error[name] = `Invalid value of ${name}`;
        } else {
          delete errors[name];
        }
        break;

      case "rcdate":
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
    const fieldsToValidate = ["rcdate", "fromCust", "toCust"];
    const validationErrors = {};

    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (!isSet) {
      toast.error("Please Select Ratechart To Apply");
    } else {
      try {
        await dispatch(
          applyRateChart({
            applydate: formData.rcdate,
            custFrom: formData.fromCust,
            custTo: formData.toCust,
            ratechart: ratechart,
          })
        );
        setErrors({}); // Clear errors if submission is successful
      } catch (error) {
        toast.error("An error occurred while applying the rate chart.");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Ratechart Applied Successfully!");
    } else if (status === "failed") {
      toast.success("An error occurred while applying the rate chart, Try Again");
    }
  }, [status]);

  return (
    <>
      <form
        className="rate-chart-setting-div w100 h1 d-flex-col sa my10"
        onSubmit={handleSubmit}>
        <span className="heading">Apply Selected Ratechart</span>
        <div className="select-time-animal-type w100 h25 d-flex sb">
          <div className="select-time w100 h1 a-center d-flex a-center sb">
            <label htmlFor="implementationDate" className="info-text w50">
              Rate Chart Implementation Date :
            </label>
            <input
              className={`data w35 ${errors.fromCust ? "input-error" : ""}`}
              type="date"
              name="rcdate"
              id="implementationDate"
              required
              value={formData.date}
              onChange={handleInput}
              max={tDate}
            />
          </div>
        </div>
        <span className="label-text">Select Customers</span>
        {status === "loading" ? (
          <div className="loading-ToastContainer w100 h25 d-flex center">
            <Spinner />
          </div>
        ) : (
          <div className="select-time-animal-type w100 h25 d-flex">
            <div className="select-animal-type w30 h1 a-center d-flex">
              <label htmlFor="fromCust" className="info-text w40">
                From :
              </label>
              <input
                type="number"
                className={`data w60 ${errors.fromCust ? "input-error" : ""}`}
                name="fromCust"
                id="fromCust"
                required
                value={formData.fromCust.toString() || ""}
                onChange={handleInput}
              />
            </div>
            <div className="select-animal-type w30 h1 a-center d-flex mx10">
              <label htmlFor="toCust" className="info-text w40">
                To :
              </label>
              <input
                type="number"
                className={`data w60 ${errors.toCust ? "input-error" : ""}`}
                name="toCust"
                id="toCust"
                required
                value={formData.toCust.toString() || ""}
                onChange={handleInput}
              />
            </div>
          </div>
        )}
        <div className="button-div w100 h25 d-flex j-end">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}>
            {status === "loading" ? "Appling..." : "Apply Ratechart"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ApplyRatechart;
