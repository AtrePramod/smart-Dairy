import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/PrevMilkCollection.css";
import { saveMilkOneEntry } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
const PrevCollForm = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const [customerList, setCustomerList] = useState([]);
  const [custList, setCustList] = useState({}); // to check remainning customer list
  const [milkRateChart, setMilkRatechart] = useState([]);
  const [time, setTime] = useState(true);
  const [errors, setErrors] = useState({});

  const initialValues = {
    date: "",
    code: "",
    time: 0,
    animal: 0,
    liters: "",
    fat: "",
    snf: "",
    amt: "",
    degree: 0,
    rate: "",
    cname: "",
    acccode: "",
    rateChartNo: "",
  };

  const [values, setValues] = useState(initialValues);

  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      if (value > tDate) {
        // Set an error for the date field
        setErrors((prevErrors) => ({
          ...prevErrors,
          date: "Selected date cannot be greater than the current date.",
        }));
        return; // Prevent updating the state if the date is invalid
      } else {
        // Clear the error if the date is valid
        setErrors((prevErrors) => {
          const { date, ...rest } = prevErrors;
          return rest; // Remove date error if valid
        });
      }

      // Update the values state
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      // Validate the field for other errors
      const fieldError = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldError,
      }));
    }

    setValues({ ...values, [name]: value });

    // Validate field and update errors state
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldError,
    }));
  };

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
      setCustList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

  // Retrieve the stored rate chart from localStorage on component mount
  useEffect(() => {
    const storedRateChart = localStorage.getItem("milkcollrcharts");
    if (storedRateChart) {
      try {
        const parsedRateChart = JSON.parse(storedRateChart);
        setMilkRatechart(parsedRateChart);
      } catch (error) {
        console.error(
          "Failed to parse milkcollrchart from localStorage:",
          error
        );
      }
    } else {
      console.log("No data found in localStorage for milkcollrchart");
    }
  }, []);

  // morning evening
  const handleTime = () => {
    setTime((prev) => !prev);
    setValues((prevData) => ({
      ...prevData,
      time: !time ? 0 : 1,
    }));
  };

  // finding rate and calculating amount and degree
  const calculateRateAndAmount = async () => {
    try {
      const { fat, snf, liters } = values;

      // Access the correct array if milkRateChart is an object with a nested array
      const rateChartArray = Array.isArray(milkRateChart)
        ? milkRateChart
        : milkRateChart.MilkCollRChart;

      // Check if rateChartArray is an array before proceeding
      if (!Array.isArray(rateChartArray)) {
        console.error("rateChartArray is not an array. Check the data source.");
        setValues((prev) => ({
          ...prev,
          rate: "N/A",
          amt: "N/A",
          degree: "N/A",
        }));
        return;
      }

      // Ensure that fat and snf values are parsed correctly for comparison
      const parsedFat = parseFloat(fat);
      const parsedSnf = parseFloat(snf);
      const parsedLiters = parseFloat(liters);

      // Calculate the degree of milk based on Maharashtra Government formula
      const degree = (parsedFat * parsedSnf).toFixed(2);

      // Find rate entry based on matching fat and snf values
      const rateEntry = rateChartArray.find(
        (entry) =>
          entry.fat === parsedFat &&
          entry.snf === parsedSnf &&
          entry.rccode === values.rateChartNo
      );

      if (rateEntry) {
        const rate = rateEntry.rate;
        const amount = rate * parsedLiters;

        // Update state with calculated rate, amount, and degree
        setValues((prev) => ({
          ...prev,
          rate: rate.toFixed(2),
          amt: amount.toFixed(2),
          degree: degree, // Add the calculated degree to the state
        }));
      } else {
        // Handle case where rate entry is not found
        setValues((prev) => ({
          ...prev,
          rate: "N/A",
          amt: "N/A",
          degree: degree,
        }));
      }
    } catch (error) {
      console.error("Error calculating rate and amount:", error);
    }
  };

  // Trigger calculation whenever liters, fat, or snf change
  useEffect(() => {
    if (values.liters && values.fat && values.snf) {
      calculateRateAndAmount();
    }
  }, [values.liters, values.fat, values.snf]);

  const getToken = () => {
    dispatch(fetchFCMTokens({ cust_no: values.code }));
  };

  // Effect to search for customer when code changes
  useEffect(() => {
    if (values.code.trim().length > 0) {
      const handler = setTimeout(() => {
        // Ensure `code` has valid content before making API calls
        findCustomerByCode(values.code.trim());
        getToken();
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [values.code, dispatch]);

  //finding customer name
  const findCustomerByCode = (code) => {
    if (!code) {
      setValues((prev) => ({ ...prev, cname: "" }));
      return;
    }
    // Ensure the code is a string for comparison
    const customer = customerList.find(
      (customer) => customer.srno.toString() === code
    );

    if (customer) {
      setValues((prev) => ({ ...prev, cname: customer.cname }));
      setValues((prev) => ({ ...prev, acccode: customer.cid }));
      setValues((prev) => ({ ...prev, rateChartNo: customer.rateChartNo }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  const findrateAndAmount = () => {
    if (values.liters && values.fat && values.snf) {
    }
    // Ensure the code is a string for comparison
    const customer = customerList.find(
      (customer) => customer.srno.toString() === code
    );

    if (customer) {
      setValues((prev) => ({ ...prev, cname: customer.cname }));
      setValues((prev) => ({ ...prev, acccode: customer.cid }));
      setValues((prev) => ({ ...prev, rateChartNo: customer.rateChartNo }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Customer code.";
        } else {
          delete errors[name];
        }
        break;

      case "cname":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid Customer Name.";
        } else {
          delete errors[name];
        }
        break;

      case "liters":
        if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
          error[name] = "Invalid liters.";
        } else {
          delete errors[name];
        }
        break;

      case "fat":
      case "snf":
        if (!/^\d+(\.\d{1,1})?$/.test(value.toString())) {
          error[name] = `Invalid ${[name]}.`;
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
      "code",
      "cname",
      "liters",
      "fat",
      "snf",
      "rate",
      "amt",
    ];

    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  };

  const handlePrevCollection = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const allEntries = JSON.parse(localStorage.getItem("milkentries")) || [];
      console.log(allEntries);

      await dispatch(saveMilkOneEntry(values));
      const existingEntries =
        JSON.parse(localStorage.getItem("milkentries")) || [];

      existingEntries.push(values);
      localStorage.setItem("milkentries", JSON.stringify(existingEntries));
      setValues(initialValues); // Reset form to initial values
      setErrors({}); // Reset errors

      await sendNotifications();

      toast.success(`Milk Collection of ${values.cname} saved successfully!`);

      // Remove customer from custList
      await setCustList((prevList) =>
        prevList.filter((customer) => customer.srno !== values.code)
      );
      console.log("asas", custList);
    } catch (error) {
      console.error("Error sending milk entries to backend:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handlePrevCollection}
        className="milk-col-form w100 h1 d-flex-col bg p10">
        <span className="heading w100 t-center py10">
          Add Previous Collection{" "}
        </span>
        <div className="form-settings w100 h10 d-flex a-center sb">
          <div className="w45 d-flex a-center px10">
            <label htmlFor="" className="info-text w30">
              Date <span className="req">*</span>{" "}
            </label>
            <input
              className={`data w70 ${errors.date ? "input-error" : ""}`}
              type="date"
              required
              placeholder="0000"
              name="date"
              onChange={handleInputs}
              value={values.date || ""}
              max={tDate}
            />
          </div>
          <div className="select-animal-type w35 h1 a-center d-flex">
            <label htmlFor="animalType" className="info-text w50">
              Animal Type:
            </label>
            <select
              className="data w50"
              name="animalType"
              id="animalType"
              required
              value={values.animal}
              onChange={handleInputs}>
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
          <div className="setting-btn-switch w15 d-flex ">
            {/* <span className="text">Morning</span> */}
            <button
              type="button"
              onClick={handleTime}
              className={`sakalan-time ${time ? "on" : "off"}`}
              aria-pressed={time}>
              {time ? "Morning" : "Evening"}
            </button>
            {/* <span className="text">Evening</span> */}
          </div>
        </div>
        <div className="user-details w100 h10 d-flex "></div>
        <div className="user-details w100 h20 d-flex ">
          <div className="form-div w50 px10">
            <label htmlFor="" className="info-text">
              Enter User Code <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.code ? "input-error" : ""}`}
              type="number"
              required
              placeholder="0000"
              name="code"
              value={values.code}
              onChange={handleInputs}
            />
          </div>
          <div className="form-div w50 px10">
            <label htmlFor="" className="info-text">
              Enter User Name <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.cname ? "input-error" : ""}`}
              type="text"
              required
              placeholder="smartdairy user"
              name="cname"
              value={values.cname}
              readOnly
            />
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex-col">
          {/* <span className="label-text">Milk Details : </span> */}
          <div className="milk-details w100 h90 d-flex">
            <div className="milk-info w50 h1 ">
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Litters <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.liters ? "input-error" : ""}`}
                  type="decimal"
                  required
                  placeholder="00.0"
                  name="liters"
                  onChange={handleInputs}
                  value={values.liters}
                />
              </div>
              <div className="form-div  px10">
                <label htmlFor="" className="info-text">
                  FAT-1 <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.fat ? "input-error" : ""}`}
                  type="decimal"
                  required
                  placeholder="0.0"
                  name="fat"
                  onChange={handleInputs}
                  value={values.fat}
                />
              </div>
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  SNF-1 <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.snf ? "input-error" : ""}`}
                  type="decimal"
                  required
                  placeholder="00.0"
                  name="snf"
                  value={values.snf}
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="milk-info w50 h1 d-flex-col">
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Degree <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.degree ? "input-error" : ""}`}
                  type="decimal"
                  required
                  disabled
                  placeholder="00.0"
                  name="degree"
                  value={values.degree}
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Rate <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.rate ? "input-error" : ""}`}
                  type="decimal"
                  required
                  readOnly
                  placeholder="00.0"
                  name="rate"
                  value={values.rate}
                />
              </div>
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Amount <span className="req">*</span>{" "}
                </label>
                <input
                  className={`data ${errors.amt ? "input-error" : ""}`}
                  type="decimal"
                  required
                  readOnly
                  placeholder="00.0"
                  name="amt"
                  value={values.amt}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-btns w100 h10 d-flex a-center j-end">
          <button className="w-btn " type="reset">
            Cancel
          </button>
          <button className="w-btn mx10" type="submit">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default PrevCollForm;
