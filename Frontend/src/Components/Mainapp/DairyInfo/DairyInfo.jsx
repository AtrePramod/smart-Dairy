import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetUpdateState,
  updateDairyDetails,
} from "../../../App/Features/Dairy/registerSlice";
import { toast } from "react-toastify";
import { fetchDairyInfo } from "../../../App/Features/Admin/Dairyinfo/dairySlice";
import "../../../Styles/Mainapp/Dairy/Dairy.css";

const DairyInfo = () => {
  const dispatch = useDispatch();
  const dairyInfo = useSelector((state) => state.dairy.dairyData);
  const status = useSelector((state) => state.dairy.updateDDstatus);
  const loading = useSelector((state) => state.register.loading);
  const error = useSelector((state) => state.register.error);
  const success = useSelector((state) => state.register.success);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    marathiName: "",
    SocietyName: "",
    RegNo: "",
    RegDate: "",
    gstno: "",
    AuditClass: "",
    PhoneNo: "",
    email: "",
    City: "",
    tel: "",
    dist: "",
    PinCode: "",
  });

  useEffect(() => {
    if (dairyInfo) {
      setFormData(dairyInfo);
    }
  }, [dairyInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
      case "marathi_name":
        if (!/^[\u0900-\u097Fa-zA-Z0-9\s]+$/.test(value)) {
          errors[name] = "Invalid name.";
        } else {
          delete errors.marathi_name;
        }
        break;
      case "center_name":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          errors[name] = "Invalid name.";
        } else {
          delete errors.center_name;
        }
        break;
      case "auditclass":
        if (!/^[A-Z\s]+$/.test(value)) {
          errors[name] = "Invalid Audit class.";
        } else {
          delete errors[name];
        }
        break;
      case "gstno":
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(value)) {
          errors[name] =
            "Invalid GST number. It should follow the format: 15 alphanumeric characters.";
        } else {
          delete errors.gstNumber;
        }
        break;
      case "reg_no":
        if (!/^\d{0,19}$/.test(value)) {
          errors.reg_no = "Invalid Register number.";
        } else {
          delete errors.reg_no;
        }
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) {
          errors.mobile = "Invalid Mobile number.";
        } else {
          delete errors.mobile;
        }
        break;
      case "email":
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          errors.email = "Invalid email format.";
        } else {
          delete errors.email;
        }
        break;
      case "city":
      case "tehsil":
      case "district":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          errors[name] = `Invalid ${name}.`;
        } else {
          delete errors[name];
        }
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) {
          errors.pincode = "Invalid pincode.";
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
      "gstno",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    dispatch(updateDairyDetails(formData)); // Dispatch the update action
  };

  useEffect(() => {
    if (success) {
      toast.success("Dairy information updated successfully!");
      dispatch(resetUpdateState()); // Reset state after success
    }
    if (error) {
      toast.error(`Error: ${error}`);
      dispatch(resetUpdateState()); // Reset state after error handling
    }
    dispatch(fetchDairyInfo());
  }, [success, error, dispatch]);

  return (
    <div className="dairy-main-container w100 h1 d-flex center">
      <form
        className="dairy-information-div w50 h90 d-flex-col bg p10"
        onSubmit={handleSubmit}>
        <span className="heading ">Dairy Information</span>
        <div className="dairy-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100 ">Marathi Name : </span>
          <input
            className={`data w100 ${errors.date ? "input-error" : ""}`}
            type="text"
            name="marathiName"
            id="marathiName"
            placeholder="डेरीचे नाव"
            value={formData.marathiName} // Use formData here
            required
            onChange={handleChange}
          />
        </div>
        <div className="dairy-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100 ">English Name :</span>
          <input
            className={`data w100 ${errors.date ? "input-error" : ""}`}
            type="text"
            name="SocietyName"
            placeholder="Dairy Name"
            id="SocietyName"
            value={formData.SocietyName} // Use formData here
            required
            onChange={handleChange}
          />
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="regi-no-div w45 h1 d-flex-col sa">
            <span className="info-text w100 ">Register Number :</span>
            <input
              className="data w100"
              type="number"
              name="RegNo"
              id="RegNo"
              value={formData.RegNo}
              onChange={handleChange}
            />
          </div>
          <div className="regi-no-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Register Date :</span>
            <input
              className="data w100"
              type="date"
              name="RegDate"
              id="RegDate"
              value={formData.RegDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">GST Number :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="gstno"
              id="gstno"
              value={formData.gstno}
              onChange={handleChange}
            />
          </div>
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Audit Class :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="AuditClass"
              id="AuditClass"
              value={formData.AuditClass}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Mobile Number :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="tel"
              name="PhoneNo"
              id="PhoneNo"
              value={formData.PhoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Email :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sb ">
            <span className="info-text w100 ">City :</span>
            <input
              className="data w100"
              type="text"
              name="City" // Updated name for this input
              id="city"
              value={formData.City}
              onChange={handleChange}
            />
          </div>
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Tehsil :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="tel" // Updated name for this input
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sa">
            <span className="info-text w100 ">District :</span>
            <input
              className="data w100"
              type="text"
              name="dist"
              id="dist"
              value={formData.dist}
              onChange={handleChange}
            />
          </div>
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Pincode :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="PinCode"
              id="PinCode"
              value={formData.PinCode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="button-container d-flex w100 h10 my10 center">
          <button className="btn w50 h1" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Dairy Info"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DairyInfo;
