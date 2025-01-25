import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../Styles/Home/Forms.css";
import { toast } from "react-toastify";
import { registerUser, reset } from "../../../App/Features/Dairy/registerSlice";

const Register = ({ switchToLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors to get registration status and error from Redux
  const { status, error } = useSelector((state) => state.register);
  const tDate = useSelector((state) => state.date.toDate); // Assuming you have a date slice

  // Local state for form values and errors
  const [values, setValues] = useState({
    dairy_name: "",
    user_name: "",
    user_phone: "",
    user_city: "",
    user_pincode: "",
    user_password: "",
    confirm_password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [prefixString, setPrefixString] = useState("");
  const [endDate, setEndDate] = useState("");

  // Generate prefix string on component mount
  useEffect(() => {
    const generatePrefix = () => {
      const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let prefix = "";
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * alphabets.length);
        prefix += alphabets[randomIndex];
      }
      setPrefixString(prefix);
    };

    generatePrefix();
  }, []);

  // Generate end date 365 days from tDate
  useEffect(() => {
    const generateEndDate = (date) => {
      if (!date) {
        date = new Date().toISOString().split("T")[0]; // Use current date if tDate is not provided
      }
      const currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() + 365);
      const formattedDate = currentDate.toISOString().split("T")[0];
      setEndDate(formattedDate);
    };
    generateEndDate(tDate);
  }, [tDate]);

  // Handle input changes and validation
  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValues = {
      ...values,
      [name]: type === "checkbox" ? checked : value,
    };
    setValues(updatedValues);

    // Validate the field in real-time
    const newErrors = validateField(name, updatedValues[name]);
    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
  };

  // Field validation function
  const validateField = (name, value) => {
    const error = {};
    switch (name) {
      case "dairy_name":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error.dairy_name = "Invalid dairy name.";
        }
        break;
      case "user_name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error.user_name = "Invalid username.";
        }
        break;
      case "user_phone":
        if (!/^\d{10}$/.test(value)) {
          error.user_phone = "Invalid phone number.";
        }
        break;
      case "user_city":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error.user_city = "Invalid city name.";
        }
        break;
      case "user_pincode":
        if (!/^\d{6}$/.test(value)) {
          error.user_pincode = "Invalid pincode.";
        }
        break;
      case "user_password":
        if (value.length < 5) {
          error.user_password = "Password must be at least 5 characters.";
        }
        break;
      case "confirm_password":
        if (value !== values.user_password) {
          error.confirm_password = "Passwords do not match.";
        }
        break;
      case "terms":
        if (!value) {
          error.terms = "You must accept the terms.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Validate all fields before submission
  const validateFields = () => {
    const fieldsToValidate = [
      "dairy_name",
      "user_name",
      "user_phone",
      "user_city",
      "user_pincode",
      "user_password",
      "confirm_password",
      "terms",
    ];
    const errors = {};

    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      Object.assign(errors, fieldError);
    });

    return errors;
  };

  // Handle form registration
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const validationErrors = validateFields();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const requestData = {
        dairy_name: values.dairy_name,
        user_name: values.user_name,
        user_phone: values.user_phone,
        user_city: values.user_city,
        user_pincode: values.user_pincode,
        user_password: values.user_password,
        terms: values.terms ? 1 : 0, // Mapping: true -> 1, false -> 0
        prefix: prefixString,
        date: tDate,
        endDate: endDate,
      };
      dispatch(registerUser(requestData));
    } else {
      toast.error("Please fix the highlighted errors before submitting.");
    }
  };

  // Handle toast notifications based on Redux state
  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Registration successful! Please login.");
      dispatch(reset());

      // Reset form fields
      setValues({
        dairy_name: "",
        user_name: "",
        user_phone: "",
        user_city: "",
        user_pincode: "",
        user_password: "",
        confirm_password: "",
        terms: false,
      });

      // Optionally switch to login form
      switchToLogin();
    } else if (status === "failed") {
      toast.error(error || "Registration failed. Please try again.");
      dispatch(reset());
    }
  }, [status, error, dispatch, switchToLogin]);

  return (
    <div className="form-container w70 h1 d-flex-col">
      <form
        onSubmit={handleRegister}
        className="signup-form w100 d-flex-col align-center p10">
        <span className="title t-center">Register Now</span>
        <div className="data-div w100">
          <label className="text">
            Enter Dairy Name <span className="req">*</span>
          </label>
          <input
            className={`data ${errors.dairy_name ? "error-border" : ""}`}
            type="text"
            name="dairy_name"
            required
            placeholder="smart dairy 2.0"
            value={values.dairy_name}
            onChange={handleInputs}
          />
          {errors.dairy_name && (
            <span className="error-message">Invalid dairy name.</span>
          )}
        </div>

        <div className="data-outer w100 d-flex sb">

          <div className="data-div-2">
            <label className="text">
              Enter Username <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_name ? "error-border" : ""}`}
              type="text"
              name="user_name"
              required
              placeholder="smart dairy"
              value={values.user_name}
              onChange={handleInputs}
            />
            {errors.user_name && (
              <span className="error-message">Invalid username.</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="data-div-2">
            <label className="text">
              Enter Phone Number <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_phone ? "error-border" : ""}`}
              type="tel"
              name="user_phone"
              required
              placeholder="Mobile Number"
              value={values.user_phone}
              onChange={handleInputs}
            />
            {errors.user_phone && (
              <span className="error-message">Invalid phone number.</span>
            )}
          </div>
        </div>

        {/* City and Pincode */}
        <div className="data-outer w100 d-flex sb">
          {/* City */}
          <div className="data-div-2">
            <label className="text">
              Enter City <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_city ? "error-border" : ""}`}
              type="text"
              name="user_city"
              required
              placeholder="Location"
              value={values.user_city}
              onChange={handleInputs}
            />
            {errors.user_city && (
              <span className="error-message">Invalid city name.</span>
            )}
          </div>

          {/* Pincode */}
          <div className="data-div-2">
            <label className="text">
              Enter Pincode <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_pincode ? "error-border" : ""}`}
              type="number"
              name="user_pincode"
              required
              placeholder="Pincode"
              value={values.user_pincode}
              onChange={handleInputs}
            />
            {errors.user_pincode && (
              <span className="error-message">Invalid pincode.</span>
            )}
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="data-outer w100 d-flex sb">
          {/* Password */}
          <div className="data-div-2">
            <label className="text">
              Enter Password <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_password ? "error-border" : ""}`}
              type="password"
              name="user_password"
              required
              placeholder="Password"
              value={values.user_password}
              onChange={handleInputs}
            />
            {errors.user_password && (
              <span className="error-message">
                Password must be at least 5 characters.
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="data-div-2">
            <label className="text">
              Confirm Password <span className="req">*</span>
            </label>
            <input
              className={`data ${
                errors.confirm_password ? "error-border" : ""
              }`}
              type="password"
              name="confirm_password"
              required
              placeholder="Confirm Password"
              value={values.confirm_password}
              onChange={handleInputs}
            />
            {errors.confirm_password && (
              <span className="error-message">Passwords do not match.</span>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="terms-conditions h10 d-flex center">
          <span className="w100 d-flex text center p10">
            <input
              className={`checkboxx ${errors.terms ? "error-border" : ""}`}
              type="checkbox"
              name="terms"
              checked={values.terms}
              onChange={handleInputs}
            />{" "}
            I agree to all terms and conditions.<span className="req">*</span>
          </span>
          {errors.terms && (
            <span className="error-message">You must accept the terms.</span>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="btn w100"
          disabled={status === "loading"}>
          {status === "loading" ? "Registering..." : "Register"}
        </button>

        <div className="account-check-div">
          <h2 className="text">
            I already have an account?{" "}
            <button onClick={switchToLogin} className="swith-form-button">
              Login
            </button>{" "}
            Now!
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Register;
