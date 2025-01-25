import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mobileMilkCollection,
  mobilePrevLiters,
} from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { toast } from "react-toastify";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import { useTranslation } from "react-i18next";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const MilkSankalan = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const tDate = useSelector((state) => state.date.toDate);
  const { customerlist, loading } = useSelector((state) => state.customer);
  const PrevLiters = useSelector((state) => state.milkCollection.PrevLiters);
  const [collCount, setCollCount] = useState(
    Number(localStorage.getItem("collCount")) || 0
  );
  const [literCount, setLiterCount] = useState(
    Number(localStorage.getItem("literCount")) || 0
  );
  const [customerList, setCustomerList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false); // To handle double-click issue
  const codeInputRef = useRef(null); // Ref for code input

  const initialValues = {
    date: localStorage.getItem("today") || tDate,
    code: "",
    animal: 0,
    liters: "",
    prevliters: "",
    cname: "",
    sample: "",
    acccode: "",
  };

  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    localStorage.setItem("collCount", collCount);
    localStorage.setItem("literCount", literCount);
    localStorage.setItem("today", tDate);
  }, [collCount, literCount, tDate]);

  const resetData = () => {
    localStorage.removeItem("collCount");
    localStorage.removeItem("literCount");
    setCollCount(0);
    setLiterCount(0);
  };

  //............................................................................
  // Customer List .............................................................
  //............................................................................

  useEffect(() => {
    dispatch(listCustomer());
    dispatch(mobilePrevLiters());
  }, []);

  useEffect(() => {
    // When the customer list is updated, store it in localStorage
    if (customerlist.length > 0) {
      localStorage.setItem("customerlist", JSON.stringify(customerlist));
    }
  }, [customerlist]);

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, []);

  //finding Customers Previous Liters
  const findPrevLitersByCode = (code) => {
    if (!code) {
      setValues((prev) => ({ ...prev, prevliters: 0 }));
      return;
    }
    // Ensure the code is a string for comparison
    const prevLiters = PrevLiters.find(
      (liters) => liters.rno.toString() === code
    );

    if (prevLiters) {
      setValues((prev) => ({ ...prev, prevliters: prevLiters.Litres }));
    } else {
      setValues((prev) => ({ ...prev, prevliters: 0 })); // Clear cname if not found
    }
  };

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
      setValues((prev) => ({ ...prev, cname: customer.cname.toString() }));
      setValues((prev) => ({ ...prev, acccode: customer.cid }));
      setValues((prev) => ({ ...prev, rateChartNo: customer.rateChartNo }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  // Effect to search for customer when code changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (values.code.length >= 1) {
        // Adjust length as necessary
        findCustomerByCode(values.code);
        findPrevLitersByCode(values.code);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [values.code]);

  //.....................................................
  // Customer Info ......................................
  //.....................................................

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

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "code":
      case "sample":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Customer code.";
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
      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = ["code", "cname", "liters", "sample"];

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

  const handleMobileCollection = async (e) => {
    if (e) e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true); // Disable button
    try {
      dispatch(mobileMilkCollection(values));
      setValues(initialValues);
      toast.success("Milk Collection Saved Successfully!");
      setCollCount(collCount + 1);
      setLiterCount(literCount + parseFloat(values.liters));
      codeInputRef.current.focus(); // Focus on the code input
    } catch (error) {
      toast.error("Failed to save Milk Collection, try again!");
    } finally {
      setIsSaving(false); // Enable button
    }
  };

  const currentHour = new Date().getHours();
  const heading =
    currentHour < 12 ? `${t("c-mrg-coll")}` : `${t("c-eve-coll")}`;

  return (
    <div className="mobile-milk-collection-conainer w100 h1 d-flex-col center">
      <span className="heading w100 h10 t-center py10">{heading}</span>
      <form
        onSubmit={handleMobileCollection}
        className="mobile-milk-coll-form w60 h70 d-flex-col sa bg p10">
        <div className="show-milk-data-container w100 h10 d-flex a-center px10">
          <div className="form-date w50 d-flex a-center">
            <label htmlFor="date" className="label-text w60">
              {t("milkcollection:m-count")} :
            </label>
            <label htmlFor="date" className="heading w40">
              {collCount}
            </label>
          </div>
          <div className="form-date w50 d-flex a-center">
            <label htmlFor="date" className="label-text w60">
              {t("milkcollection:m-t-liters")} :
            </label>
            <label htmlFor="date" className="heading w40">
              {literCount.toFixed(2)}
            </label>
          </div>
          <button className="w-btn" onClick={resetData}>
            {t("milkcollection:m-btn-reset")}
          </button>
        </div>
        <div className="form-setting w100 h10 d-flex a-center sa">
          <div className="form-date-div w40 d-flex a-center sa">
            <label htmlFor="date" className="info-text w40">
              {t("c-date")} <span className="req">*</span>
            </label>
            <input
              className={`data w60 ${errors.date ? "input-error" : ""}`}
              type="date"
              required
              placeholder="0000"
              name="date"
              id="date"
              onChange={handleInputs}
              value={values.date}
              max={values.date}
              readOnly
            />
          </div>
          <div className="milk-details w50 d-flex a-center px10">
            <label htmlFor="animal" className="info-text w50">
              {t("milkcollection:m-s-milk-type")}
              <span className="req">*</span>
            </label>
            <select
              className="data w50"
              name="animal"
              id="animal"
              onChange={handleInputs}>
              <option value="0">{t("c-cow")}</option>
              <option value="1">{t("c-buffalo")}</option>
            </select>
          </div>
        </div>

        <div className="milk-details-div w100 h15 d-flex a-center sb">
          <div className="form-div user-name w30 px10">
            <label htmlFor="code" className="info-text">
              {t("milkcollection:m-cust-code")} <span className="req">*</span>{" "}
            </label>
            <input
              id="code"
              className={`data  ${errors.code ? "input-error" : ""}`}
              type="number"
              required
              placeholder="0000"
              name="code"
              value={values.code}
              onChange={handleInputs}
              ref={codeInputRef}
            />
          </div>
          <div className="form-div user-name w70  px10">
            <label htmlFor="cname" className="info-text">
              {t("milkcollection:m-cust-name")}<span className="req">*</span>{" "}
            </label>
            <input
              id="cname"
              className="data"
              type="text"
              required
              placeholder={`${t("milkcollection:m-cust-name")}`}
              name="cname"
              value={values.cname}
              readOnly
            />
          </div>
        </div>
        <div className="milk-details-div w100 h15 d-flex a-center sb">
          <div className="form-div w50 px10">
            <label htmlFor="liters" className="info-text">
              {t("c-liters")} <span className="req">*</span>{" "}
              <span className="heading mx10">{values.prevliters}</span>
            </label>
            <input
              id="liters"
              className={`data ${errors.liters ? "input-error" : ""}`}
              type="number"
              required
              placeholder="00.0"
              name="liters"
              onChange={handleInputs}
              value={values.liters}
            />
          </div>
          <div className="form-div w50 px10">
            <label htmlFor="sample" className="info-text">
              {t("milkcollection:m-sample-no")} <span className="req">*</span>{" "}
            </label>
            <input
              id="sample"
              className={`data ${errors.sample ? "input-error" : ""}`}
              type="number"
              required
              placeholder="0"
              name="sample"
              value={values.sample || ""}
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="mobile-milkcoll-form-btns w100 my10 d-flex a-center j-end">
          <button className="btn heading" type="submit" disabled={isSaving}>
            {isSaving
              ? `${t("milkcollection:m-btn-saving")}`
              : `${t("milkcollection:m-btn-save")}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MilkSankalan;
