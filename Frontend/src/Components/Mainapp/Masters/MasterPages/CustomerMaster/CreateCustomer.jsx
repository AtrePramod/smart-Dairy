import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCustomer,
  getMaxCustNo,
  listCustomer,
} from "../../../../../App/Features/Customers/customerSlice";
import { toast } from "react-toastify";
import { updateCustomer } from "../../../../../App/Features/Mainapp/Masters/custMasterSlice";
import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";
import { listRateCharts } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";

const CreateCustomer = () => {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const toDate = useSelector((state) => state.date.toDate);
  const custno = useSelector((state) => state.customer.maxCustNo);
  const prefix = useSelector((state) => state.dairy.dairyData.prefix);
  const status = useSelector((state) => state.customer.status);
  const ratechartlist = useSelector((state) => state.ratechart.ratechartList);

  const [formData, setFormData] = useState({
    cid: "",
    isActive: 1,
    isMember: 0,
    date: toDate,
    prefix: prefix,
    cust_no: custno,
    marathi_name: "",
    cust_name: "",
    member_date: null,
    mobile: "",
    aadhaar_no: "",
    caste: "",
    gender: 0,
    city: "",
    tehsil: "",
    district: "",
    pincode: "",
    milktype: 0,
    rctype: "",
    farmerid: "",
    bankName: "",
    bank_ac: "",
    bankIFSC: "",
    deposit: 0,
    commission: 0,
    rebet: 0,
    transportation: 0,
    h_deposit: 0,
    h_deduction: 0,
    h_allrebet: 0,
    h_sanghrebet: 0,
    h_dairyrebet: 0,
    h_transportation: 0,
  });

  useState(() => {
    dispatch(listRateCharts());
  }, []);

  console.log(customerList);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setFormData((prevData) => ({
        ...prevData,
        cust_no: "",
      }));
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      isActive: 1,
      isMember: 0,
      date: toDate,
      prefix: prefix,
      cust_no: custno,
      marathi_name: "",
      cust_name: "",
      member_date: null,
      mobile: "",
      aadhaar_no: "",
      caste: "",
      gender: 0,
      city: "",
      tehsil: "",
      district: "",
      pincode: "",
      milktype: 0,
      rctype: 0,
      farmerid: "",
      bankName: "",
      bank_ac: "",
      bankIFSC: "",
      deposit: 0,
      commission: 0,
      rebet: 0,
      transportation: 0,
      h_deposit: 0,
      h_deduction: 0,
      h_allrebet: 0,
      h_sanghrebet: 0,
      h_dairyrebet: 0,
      h_transportation: 0,
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleIsActive = () => {
    setIsActive((prev) => !prev);
    setFormData((prevData) => ({
      ...prevData,
      isActive: !isActive ? 1 : 0, // Set 1 for true, 0 for false
    }));
  };

  const handleIsMember = () => {
    setIsMember((prev) => !prev);
    setFormData((prevData) => ({
      ...prevData,
      isMember: !isMember ? 1 : 0, // Set 1 for true, 0 for false
    }));
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? 1 : 0, // For checkboxes, set 1 for true, 0 for false
      }));
    } else {
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
    }
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "cust_no":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Cust number.";
        } else {
          delete errors[name];
        }
        break;

      case "marathi_name":
        if (!/^[\u0900-\u097F\sA-Za-z0-9\/]+$/.test(value)) {
          error[name] = "Invalid Marathi name.";
        } else {
          delete errors[name];
        }
        break;

      case "cust_name":
        if (!/^[a-zA-Z0-9\s\/]+$/.test(value)) {
          error[name] = "Invalid English name.";
        } else {
          delete errors[name];
        }
        break;

      case "mobile":
        if (!/^\d{10}$/.test(value.toString())) {
          error[name] = "Invalid Mobile number.";
        } else {
          delete errors[name];
        }
        break;

      case "aadhaar_no":
        if (!/^\d{12}$/.test(value.toString())) {
          error[name] = "Invalid Aadhaar number.";
        } else {
          delete errors[name];
        }
        break;

      case "city":
      case "tehsil":
      case "district":
      case "bankName":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid name.";
        } else {
          delete errors[name];
        }
        break;

      case "pincode":
        if (!/^\d{6}$/.test(value.toString())) {
          error[name] = "Invalid Pincode.";
        } else {
          delete errors[name];
        }
        break;

      case "farmerid":
        if (!/^\d{12}$/.test(value.toString())) {
          error[name] = "Invalid Farmer ID.";
        } else {
          delete errors[name];
        }
        break;

      case "bank_ac":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Bank Account.";
        } else {
          delete errors[name];
        }
        break;

      case "bankIFSC":
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          error[name] = "Invalid IFSC code.";
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
      "cust_no",
      "marathi_name",
      "cust_name",
      "mobile",
      "gender",
      "city",
      "tehsil",
      "district",
      "pincode",
      "milktype",
      "rctype",
    ];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  };

  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

  // Effect to search for customer when code changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.cust_no.length >= 1) {
        // Adjust length as necessary
        findCustomerByCode(formData.cust_no);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.cust_no, isEditing]);

  const findCustomerByCode = (code) => {
    if (isEditing) {
      const customer = customerList.find(
        (customer) => customer.srno.toString() === code
      );

      if (customer) {
        setFormData((prev) => ({
          ...prev,
          cid: customer.cid,
          marathi_name: customer.engName,
          cust_name: customer.cname,
          mobile: customer.Phone,
          aadhaar_no: customer.cust_addhar,
          pincode: customer.cust_pincode,
          caste: customer.caste,
          bankIFSC: customer.cust_ifsc,
          gender: customer.gender,
          city: customer.City,
          tehsil: customer.tal,
          district: customer.dist,
          milktype: customer.milktype,
          rctype: customer.rcName,
          farmerid: customer.cust_farmerid,
          bankName: customer.cust_bankname,
          bank_ac: customer.cust_accno,
          h_deposit: customer.h_deposit,
          h_deduction: customer.h_deduction,
          h_allrebet: customer.h_allrebet,
          h_sanghrebet: customer.h_sanghrebet,
          h_dairyrebet: customer.h_dairyrebet,
          h_transportation: customer.h_transportation,
        }));
      } else {
        toast.error("Customer not found.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isEditing) {
        // Update existing customer in DB
        dispatch(updateCustomer(formData));
        toast.success("Customer updated successfully!");
      } else {
        // Create new customer
        dispatch(createCustomer(formData));
        dispatch(getMaxCustNo());
        dispatch(listCustomer());
        setFormData((prevData) => ({
          ...prevData,
          cust_no: custno,
        }));

        toast.success("Customer created successfully!");
      }

      // Reset the form after fetching the new cust_no
      resetForm();
    } catch (error) {
      toast.error("Failed to create Customer. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`cust-details-setting-div w100 h1 d-flex sa ${
        isEditing ? "edit-bg" : "bg"
      }`}
    >
      <div className="customer-details-container w60 h1 d-flex-col">
        <div className="tilte-container w100 d-flex a-center sb p10">
          <span className="heading ">
            {isEditing ? "Update Customer" : "Create Customer"}
          </span>
          <div className="toggle-inputs-div w30 h40 d-flex a-center sa">
            <span className="info-text w70 px10">
              Is Active <span className="req">*</span>
            </span>
            <button
              type="button"
              onClick={handleIsActive}
              className={`toggle-button ${isActive ? "on" : "off"}`}
              aria-pressed={isActive}
            >
              {isActive ? "Yes" : "No"}
            </button>
          </div>
        </div>
        <div className="cust-div cust-details-div w100 h15 d-flex a-center sb">
          <div className="details-div w30 d-flex-col a-center px10">
            <span className="info-text w100">
              Cust No.<span className="req">*</span>{" "}
              {errors.cust_no && (
                <span className="text error-message">{errors.cust_no}</span>
              )}
            </span>
            <input
              required
              className={`data w100 ${errors.cust_no ? "input-error" : ""}`}
              type="number"
              name="cust_no"
              value={formData.cust_no || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="details-div w70 d-flex a-center sb">
            <div className="toggle-inputs-div  h50 d-flex-col a-center sa">
              <span className="info-text w100 px10">Is Member</span>
              <button
                type="button"
                onClick={handleIsMember}
                className={`toggle-button ${isMember ? "on" : "off"}`}
              >
                {isMember ? "Yes" : "No"}
              </button>
            </div>
            {isMember && (
              <div className="toggle-inputs-div w60 h50 d-flex-col sb">
                <span className="info-text w100 px10">Membership Date</span>
                <input
                  className={`data w100 ${errors.cust_no ? "input-error" : ""}`}
                  type="date"
                  name="member_date"
                  id=""
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className="cust-div cust-details-div w100 h15 d-flex sb">
          <div className="mcname-details-div w50 d-flex-col a-center px10">
            <span className=" info-text w100">
              Customer Marathi Name<span className="req">*</span>{" "}
              {errors.marathi_name && (
                <span className="text error-message">
                  {errors.marathi_name}
                </span>
              )}
            </span>
            <input
              required
              className={`data w100 ${
                errors.marathi_name ? "input-error" : ""
              }`}
              type="text"
              name="marathi_name"
              id=""
              onChange={handleInputChange}
              value={formData.marathi_name || ""}
            />
          </div>
          <div className="cname-details-div w50 d-flex-col a-center px10">
            <span className="info-text w100">
              Customer English Name<span className="req">*</span>
            </span>
            <input
              required
              className={`data w100 ${errors.cust_name ? "input-error" : ""}`}
              type="text"
              name="cust_name"
              id=""
              value={formData.cust_name || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="cust-div contact-details-div w100 h15 d-flex sb">
          <div className="mobile-details-div w25 d-flex-col a-center px10">
            <span className="info-text w100 ">
              Mobile<span className="req">*</span>
            </span>
            <input
              required
              className={`data w100 ${errors.mobile ? "input-error" : ""}`}
              type="number"
              name="mobile"
              id=""
              onChange={handleInputChange}
              value={formData.mobile || ""}
            />
          </div>
          <div className="Aadhhar-details-div w30 d-flex-col a-center px10">
            <span className="info-text w100">Aadhaar No.</span>{" "}
            {errors.aadhaar_no && (
              <span className="text error-message">{errors.aadhaar_no}</span>
            )}
            <input
              className={`data w100 ${errors.aadhaar_no ? "input-error" : ""}`}
              type="text"
              name="aadhaar_no"
              onChange={handleInputChange}
              value={formData.aadhaar_no || ""}
            />
          </div>
          <div className="caste-details-div w20 d-flex-col a-center px10">
            <span className="info-text w100">Caste</span>{" "}
            {errors.caste && (
              <span className="text error-message">{errors.caste}</span>
            )}
            <input
              className={`data w100 ${errors.caste ? "input-error" : ""}`}
              type="text"
              name="caste"
              onChange={handleInputChange}
              value={formData.caste || ""}
            />
          </div>
          <div className="gender-details-div w30 d-flex-col a-center px10">
            <span className="info-text w100 h50">Gender</span>
            <div className="gender-input-div w100 h50 d-flex">
              <div className="gender-input w50 h40 d-flex a-center sb">
                <input
                  className="data w20"
                  type="radio"
                  name="gender"
                  value="0"
                  id="male"
                  onChange={handleInputChange}
                  checked={formData.gender === "0"}
                />
                <span className="info-text w80">Male</span>
              </div>
              <div className="gender-input w50 h40 d-flex a-center sb">
                <input
                  className="data w20"
                  type="radio"
                  name="gender"
                  value="1"
                  id="female"
                  onChange={handleInputChange}
                  checked={formData.gender === "1"}
                />
                <span className="info-text w80">Female</span>
              </div>
            </div>
          </div>
        </div>
        <div className="cust-div address-details-div w100 h15 d-flex-col sb">
          {/* <span className="info-text px10">Address Details :</span> */}
          <div className="address-details w100 h1 d-flex sb">
            <div className="city-details-div w25 d-flex-col a-center px10">
              <span className="info-text w100 ">
                City<span className="req">*</span>
              </span>
              <input
                required
                className={`data w100 ${errors.city ? "input-error" : ""}`}
                type="text"
                name="city"
                id=""
                onChange={handleInputChange}
                value={formData.city || ""}
              />
            </div>
            <div className="tehsil-details-div w30 d-flex-col a-center px10">
              <span className="info-text w100">
                Tehsil<span className="req">*</span>{" "}
                {errors.tehsil && (
                  <span className="text error-message">{errors.tehsil}</span>
                )}
              </span>
              <input
                required
                className={`data w100 ${errors.tehsil ? "input-error" : ""}`}
                type="text"
                name="tehsil"
                id=""
                onChange={handleInputChange}
                value={formData.tehsil || ""}
              />
            </div>
            <div className="dist-details-div w30 d-flex-col a-center px10">
              <span className="info-text w100">
                District<span className="req">*</span>{" "}
                {errors.district && (
                  <span className="text error-message">{errors.district}</span>
                )}
              </span>
              <input
                required
                className={`data w100 ${errors.district ? "input-error" : ""}`}
                type="text"
                name="district"
                id=""
                onChange={handleInputChange}
                value={formData.district || ""}
              />
            </div>
            <div className="pincode-details-div w20 d-flex-col a-center px10">
              <span className="info-text w100">
                Pincode<span className="req">*</span>{" "}
                {errors.pincode && (
                  <span className="text error-message">{errors.pincode}</span>
                )}
              </span>
              <input
                required
                className={`data w100 ${errors.pincode ? "input-error" : ""}`}
                type="text"
                name="pincode"
                onChange={handleInputChange}
                value={formData.pincode || ""}
              />
            </div>
          </div>
        </div>
        <div className="cust-div milk-details-container w100 h15 d-flex-col sb">
          {/* <span className="info-text px10">Milk Details :</span> */}
          <div className="milk-details-div w100 h1 d-flex  sb">
            <div className="milk-type-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100 h50">
                Milk Type <span className="req">*</span>
              </span>
              <div className="gender-input-div w100 h50 d-flex">
                <div className="gender-input w50 h40 d-flex a-center sb">
                  <input
                    className="data w20"
                    type="radio"
                    name="milktype"
                    value={0}
                    id="cow"
                    onChange={handleInputChange}
                    checked={formData.milktype === "0"}
                  />
                  <span className="info-text w80">Cow</span>
                </div>
                <div className="gender-input w50 h40 d-flex a-center sb">
                  <input
                    className="data w20"
                    type="radio"
                    name="milktype"
                    id="buffalo"
                    value={1}
                    onChange={handleInputChange}
                    checked={formData.milktype === "1"}
                  />
                  <span className="info-text w80">Buffalo</span>
                </div>
              </div>
            </div>
            <div className="ratechart-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100">Rate Chart Type</span>{" "}
              <select
                name="rctype"
                id="ratechartlist"
                className={`data w100 ${errors.rctype ? "input-error" : ""}`}
                onChange={handleInputChange}
                value={formData.rctype || ""}
                aria-label="Select Ratechart"
              >
                <option value="">-- select --</option>
                {ratechartlist && ratechartlist.length > 0 ? (
                  ratechartlist.map((chart, i) => (
                    <option key={i} value={chart.rctypename}>
                      {chart.rctypename}
                    </option>
                  ))
                ) : (
                  <option disabled>No Rate Charts Available</option>
                )}
              </select>
            </div>

            <div className="farmerid-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100">Farmer Id</span>{" "}
              {errors.farmerid && (
                <span className="text error-message">{errors.farmerid}</span>
              )}
              <input
                className={`data w100 ${errors.farmerid ? "input-error" : ""}`}
                type="number"
                name="farmerid"
                id=""
                onChange={handleInputChange}
                value={formData.farmerid}
              />
            </div>
          </div>
        </div>
        <div className="cust-div Bank-details-div w100 h15 d-flex-col sb">
          {/* <span className="info-text px10">Bank Details :</span> */}
          <div className="bank-details w100 h1 d-flex f-wrap sb">
            <div className="bankname-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100 ">Bank Name</span>{" "}
              {errors.bankName && (
                <span className="text error-message">{errors.bankName}</span>
              )}
              <input
                className={`data w100 ${errors.bankName ? "input-error" : ""}`}
                type="text"
                name="bankName"
                id=""
                onChange={handleInputChange}
                value={formData.bankName || ""}
              />
            </div>
            <div className="acc-details-div w30 d-flex-col a-center px10">
              <span className="info-text w100">Bank A/C</span>{" "}
              {errors.bank_ac && (
                <span className="text error-message">{errors.bank_ac}</span>
              )}
              <input
                className={`data w100 ${errors.bank_ac ? "input-error" : ""}`}
                type="number"
                name="bank_ac"
                id=""
                onChange={handleInputChange}
                value={formData.bank_ac || ""}
              />
            </div>
            <div className="ifsc-details-div w30 d-flex-col a-center px10">
              <span className="info-text w100">Bank IFSC</span>{" "}
              {errors.bankIFSC && (
                <span className="text error-message">{errors.bankIFSC}</span>
              )}
              <input
                className={`data w100 ${errors.bankIFSC ? "input-error" : ""}`}
                type="text"
                name="bankIFSC"
                id=""
                onChange={handleInputChange}
                value={formData.bankIFSC || ""}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="cust-data-settings w40 h1 d-flex-col p10">
        <span className="sub-heading px10">Settings (Rs/ltr) : </span>
        <div className="cust-div milk-settings-div w100 h20 d-flex sa">
          <div className="details-div w45 h50 d-flex a-center">
            <span className="info-text w70">Deposit :</span>
            <input
              className="data w30"
              type="number"
              name="deposit"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.deposit || ""}
            />
          </div>
          <div className="details-div w45 h50 d-flex a-center ">
            <span className="info-text w70">Commission :</span>
            <input
              className="data w30"
              type="number"
              name="commission"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.commission || ""}
            />
          </div>
        </div>
        <div className="cust-div milk-settings-div w100 h15 d-flex sa">
          <div className="details-div w45 h50 d-flex a-center ">
            <span className="info-text w70">Rebat Commission :</span>
            <input
              className="data w30"
              type="number"
              name="rebet"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.rebet || ""}
            />
          </div>
          <div className="details-div w45 h50 d-flex a-center ">
            <span className="info-text w70">Transportation :</span>
            <input
              className="data w30"
              type="number"
              name="transportation"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.transportation || ""}
            />
          </div>
        </div>
        <div className="data-show-hide--setting-container w100 h60 d-flex-col">
          <span className="sub-heading px10">Data Show/Hide Settings :</span>
          <div className="show-hide-content-div w100 h10 d-flex sa">
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_deposit"
                onChange={handleInputChange}
              />
              <span className="label-text w90">Hide Deposit </span>
            </div>
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_deduction"
                onChange={handleInputChange}
              />
              <span className="label-text w90">Hide Deductions </span>
            </div>
          </div>
          <div className="show-hide-content-div w100 h10 d-flex sa">
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_allrebet"
                id=""
                onChange={handleInputChange}
              />
              <span className="label-text w90">Hide All Rebat </span>
            </div>
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_sanghrebet"
                onChange={handleInputChange}
              />
              <span className="label-text w90">Hide Sangh Rebat </span>
            </div>
          </div>
          <div className="show-hide-content-div w100 h10 d-flex sa">
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_dairyrebet"
                onChange={handleInputChange}
              />
              <span className="label-text w90">Hide Dairy Rebat </span>
            </div>
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_transportation"
                id=""
                onChange={handleInputChange}
              />
              <span className="label-text w90">Hide Transportation </span>
            </div>
          </div>
        </div>
        <div className="button-container w100 h10 d-flex sa">
          <button className="w-btn" type="submit" onClick={handleEditClick}>
            {isEditing ? "CREATE" : "EDIT"}
          </button>
          {isEditing ? (
            <button
              className="w-btn"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Updating..." : "UPDATE "}
            </button>
          ) : (
            <button
              className="w-btn"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating..." : "CREATE "}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CreateCustomer;
