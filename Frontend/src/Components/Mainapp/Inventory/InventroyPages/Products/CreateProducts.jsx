import React, { useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";

const CreateProducts = () => {
  const [formData, setFormData] = useState({
    ItemName: "",
    marname: "",
    ItemGroupCode: "",
    UnitCode: "",
    ItemDesc: "",
    Manufacturer: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log("Product Data Submitted: ", formData);
        const res = await axiosInstance.post("/item/new", formData); // Replace with your actual API URL
        alert(res?.data?.message);

        setFormData({
          ItemName: "",
          marname: "",
          ItemGroupCode: "",
          UnitCode: "",
          ItemDesc: "",
          Manufacturer: "",
        });
        alert("Product created successfully!");
      } catch (error) {
        console.error("Error creating product: ", error);
        alert("There was an error creating the product.");
      }
    }
  };

  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formElements = Array.from(document.querySelectorAll(".form-field"));
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
      ItemName: "",
      marname: "",
      ItemGroupCode: "",
      UnitCode: "",
      ItemDesc: "",
      Manufacturer: "",
    });
    setErrors({});
  };

  return (
    <div className="d-flex py15 dealer">
      <div className="bg p10 w100">
        <span className="heading">Create Product</span>
        <form onSubmit={handleSubmit}>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                Item Name: <span className="req">*</span>
              </label>
              <input
                type="text"
                name="ItemName"
                value={formData.ItemName}
                className={`data form-field ${
                  errors.ItemName ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemName")}
                placeholder="Item Name"
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                Item Marathi Name: <span className="req">*</span>
              </label>
              <input
                type="text"
                name="marname"
                value={formData.marname}
                className={`data form-field ${
                  errors.marname ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "marname")}
                placeholder="Item Marathi Name"
              />
            </div>
          </div>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                Item Group Name: <span className="req">*</span>
              </label>
              <select
                name="ItemGroupCode"
                value={formData.ItemGroupCode}
                className={`data form-field ${
                  errors.ItemGroupCode ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemGroupCode")}
              >
                <option value="">Item Group Name</option>
                {[
                  { value: 1, label: "Cattle Feed" },
                  { value: 2, label: "Medicines" },
                  { value: 3, label: "Grocery" },
                  { value: 4, label: "Other" },
                ].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="info-text px10">
                Unit Code: <span className="req">*</span>
              </label>
              <select
                name="UnitCode"
                value={formData.UnitCode}
                className={`data form-field ${
                  errors.UnitCode ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "UnitCode")}
              >
                <option value="">Select Unit</option>
                {[
                  { value: "KG", label: "KG" },
                  { value: "QTY", label: "QTY" },
                  { value: "Others", label: "Others" },
                ].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                Item Description: <span className="req">*</span>
              </label>
              <input
                type="text"
                name="ItemDesc"
                value={formData.ItemDesc}
                className={`data form-field ${
                  errors.ItemDesc ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemDesc")}
                placeholder="Item Description"
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                Manufacturer: <span className="req">*</span>
              </label>
              <input
                type="text"
                name="Manufacturer"
                value={formData.Manufacturer}
                className={`data form-field ${
                  errors.Manufacturer ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "Manufacturer")}
                placeholder="Manufacturer"
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

export default CreateProducts;
