import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  centersLists,
  createCenter,
  maxCenterId,
} from "../../../../App/Features/Dairy/Center/centerSlice";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import "../../../../Styles/Mainapp/Dairy/Center.css";

const CreateCenter = () => {
  const dispatch = useDispatch();
  const dairy_id = useSelector((state) => state.dairy.dairyData.SocietyCode);
  const centerId = useSelector((state) => state.center.maxId.centerId);
  const status = useSelector((state) => state.center.createcstatus);
  const date = useSelector((state) => state.date.toDate);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [prefixString, setPrefixString] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  //   // Generate prefix string on component mount
  //   useEffect(() => {
  //     const generatePrefix = () => {
  //       const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //       let prefix = "C";
  //       for (let i = 0; i < 2; i++) {
  //         const randomIndex = Math.floor(Math.random() * alphabets.length);
  //         prefix += alphabets[randomIndex];
  //       }
  //       setPrefixString(prefix);
  //     };
  //
  //     generatePrefix();
  //   }, []);

  const [formData, setFormData] = useState({
    marathi_name: "",
    center_name: "",
    reg_no: "",
    reg_date: "",
    center_id: centerId || "",
    auditclass: "",
    mobile: "",
    email: "",
    city: "",
    tehsil: "",
    district: "",
    pincode: "",
    password: "",
    date: date,
    prefix: prefixString,
  });

  useEffect(() => {
    const generatePrefix = () => {
      const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let prefix = "C";
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * alphabets.length);
        prefix += alphabets[randomIndex];
      }
      setPrefixString(prefix);
    };
    generatePrefix();
  }, []);

  // Fetch maxCenterId on mount
  useEffect(() => {
    dispatch(maxCenterId(dairy_id)).then(() => setLoading(false));
  }, [dispatch, dairy_id]);

  // Update center_id when loading is complete
  useEffect(() => {
    if (!loading) {
      setFormData((prevData) => ({
        ...prevData,
        center_id: centerId || "",
        prefix: prefixString || "",
      }));
    }
  }, [centerId, loading]);

  const handleChange = (e) => {
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
    const error = {};
    switch (name) {
      case "marathi_name":
        if (!/^[\u0900-\u097Fa-zA-Z0-9\s]+$/.test(value)) {
          error[name] = "Invalid name.";
        } else {
          delete errors.marathi_name;
        }
        break;
      case "center_name":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error[name] = "Invalid name.";
        } else {
          delete errors.center_name;
        }
        break;
      case "auditclass":
        if (!/^[A-Z\s]+$/.test(value)) {
          error.auditclass = "Invalid Audit class.";
        } else {
          delete errors.auditclass;
        }
        break;
      case "reg_no":
        if (!/^\d{0,19}$/.test(value)) {
          error.reg_no = "Invalid Register number.";
        } else {
          delete errors.reg_no;
        }
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) {
          error.mobile = "Invalid Mobile number.";
        } else {
          delete errors.mobile;
        }
        break;
      case "email":
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error.email = "Invalid email format.";
        } else {
          delete errors.email;
        }
        break;
      case "city":
      case "tehsil":
      case "district":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = `Invalid ${name}.`;
        } else {
          delete errors[name];
        }
        break;
      case "password":
        if (value.length < 5) {
          error.password = "Password must be at least 5 characters.";
        } else {
          delete errors.password;
        }
        break;
      case "confirm_pass":
        if (value !== formData.password) {
          error.confirm_pass = "Passwords do not match.";
        } else {
          delete errors.confirm_pass;
        }
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) {
          error.pincode = "Invalid pincode.";
        } else {
          delete errors.pincode;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = [
      "marathi_name",
      "center_name",
      "auditclass",
      "city",
      "tehsil",
      "district",
      "pincode",
      "password",
      "confirm_pass",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(createCenter(formData));
      dispatch(maxCenterId(dairy_id)); // Refresh max center ID
      dispatch(centersLists()); // Refresh list of centers
      toast.success("Center created successfully!");
    } catch (error) {
      toast.error("Failed to create center. Please try again.");
    }
  };

  return (
    <div className="center-main-container w100 h1 d-flex center">
      <form
        className="center-information-div w50 h1 d-flex-col sa bg p10"
        onSubmit={handleSubmit}>
        <span className="heading h10">Create New Dairy Center</span>
        {/* Form Fields */}
        <div className="center-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100">
            Marathi Name{" "}
            {errors.marathi_name && (
              <span className="text error-message">{errors.marathi_name}</span>
            )}
          </span>
          <input
            className={`data w100 ${errors.date ? "input-error" : ""}`}
            type="text"
            name="marathi_name"
            id="marathi_name"
            placeholder="सेंटरचे नाव"
            onChange={handleChange}
            required
          />
        </div>
        <div className="center-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100">
            English Name{" "}
            {errors.center_name && (
              <span className="text error-message">{errors.center_name}</span>
            )}{" "}
          </span>
          <input
            className={`data w100 ${errors.date ? "input-error" : ""}`}
            type="text"
            name="center_name"
            id="center_name"
            placeholder="Center Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="center-add-data-div w100 h10 d-flex a-center sb">
          <div className="center-details-div center-data w20 d-flex-col sa">
            <span className="info-text w100">Center No.</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="number"
              name="center_id"
              id="center_id"
              value={formData.center_id}
              onChange={handleChange}
              disabled
              required
            />
          </div>
          <div className="center-details-div center-data w20 d-flex-col sa">
            <span className="info-text w100">
              Audit Class{" "}
              {errors.auditclass && (
                <span className="text error-message">{errors.auditclass}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="auditclass"
              id="auditclass"
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w20 d-flex-col sa">
            <span className="info-text w100">
              Register No.{" "}
              {errors.reg_no && (
                <span className="text error-message">{errors.reg_no}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="number"
              name="reg_no"
              id="reg_no"
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w30 d-flex-col sa">
            <span className="info-text w100">
              Register Date{" "}
              {errors.reg_date && (
                <span className="text error-message">{errors.reg_date}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="date"
              name="reg_date"
              id="reg_date"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="center-add-data-div w100 h15 d-flex a-center sb">
          <div className="center-details-div w30 d-flex-col sa">
            <span className="info-text">
              Mobile{" "}
              {errors.mobile && (
                <span className="text error-message">{errors.mobile}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="mobile"
              id="mobile"
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div w60 d-flex-col sa">
            <span className="info-text">
              Email{" "}
              {errors.email && (
                <span className="text error-message">{errors.email}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="center-add-data-div w100 h10 d-flex a-center sb">
          <div className="center-details-div center-data w20 d-flex-col sa">
            <span className="info-text w100">
              City{" "}
              {errors.city && (
                <span className="text error-message">{errors.city}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="city"
              id="city"
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w25 d-flex-col sa">
            <span className="info-text w100">
              Tehsil{" "}
              {errors.tehsil && (
                <span className="text error-message">{errors.tehsil}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="tehsil"
              id="tehsil"
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w25 d-flex-col sa">
            <span className="info-text w100">
              District{" "}
              {errors.district && (
                <span className="text error-message">{errors.district}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="district"
              id="district"
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w20 d-flex-col sa">
            <span className="info-text w100">
              Pincode{" "}
              {errors.pincode && (
                <span className="text error-message">{errors.pincode}</span>
              )}
            </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="pincode"
              id="pincode"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="add-data-div w100 h10 d-flex a-center my10 sb">
          <div className="center-pass-details-div w45">
            <span className="text w100">Password</span>
            <div className="password-input-container w100 d-flex a-center">
              <input
                className="pass w90"
                type={showMPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
              />
              <span
                className="eye-icon w10 d-flex a-center"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <IoMdEyeOff className="pss-eye" />
                ) : (
                  <IoMdEye className="pss-eye" />
                )}
              </span>
            </div>
          </div>
          <div className="center-pass-details-div w45">
            <span className="text w100">Confirm Password</span>
            <div className="password-input-container d-flex a-center">
              <input
                className="pass w90"
                type={showPassword ? "text" : "password"}
                name="confirm_pass"
                onChange={handleChange}
              />
              <span
                className="eye-icon w10 d-flex a-center"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? (
                  <IoMdEyeOff className="pss-eye" />
                ) : (
                  <IoMdEye className="pss-eye" />
                )}
              </span>
            </div>
          </div>
          {/* <div className="data center-details-div w45 d-flex-col sa">
            <span className="info-text w100">
              Password{" "}
              {errors.password && (
                <span className="text error-message">{errors.password}</span>
              )}
            </span>
            <div className="password-input-container w100 d-flex sb">
              <input
                className="pass w90"
                type={showPassword ? "text" : "password"}
                name="password"
                id="pass"
                onChange={handleChange}
              />
              <span
                className="eye-icon w10 d-flex a-center"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <IoMdEyeOff className="pss-eye" />
                ) : (
                  <IoMdEye className="pss-eye" />
                )}
              </span>
            </div>
          </div> */}
          {/* <div className="center-details-div w45 d-flex-col sa">
            <span className="info-text w100">
              Confirm Password{" "}
              {errors.confirm_pass && (
                <span className="text error-message">
                  {errors.confirm_pass}
                </span>
              )}
            </span>
            <div className="password-input-container w100 d-flex sb">
              <input
                className="pass w90"
                type={showCPassword ? "text" : "password"}
                name="confirm_pass"
                id="confirm_pass"
                onChange={handleChange}
              />
              <span
                className="eye-icon w10 d-flex a-center"
                onClick={() => setShowCPassword(!showCPassword)}>
                {showCPassword ? (
                  <IoMdEyeOff className="pss-eye" />
                ) : (
                  <IoMdEye className="pss-eye" />
                )}
              </span>
            </div>
          </div> */}
        </div>
        <button
          type="submit"
          className="btn my5"
          disabled={status === "loading"}>
          {status === "loading" ? "creating..." : "CREATE"}
        </button>
      </form>
    </div>
  );
};

export default CreateCenter;
