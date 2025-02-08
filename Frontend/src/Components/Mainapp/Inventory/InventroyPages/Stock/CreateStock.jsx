// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";

// Function to get the current date
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const CreateStock = () => {
  const [itemList, setItemList] = useState([]);
  const [date, setDate] = useState(getTodaysDate());
  const [filteredList, setFilteredList] = useState([]);
  const [formData, setFormData] = useState({
    itemcode: "",
    itemname: "",
    purchasedate: getTodaysDate(),
    qty: 0,
    itemgroupcode: 0,
    rate: 0,
    amount: 0,
    salerate: 0,
  });
  const [errors, setErrors] = useState({});

  // Fetch all items from API
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all");
        setItemList(data.itemsData || []);
      } catch (error) {
        console.error("Failed to fetch items.", error);
      }
    };
    fetchAllItems();
  }, []);

  // Set today's date on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      purchasedate: date,
    }));
  }, [date]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (name === "qty" || name === "rate") {
        updatedData.amount =
          updatedData.qty && updatedData.rate
            ? updatedData.qty * updatedData.rate
            : 0;
      }

      return updatedData;
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Product Data Submitted: ", formData);
      alert("Product created successfully!");
      // API call to save data
      // try {
      //   const res = await axiosInstance.post("/item/new", formData);
      //   alert(res?.data?.message);
      //   handleClear();
      // } catch (error) {
      //   console.error("Error creating product: ", error);
      //   alert("There was an error creating the product.");
      // }
    }
  };

  // Handle enter key navigation
  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formElements = document.querySelectorAll(".form-field");
      const currentIndex = [...formElements].findIndex(
        (el) => el.name === fieldName
      );
      if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    setFormData({
      itemcode: "",
      itemname: "",
      purchasedate: getTodaysDate(),
      qty: 0,
      itemgroupcode: 0,
      rate: 0,
      amount: 0,
      salerate: 0,
    });
    setErrors({});
  };

  // Filter items by item group
  useEffect(() => {
    if (formData.itemgroupcode) {
      const filteredItems = itemList.filter(
        (item) =>
          parseInt(item.ItemGroupCode) === parseInt(formData.itemgroupcode)
      );
      setFilteredList(filteredItems);
    } else {
      setFilteredList(itemList);
    }
  }, [formData.itemgroupcode, itemList]);
  return (
    <div className="d-flex ">
      <div className="bg p10 w100">
        <span className="heading ">Create Starting Stock</span>
        <form className="my10" onSubmit={handleSubmit}>
          <div className="row d-flex sb ">
            <div className="col ">
              <label className="info-text px10">
                Date: <span className="req">*</span>
              </label>
              <input
                type="date"
                name="purchasedate"
                value={formData.purchasedate}
                max={date}
                className={`data form-field ${
                  errors.purchasedate ? "input-error" : ""
                }`}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                Item Group Name: <span className="req">*</span>
              </label>
              <select
                name="itemgroupcode"
                value={formData.itemgroupcode}
                className={`data form-field ${
                  errors.itemgroupcode ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "itemgroupcode")}
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
          </div>
          <div className="row  d-flex sb my10">
            <div className="col">
              <label className="info-text  ">
                Item Name: <span className="req">*</span>
              </label>
              <select
                name="itemcode"
                value={formData.itemcode}
                className={`data form-field ${
                  errors.itemcode ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "itemcode")}
                disabled={!formData.itemgroupcode}
              >
                <option value="">Select Item Name</option>
                {filteredList &&
                  filteredList.map((item) => (
                    <option key={item.ItemCode} value={item.ItemCode}>
                      {item.ItemName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col">
              <label className="info-text  ">
                Qty: <span className="req">*</span>
              </label>
              <input
                name="qty"
                type="number"
                value={formData.qty}
                min={1}
                className={`data form-field ${errors.qty ? "input-error" : ""}`}
                onChange={handleInputChange}
                disabled={!formData.itemcode}
              />
            </div>
          </div>
          <div className="row d-flex sb my10">
            <div className="col">
              <label className="info-text px10">
                Rate: <span className="req">*</span>
              </label>
              <input
                name="rate"
                type="number"
                value={formData.rate}
                className={`data form-field ${
                  errors.rate ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                min={1}
                disabled={!formData.itemcode}
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                Sell Rate: <span className="req">*</span>
              </label>
              <input
                name="salerate"
                type="number"
                value={formData.salerate}
                min={1}
                className={`data form-field ${
                  errors.salerate ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                disabled={!formData.itemcode}
              />
            </div>
          </div>
          <div className=" d-flex j-end my10">
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

export default CreateStock;
