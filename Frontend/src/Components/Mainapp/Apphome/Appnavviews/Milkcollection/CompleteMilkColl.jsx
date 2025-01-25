import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMobileColl,
  updateMobileColl,
} from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const CompleteMilkColl = () => {
  const { t } = useTranslation(["milkcollection", "common"]);
  const dispatch = useDispatch();
  const colldata = useSelector(
    (state) => state.milkCollection.mobileCollection
  );
  const token = useSelector((state) => state.notify.fcmToken);
  const [errors, setErrors] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const [collectionList, setCollectionList] = useState([]);
  const [milkRateChart, setMilkRatechart] = useState([]);

  useEffect(() => {
    dispatch(fetchMobileColl());
  }, []);

  const initialValues = {
    date: new Date().toISOString().split("T")[0],
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
    rcName: "",
    sample: "",
  };

  const [values, setValues] = useState(initialValues);

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "sample":
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
    const fieldsToValidate = ["cname", "liters", "fat", "snf", "rate", "amt"];

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

  // used for decimal input correction
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate and allow only numeric input with an optional single decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear previous errors if the input is valid
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest; // Remove the specific error for this field
      });
    } else {
      // Set an error for invalid input
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]:
          "Invalid input. Only numbers and one decimal point are allowed.",
      }));
      return; // Stop further processing if input is invalid
    }

    // Normalize the value only when it's a valid integer and greater than 9
    if (/^\d+$/.test(value) && value.length > 1) {
      const normalizedValue = (parseInt(value, 10) / 10).toFixed(1);
      setValues((prev) => ({
        ...prev,
        [name]: normalizedValue,
      }));
    }
  };

  //.......................................................................................

  useEffect(() => {
    // When the customer list is updated, store it in localStorage
    if (colldata) {
      localStorage.setItem("colldata", JSON.stringify(colldata));
    }
  }, []);

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCollList = localStorage.getItem("colldata");
    if (storedCollList) {
      setCollectionList(JSON.parse(storedCollList));
    }
  }, [dispatch]);

  //.......................................................................................

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
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

  // finding rate and calculating amount and degree
  //   const calculateRateAndAmount = async () => {
  //     try {
  //       const { fat, snf, liters , rcName } = values;
  //
  //       // Access the correct array if milkRateChart is an object with a nested array
  //       const rateChartArray = Array.isArray(milkRateChart)
  //         ? milkRateChart
  //         : milkRateChart.MilkCollRChart;
  //
  //       // Check if rateChartArray is an array before proceeding
  //       if (!Array.isArray(rateChartArray)) {
  //         console.error("rateChartArray is not an array. Check the data source.");
  //         setValues((prev) => ({
  //           ...prev,
  //           rate: "N/A",
  //           amt: "N/A",
  //           degree: "N/A",
  //         }));
  //         return;
  //       }
  //
  //       // Ensure that fat and snf values are parsed correctly for comparison
  //       const parsedFat = parseFloat(fat);
  //       const parsedSnf = parseFloat(snf);
  //       const parsedLiters = parseFloat(liters);
  //
  //       // Calculate the degree of milk based on Maharashtra Government formula
  //       const degree = (parsedFat * parsedSnf).toFixed(2);
  //
  //       // Find rate entry based on matching fat and snf values
  //       const rateEntry = rateChartArray.find(
  //         (entry) =>
  //           entry.fat === parsedFat &&
  //           entry.snf === parsedSnf &&
  //           entry.rctypename === rcName
  //       );
  //
  //       if (rateEntry) {
  //         const rate = rateEntry.rate;
  //         const amount = rate * parsedLiters;
  //
  //         // Update state with calculated rate, amount, and degree
  //         setValues((prev) => ({
  //           ...prev,
  //           rate: rate.toFixed(2),
  //           amt: amount.toFixed(2),
  //           degree: degree, // Add the calculated degree to the state
  //         }));
  //       } else {
  //         // Handle case where rate entry is not found
  //         setValues((prev) => ({
  //           ...prev,
  //           rate: "N/A",
  //           amt: "N/A",
  //           degree: degree,
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error calculating rate and amount:", error);
  //     }
  //   };
  console.log("ratechart", milkRateChart);
  const calculateRateAndAmount = async () => {
    try {
      const { fat, snf, liters, rcName } = values;

      const parsedFat = parseFloat(fat);
      const parsedSnf = parseFloat(snf);
      const parsedLiters = parseFloat(liters);
      const degree = (parsedFat * parsedSnf).toFixed(2);
      console.log("ratechart", milkRateChart);

      const rateEntry = milkRateChart.find(
        (entry) =>
          entry.fat === parsedFat &&
          entry.snf === parsedSnf &&
          entry.rctypename === rcName
      );
      console.log(rateEntry);

      if (rateEntry) {
        const rate = parseFloat(rateEntry.rate);
        const amount = rate * parsedLiters;

        setValues((prev) => ({
          ...prev,
          rate: rate.toFixed(2),
          amt: amount.toFixed(2),
          degree: 0,
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          rate: "N/A",
          amt: "N/A",
          degree: 0,
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

  //finding customer name
  const findmilkCollByCode = (code) => {
    // Ensure the code is a string for comparison
    const customer = customerList.find(
      (customer) => customer.srno.toString() === code
    );

    console.log("customer", customer);

    if (customer) {
      setValues((prev) => ({
        ...prev,
        rateChartNo: customer.rateChartNo,
        acccode: customer.cid,
      }));
    }
  };

  //Finding Milk Collection By Code
  const findCustomerBySample = (sample) => {
    if (!sample) {
      setValues((prev) => ({ ...prev, code: "", cname: "", liters: "" }));
      return;
    }
    // Ensure the code is a string for comparison
    const collection = collectionList.find(
      (collection) => collection.SampleNo.toString() === sample
    );

    if (collection) {
      setValues((prev) => ({
        ...prev,
        cname: collection.cname,
        code: collection.rno,
        liters: collection.Litres,
        rcName: collection.rcName,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        code: "",
        cname: "",
        liters: "",
        rcName: "",
      })); // Clear cname if not found
    }
  };

  // Effect to search for customer when code changes
  useEffect(() => {
    if (values.sample.trim().length > 0) {
      const handler = setTimeout(async () => {
        // Ensure `code` has valid content before making API calls
        findCustomerBySample(values.sample.trim());
        await findmilkCollByCode(values.code.trim());
        // getToken();
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [values.sample, values.code]);

  //Handling Collection Notification

  const sendNotifications = () => {
    const title = "Milk Collection Receipt";
    const body = {
      name: values.cname,
      date: values.date,
      fat: values.fat,
      snf: values.snf,
      liters: values.liters,
      rate: values.rate,
      amount: values.amt,
    };

    // Ensure token is available before dispatching
    if (!token) {
      console.error("Device token is missing");
      return;
    }

    // Dispatch with a single payload object
    dispatch(
      sendNewNotification({
        title, // Notification title
        body, // Notification body details
        deviceToken: token, // Device token for the notification
      })
    );
  };

  const handleCollection = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      // const allEntries = JSON.parse(localStorage.getItem("milkentries")) || [];
      // console.log(allEntries);

      await dispatch(updateMobileColl(values));
      //       const existingEntries =
      //         JSON.parse(localStorage.getItem("milkentries")) || [];
      //
      //       existingEntries.push(values);
      //       localStorage.setItem("milkentries", JSON.stringify(existingEntries));
      setValues(initialValues); // Reset form to initial values
      setErrors({}); // Reset errors

      // await sendNotifications();

      toast.success(`Milk Collection saved successfully!`);

      // Remove customer from custList
      await setCustList((prevList) =>
        prevList.filter((customer) => customer.srno !== values.code)
      );
    } catch (error) {
      console.error("Error sending milk entries to backend:", error);
    }
  };

  return (
    <div className="complete-mobile-milk-container w100 h1 d-flex-col center">
      <span className="page-heading heading w100 h10 t-center">
        Complete Milk Collection
      </span>
      <form
        onSubmit={handleCollection}
        className="complete-mobile-milk-coll w60 h80 d-flex-col center bg p10">
        <div className="form-date-div w100 h10 d-flex a-center j-start px10 my10">
          <label htmlFor="date" className="info-text w10">
            {t("common:c-date")}
            <span className="req">*</span>
          </label>
          <input
            className={`data w30 ${errors.date ? "input-error" : ""}`}
            type="date"
            required
            placeholder="0000"
            name="date"
            id="date"
            onChange={handleInputs}
            value={values.date || ""}
            max={values.date}
          />
        </div>
        <div className="user-details w100 h20 d-flex">
          <div className="form-div w30 px10">
            <label htmlFor="sample" className="info-text ">
              {t("m-sample-no")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.sample ? "input-error" : ""}`}
              type="number"
              required
              placeholder="00"
              name="sample"
              id="sample"
              value={values.sample}
              onChange={handleInputs}
            />
          </div>
          <div className="form-div w20 px10">
            <label htmlFor="code" className="info-text">
              {t("m-cust-code")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.code ? "input-error" : ""}`}
              type="number"
              placeholder="0000"
              name="code"
              id="code"
              value={values.code}
              onChange={handleInputs}
              readOnly
            />
          </div>
          <div className="form-div w50 px10">
            <label htmlFor="cname" className="info-text">
              {t("m-cust-name")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.cname ? "input-error" : ""}`}
              type="text"
              required
              placeholder="smartdairy user"
              name="cname"
              id="cname"
              value={values.cname}
              readOnly
            />
          </div>
        </div>
        <div className="milk-details-div w100 h60 d-flex">
          <div className="milk-info w50 h1 d-flex-col ">
            <div className="form-div px10">
              <label htmlFor="liters" className="info-text">
                {t("common:c-liters")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.liters ? "input-error" : ""}`}
                type="decimal"
                required
                placeholder="00.0"
                name="liters"
                id="liters"
                onChange={handleInputs}
                value={values.liters}
                readOnly
              />
            </div>
            <div className="form-div  px10">
              <label htmlFor="fat" className="info-text">
                {t("common:c-fat")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.fat ? "input-error" : ""}`}
                type="decimal"
                required
                placeholder="0.0"
                name="fat"
                id="fat"
                onChange={handleInputChange}
                value={values.fat}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="snf" className="info-text">
                {t("common:c-snf")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.snf ? "input-error" : ""}`}
                type="decimal"
                required
                placeholder="00.0"
                name="snf"
                id="snf"
                value={values.snf}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="milk-info w50 h1 d-flex-col">
            <div className="form-div px10">
              <label htmlFor="degree" className="info-text">
                {t("common:c-deg")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.degree ? "input-error" : ""}`}
                type="decimal"
                required
                disabled
                placeholder="00.0"
                name="degree"
                id="degree"
                value={values.degree}
                onChange={handleInputs}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="rate" className="info-text">
                {t("common:c-rate")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.rate ? "input-error" : ""}`}
                type="decimal"
                required
                readOnly
                placeholder="00.0"
                name="rate"
                id="rate"
                value={values.rate}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="amt" className="info-text">
                {t("common:c-amt")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.amt ? "input-error" : ""}`}
                type="decimal"
                required
                readOnly
                placeholder="00.0"
                name="amt"
                id="amt"
                value={values.amt}
              />
            </div>
          </div>
        </div>
        <div className="form-btns w100 h10 d-flex a-center j-end">
          <button className="w-btn  label-text" type="reset">
            {t("m-btn-cancel")}
          </button>
          <button className="w-btn label-text mx10" type="submit">
            {t("m-btn-save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteMilkColl;
