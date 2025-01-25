// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ProductList = () => {
  const [formData, setFormData] = useState({
    category: "Cattle Feed",
    code: "",
    name: "",
    gst: "",
    cgst: "",
    sgst: "",
    hsn: "",
  });

  const [products, setProducts] = useState([
    {
      category: "Cattle Feed",
      code: "CF001",
      name: "Premium Feed",
      gst: "18%",
      cgst: "9%",
      sgst: "9%",
      hsn: "230990",
    },
    {
      category: "Medicine",
      code: "MD101",
      name: "Vitamin Supplement",
      gst: "12%",
      cgst: "6%",
      sgst: "6%",
      hsn: "300490",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [editIndex, setEditIndex] = useState(null); // Track which product to edit

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addHandler = () => {
    if (!formData) {
      alert("Please fill in all fields");
    } else if (
      !formData.category ||
      !formData.cgst ||
      !formData.code ||
      !formData.gst ||
      !formData.name ||
      !formData.sgst ||
      !formData.hsn
    ) {
      alert("Please fill in all fields");
    } else {
      setProducts([...products, formData]);
      clearHandler();
    }
  };

  const clearHandler = () => {
    setFormData({
      category: "Cattle Feed",
      code: "",
      name: "",
      gst: "",
      cgst: "",
      sgst: "",
      hsn: "",
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEditProduct = (product, index) => {
    setFormData(product);
    setIsEditing(true);
    setEditIndex(index);
  };

  const updateHandler = () => {
    if (editIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts[editIndex] = formData; // Replace the product at the selected index
      setProducts(updatedProducts);
      clearHandler();
    }
  };

  const handleDeleteProduct = (code) => {
    setProducts(products.filter((product) => product.code !== code));
  };

  return (
    <>
      <div className="data-div mx10 bg p12 w100 br6">
        <div className="form-row d-flex sb my10">
          <label className="labeltext">
            Main Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="data my5"
              style={{ marginLeft: "10px" }}
            >
              <option value="Cattle Feed">Cattle Feed</option>
              <option value="Medicine">Medicine</option>
              <option value="Grocery">Grocery</option>
              <option value="Literature Store">Literature Store</option>
              <option value="Others">Others</option>
            </select>
          </label>
          <label className="labeltext">
            Item Code:
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="data my5"
              style={{ marginLeft: "10px" }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
              }}
            />
          </label>
          <label className="labeltext">
            Item Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="data my5"
              style={{ marginLeft: "10px" }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
              }}
            />
          </label>
        </div>

        <div className="form-row d-flex sb my10">
          <label className="labeltext">
            GST:
            <input
              type="text"
              name="gst"
              value={formData.gst}
              onChange={handleInputChange}
              className="data my5"
              style={{ marginLeft: "10px" }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
              }}
            />
          </label>
          <label className="labeltext">
            CGST:
            <input
              type="text"
              name="cgst"
              value={formData.cgst}
              onChange={handleInputChange}
              className="data my5"
              style={{ marginLeft: "10px" }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
              }}
            />
          </label>
          <label className="labeltext">
            SGST:
            <input
              type="text"
              name="sgst"
              value={formData.sgst}
              onChange={handleInputChange}
              className="data my5"
              style={{ marginLeft: "10px" }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
              }}
            />
          </label>
        </div>
        <div className="form-row d-flex sb my10">
          <label className="labeltext">
            HSN:
            <input
              type="text"
              name="hsn"
              value={formData.hsn}
              onChange={handleInputChange}
              className="data my5"
              style={{ marginLeft: "10px" }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
              }}
            />
          </label>
        </div>
        <div className="d-flex sb my15">
          {isEditing ? (
            <button onClick={updateHandler} className="btn w-btn">
              Update Product
            </button>
          ) : (
            <button onClick={addHandler} className="btn w-btn">
              Add Product
            </button>
          )}
          <button onClick={clearHandler} className="btn w-btn">
            Clear
          </button>
        </div>

        {/* Show all products */}
        <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
          <span className="heading p10">Product List</span>
          <div
            className="customer-heading-title-scroller w100 h1 mh100 d-flex-col"
            style={{ overflowX: "auto" }} // Enable horizontal scrolling
          >
            <div
              className="data-headings-div h10 d-flex center t-center sb"
              style={{ minWidth: "1000px" }}
            >
              <span className="f-info-text w5">Edit</span>
              <span className="f-info-text w105">Item Code</span>
              <span className="f-info-text w25">Item Name</span>
              <span className="f-info-text w10">Category</span>
              <span className="f-info-text w15">GST</span>
              <span className="f-info-text w10">CGST</span>
              <span className="f-info-text w10">SGST</span>
              <span className="f-info-text w10">Action</span>
            </div>
            {products.map((product, index) => (
              <div
                key={index}
                className={`data-values-div w100 h10 d-flex center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  minWidth: "1000px",
                }}
              >
                <span
                  className="text w5"
                  onClick={() => handleEditProduct(product, index)}
                >
                  <FaRegEdit size={15} />
                </span>
                <span className="text w105">{product.code}</span>
                <span className="text w25 ">{product.name}</span>
                <span className="text w10 ">{product.category}</span>
                <span className="text w15">{product.gst}</span>
                <span className="text w10">{product.cgst}</span>
                <span className="text w10">{product.sgst}</span>
                <span
                  className="text w10"
                  onClick={() => handleDeleteProduct(product.code)}
                >
                  <MdDeleteOutline size={15} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
