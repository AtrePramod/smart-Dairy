import React, { useEffect, useState } from "react";
import "./Dealer.css";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../../../App/axiosInstance";
import { getMaxCustNo } from "../../../../../App/Features/Customers/customerSlice";

const CreateDealers = () => {
  const dispatch = useDispatch();
  const custno = useSelector((state) => state.customer.maxCustNo);

  const [formData, setFormData] = useState({
    cust_no: custno,
    marathi_name: "",
    cust_name: "",
    mobile: "",
    district: "",
    city: "",
    pincode: "",
    bankName: "",
    bank_ac: "",
    bankIFSC: "",
    ctype: 2, // default value
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getMaxCustNo());
  }, [dispatch]);

  useEffect(() => {
    if (custno) {
      setFormData((prev) => ({ ...prev, cust_no: custno }));
    }
  }, [custno]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field] && field !== "prefix") {
        newErrors[field] = "This field is required";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    // console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // console.log("out try");
      try {
        const response = await axiosInstance.post("/create/dealer", formData);
        alert(response.data.message);
        dispatch(getMaxCustNo());
        setFormData({
          cust_no: custno,
          marathi_name: "",
          cust_name: "",
          mobile: "",
          district: "",
          city: "",
          pincode: "",
          bankName: "",
          bank_ac: "",
          bankIFSC: "",
          ctype: 2,
        });
      } catch (error) {
        console.error("Error creating dealer: ", error);
        alert("There was an error creating the dealer.");
      }
    }
  };

  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formElements = Array.from(document.querySelectorAll(".data"));
      const currentIndex = formElements.findIndex(
        (el) => el.name === fieldName
      );
      if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
      }
    }
  };

  const handleClear = () => {
    setFormData({
      cust_no: custno,
      marathi_name: "",
      cust_name: "",
      mobile: "",
      district: "",
      city: "",
      pincode: "",
      bankName: "",
      bank_ac: "",
      bankIFSC: "",
      ctype: 2,
    });
    setErrors({});
  };

  return (
    <div className="d-flex h1 py15 dealer">
      <div className="bg p10 w100">
        <span className="heading">Create Dealer </span>
        <form onSubmit={handleSubmit}>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                Dealer No: <span className="req">*</span>
              </label>
              <input
                type="number"
                name="cust_no"
                value={formData.cust_no}
                className={`data ${errors.cust_no ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                min="1"
                readOnly
              />
            </div>
          </div>
          <div className="row d-flex">
            <div className="col">
              <label className="info-text px10">
                Marathi Name: <span className="req">*</span>
              </label>
              <input
                type="text"
                name="marathi_name"
                value={formData.marathi_name}
                className={`data ${errors.marathi_name ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="मराठी नाव "
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                English Name:<span className="req">*</span>
              </label>
              <input
                type="text"
                name="cust_name"
                value={formData.cust_name}
                className={`data ${errors.cust_name ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="English Name "
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                Mobile No: <span className="req">*</span>
              </label>
              <input
                type="number"
                name="mobile"
                value={formData.mobile}
                className={`data ${errors.mobile ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="98********"
              />
            </div>
          </div>
          <div className="row d-flex">
            <div className="col">
              <label className="info-text px10">
                District:<span className="req">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                className={`data ${errors.district ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="Pune"
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                City:<span className="req">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                className={`data ${errors.city ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="Mumbai"
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                PinCode:<span className="req">*</span>
              </label>
              <input
                type="number"
                name="pincode"
                value={formData.pincode}
                className={`data ${errors.pincode ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="411001"
              />
            </div>
          </div>
          <div className="row d-flex">
            <div className="col">
              <label className="info-text px10">
                Bank Name:<span className="req">*</span>
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                className={`data ${errors.bankName ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="SBI"
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                Bank No:<span className="req">*</span>
              </label>
              <input
                type="number"
                name="bank_ac"
                value={formData.bank_ac}
                className={`data ${errors.bank_ac ? "input-error" : ""}`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                placeholder="1234567890"
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                IFSC Code:<span className="req">*</span>
              </label>
              <input
                type="text"
                name="bankIFSC"
                value={formData.bankIFSC}
                onKeyDown={(e) => handleKeyDown(e, e.target.name)}
                className={`data ${errors.bankIFSC ? "input-error" : ""}`}
                onChange={handleInputChange}
                placeholder="SBIN0001234"
              />
            </div>
          </div>
          <div className="row d-flex j-end my10">
            <div className="col">
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
            <div className="col">
              <button className="btn" type="button" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDealers;
