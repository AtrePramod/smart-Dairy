// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./productSale.css";

const ProductSale = () => {
  const [formData, setFormData] = useState({
    date: "",
    farmerName: "",
    farmerCode: "",
    item: "",
    qty: 0,
    rate: 0,
    amt: 0,
  });

  const [items, setItems] = useState([
    { value: "item1", label: "Item 1" },
    { value: "item2", label: "Item 2" },
  ]);

  const [newItem, setNewItem] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate the amount dynamically
    if (name === "qty" || name === "rate") {
      const updatedQty = name === "qty" ? value : formData.qty;
      const updatedRate = name === "rate" ? value : formData.rate;
      setFormData({
        ...formData,
        amt: updatedQty * updatedRate,
        [name]: value,
      });
    }
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, { value: newItem.toLowerCase(), label: newItem }]);
      setNewItem("");
    }
  };

  const handleClear = () => {
    setFormData({
      date: "",
      farmerName: "",
      farmerCode: "",
      item: "",
      qty: 0,
      rate: 0,
      amt: 0,
    });
  };

  return (
    <div className="productSale">
      <div className="form-container">
        <div className="row">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="data"
          />
        </div>
        <div className="row">
          <label>Farmer Code:</label>
          <input
            type="text"
            name="farmerCode" className="data"
            value={formData.farmerCode}
            onChange={handleInputChange}
          />
          <label>Farmer Name:</label>
          <input
            type="text"
            name="farmerName" className="data"
            value={formData.farmerName}
            onChange={handleInputChange}
          />
        </div>
        <div className="row">
          <label>Select Item:</label>
          <select
            name="item"
            value={formData.item}
            onChange={handleInputChange}
          >
            <option value="">--Select--</option>
            {items.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <label>Qty:</label>
          <input
            type="number"
            name="qty" className="data"
            value={formData.qty}
            onChange={handleInputChange}
          />
          <label>Rate:</label>
          <input
            type="number" className="data"
            name="rate"
            value={formData.rate}
            onChange={handleInputChange}
          />
          <label>Amt:</label>
          <input type="number" name="amt" className="data" value={formData.amt} readOnly />
        </div>
        <div className="button-container">
          <button onClick={handleClear}>Clear</button>
          <button onClick={() => alert(JSON.stringify(formData))}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSale;
