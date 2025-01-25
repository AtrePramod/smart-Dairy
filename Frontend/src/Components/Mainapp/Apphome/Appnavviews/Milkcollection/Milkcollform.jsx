import React, { useEffect, useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { saveMilkCollection } from "../../../../../App/Features/Mainapp/Dairyinfo/milkCollectionSlice";
import {
  fetchEntries,
  saveMilkOneEntry,
} from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { toast } from "react-toastify";
import {
  fetchFCMTokens,
  sendNewNotification,
} from "../../../../../App/Features/Notifications/notificationSlice";
import { useTranslation } from "react-i18next";
import { getRateCharts } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const MilkColleform = ({ switchToSettings }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);

  const tDate = useSelector((state) => state.date.toDate);
  const token = useSelector((state) => state.notify.fcmToken);
  const milkColl = useSelector((state) => state.milkCollection.entries || []);
  const [customerList, setCustomerList] = useState([]);
  const [custList, setCustList] = useState({}); // to check remainning customer list
  const [milkRateChart, setMilkRatechart] = useState([]);
  const [time, setTime] = useState(true);
  const [errors, setErrors] = useState({});
  const [slotCount, setSlotCount] = useState(0); //To rerive local stored milk entries

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

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
      setCustList(JSON.parse(storedCustomerList));
    }
    dispatch(getRateCharts());
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
      const { fat, snf, liters, rcName } = values;

      const parsedFat = parseFloat(fat);
      const parsedSnf = parseFloat(snf);
      const parsedLiters = parseFloat(liters);
      const degree = (parsedFat * parsedSnf).toFixed(2);

      const rateEntry = milkRateChart.find(
        (entry) =>
          entry.fat === parsedFat &&
          entry.snf === parsedSnf &&
          entry.rctypename === rcName
      );

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
      setValues((prev) => ({
        ...prev,
        cname: customer.cname,
        acccode: customer.cid,
        rcName: customer.rcName,
      }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  //calulate slots on the basis of customer no
  // useEffect(() => {
  //   const customerCount = customerList.length;
  //   const fSlots = Math.floor(customerCount / 20);
  //   const remaining = customerCount % 20;
  //   setFullSlots(fSlots);
  // }, [customerList]);

  //store the milk collection entry untile 20 entries and send a collection entry to customer
  //   const saveMilkCollectionDB = async () => {
  //     if (fullSlots !== 0) {
  //       // dispatch milk collection function (slot wise)
  //       if (milkColl.length > 0) {
  //         console.log(milkColl);
  //
  //         await dispatch(saveMilkCollection(milkColl));
  //       }
  //       setFullSlots(fullSlots - 1);
  //     }
  //   };

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

  // retriving milk entry from localstorage to display
  useEffect(() => {
    dispatch(fetchEntries());
    // console.log("remainning", custList);
  }, [slotCount]);

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

  //Handling Milk Collection

  const handleCollection = async (e) => {
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

      dispatch(saveMilkOneEntry(values));
      const existingEntries =
        JSON.parse(localStorage.getItem("milkentries")) || [];

      await existingEntries.push(values);
      localStorage.setItem("milkentries", JSON.stringify(existingEntries));
      setValues(initialValues); // Reset form to initial values
      setErrors({}); // Reset errors

      sendNotifications();

      toast.success(`Milk Collection of ${values.cname} saved successfully!`);

      // Remove customer from custList
      setCustList((prevList) =>
        prevList.filter((customer) => customer.srno !== values.code)
      );
      console.log("asas", custList);
    } catch (error) {
      console.error("Error sending milk entries to backend:", error);
    }

    //     if (slotCount === 20) {
    //       try {
    //         const allEntries =
    //           JSON.parse(localStorage.getItem("milkentries")) || [];
    //         console.log(allEntries);
    //
    //         // Send entries to backend (use an API call here)
    //         await setmilkEntry(allEntries);
    //         await saveMilkCollectionDB();
    //
    //         // Clear the entries from localStorage after sending to backend
    //         await localStorage.removeItem("milkentries");
    //
    //         // Reset slot count
    //         setSlotCount(0);
    //
    //         // Remove customer from custList
    //         await setCustList((prevList) =>
    //           prevList.filter((customer) => customer.srno !== values.code)
    //         );
    //       } catch (error) {
    //         console.error("Error sending milk entries to backend:", error);
    //       }
    //     }
    //
    //     if (fullSlots > 0) {
    //       // If all validations pass, proceed with saving to localStorage
    //       const existingEntries =
    //         JSON.parse(localStorage.getItem("milkentries")) || [];
    //
    //       existingEntries.push(values);
    //       localStorage.setItem("milkentries", JSON.stringify(existingEntries));
    //       console.log("saved entries", existingEntries);
    //
    //       setMilkCollEntry(existingEntries);
    //
    //       // // Remove customer from custList after saving entry to localStorage
    //       // const updatedList = custList.filter(
    //       //   (customer) => customer.srno !== values.code
    //       // );
    //       // console.log("custList");
    //       // setCustList(updatedList);
    //       removeCustomerFromList();
    //
    //       toast.success(`Milk Collection of ${values.cname} saved successfully!`);
    //
    //       // Increment the slot count
    //       setSlotCount(slotCount + 1);
    //     }
    //
    //     if (fullSlots === 0) {
    //       await dispatch(saveMilkOneEntry(values));
    //       await localStorage.removeItem("milkentries");
    //
    //       toast.success(`Milk Collection of ${values.cname} saved successfully!`);
    //
    //       // Remove customer from custList after saving the entry
    //       setCustList((prevList) =>
    //         prevList.filter((customer) => customer.srno !== values.code)
    //       );
    //     }
  };

  return (
    <>
      <form
        onSubmit={handleCollection}
        className="milk-col-form w100 h1 d-flex-col bg p10">
        <span className="heading w100 t-center py10">
          {!time ? `${t("common:c-eve")}` : `${t("common:c-mrg")}`}{" "}
          {t("m-milkcoll")}
        </span>
        <div className="form-setting w100 h10 d-flex a-center sb ">
          <div className="w60 d-flex a-center px10">
            <label htmlFor="date" className="info-text w30">
              {t("common:c-date")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data w50 ${errors.date ? "input-error" : ""}`}
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
          <div className="setting-btn-switch w20 j-center d-flex">
            {/* <span className="text">Morning</span> */}
            <button
              type="button"
              onClick={handleTime}
              className={`sakalan-time text ${time ? "on" : "off"}`}
              aria-pressed={time}>
              {time ? `${t("common:c-mrg")}` : `${t("common:c-eve")}`}
            </button>
            {/* <span className="text">Evening</span> */}
          </div>
          <BsGearFill className="color-icon w10" onClick={switchToSettings} />
        </div>
        <div className="user-details w100 h20 d-flex">
          <div className="form-div w50 px10">
            <label htmlFor="code" className="info-text">
              {t("m-cust-code")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.code ? "input-error" : ""}`}
              type="number"
              required
              placeholder="0000"
              name="code"
              id="code"
              value={values.code}
              onChange={handleInputs}
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
              placeholder={`${t("m-cust-name")}`}
              name="cname"
              id="cname"
              value={values.cname}
              readOnly
            />
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex">
          {/* <span className="label-text">Milk Details : </span> */}
          {/* <div className="milk-details w100 h90 d-flex"> */}
            <div className="milk-info w50 h1 d-flex-col">
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
                  onChange={handleInputChange}
                  value={values.snf}
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
          {/* </div> */}
        </div>
        <div className="form-btns w100 h10 d-flex a-center j-end">
          <button className="w-btn label-text" type="reset">
            {t("m-btn-cancel")}
          </button>
          <button className="w-btn label-text mx10" type="submit">
            {t("m-btn-save")}
          </button>
        </div>
      </form>
    </>
  );
};

export default MilkColleform;
