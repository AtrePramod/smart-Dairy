/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Spinner from "../../../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa6";
import axiosInstance from "../../../../../App/axiosInstance";
import "./Stock.css";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";

const StockList = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [filteredProducts, setFilterProducts] = useState([]);
  const [editSale, setEditSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //open modal to edit product
  const handleEditClick = (id) => {
    setEditSale(id);
    setIsModalOpen(true);
  };

  //handle update product
  const handleSaveChanges = async () => {
    const result = await Swal.fire({
      title: "Confirm Updation?",
      text: "Are you sure you want to Update this Item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });

    if (result.isConfirmed) {
      const amt = parseFloat(editSale.ItemQty) * parseFloat(editSale.ItemRate);
      const updateItem = {
        ItemCode: editSale.ItemCode,
        ItemQty: editSale.ItemQty,
        ItemRate: editSale.ItemRate,
        SaleRate: editSale.SaleRate,
        Amount: amt,
      };

      try {
        const res = await axiosInstance.patch("/item/stock/update", updateItem);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setProductList((prevCust) => {
            return prevCust.map((item) => {
              if (item.ItemCode === editSale.ItemCode) {
                return { ...item, ...editSale, Amount: amt };
              }
              return item;
            });
          });
          setIsModalOpen(false);
        }
      } catch (error) {
        toast.error("Error in update Item to server");
        // console.error("Error updating cust:", error);
      }
    }
  };

  //handle download excel
  const downloadExcel = () => {
    // Filter products based on the selected ItemGroupCode
    const filteredProducts = filter
      ? productList.filter(
          (product) => product.ItemGroupCode === parseInt(filter)
        )
      : productList; // If no filter, export all products

    // Prepare data for export with only displayed columns
    const dataToExport = filteredProducts.map((product, index) => ({
      "Sr. No.": index + 1,
      "Item Code": product.ItemCode,
      "Item Name": product.ItemName,
      Description: product.ItemDesc,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Products_List.xlsx");
  };

  //getting all products
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axiosInstance.get("/item/stock/all");
        let products = response?.data?.data || [];
        // Sort products by ItemCode
        products.sort((a, b) => a.ItemCode - b.ItemCode);
        setProductList(products);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching product list: ", error);
        toast.error("There was an error fetching the product list.");
        setLoading(false);
      }
    };
    fetchProductList();
  }, []);

  //handle delete ny its item code
  const handleDelete = async (ItemCode) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.post("/item/stock/delete", {
          ItemCode,
        });
        toast.success(res?.data?.message);
        setProductList((prevSales) =>
          prevSales.filter((product) => product.ItemCode !== ItemCode)
        );
      } catch (error) {
        toast.error("Error deleting sale item to server");
        // console.error("Error deleting sale item:", error);
      }
    }
  };
  //onchange event for filter
  useEffect(() => {
    if (filter) {
      const filteredProducts = productList.filter(
        (product) => parseInt(product.ItemGroupCode) === parseInt(filter)
      );
      setFilterProducts(filteredProducts);
    } else {
      setFilterProducts(productList);
    }
  }, [productList, filter]);

  return (
    <div className="product-list-container w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h10 d-flex j-end">
        <div className="w100 d-flex sa">
          <div>
            <label htmlFor="seletgrop" className="mx5">
              Select Item Group:
            </label>
            <select
              name="ItemGroupCode"
              className="data form-field"
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
            >
              <option value="">All</option>
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
          <button className="btn" onClick={downloadExcel}>
            <span className="f-label-text px10">Download</span>
            <FaDownload />
          </button>
        </div>
      </div>

      <div className="product-list-table w100 h1 d-flex-col hidescrollbar bg ">
        <span className="heading p10">Stock Report</span>
        <div className="product-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div h10 d-flex forWidth center t-center sa">
            <span className="f-info-text w5">Sr.No.</span>
            <span className="f-info-text w5">Item Code</span>
            <span className="f-info-text w15">Item Name</span>
            <span className="f-info-text w5">Qty</span>
            <span className="f-info-text w5">Rate</span>
            <span className="f-info-text w5">Sale Rate</span>
            <span className="f-info-text w5">Amount</span>
            <span className="f-info-text w5">Action</span>
          </div>
          {loading ? (
            <Spinner />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className={`data-values-div w100 h10 d-flex forWidth center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w5">{index + 1}</span>
                <span className="text w5">{product.ItemCode}</span>
                <span className="text w15 t-start">{product.ItemName}</span>
                <span className="text w5">{product.ItemQty}</span>
                <span className="text w5">{product.ItemRate}</span>
                <span className="text w5">{product.SaleRate}</span>
                <span className="text w5">{product.Amount}</span>
                <span className="text w5">
                  <FaRegEdit
                    size={15}
                    className="table-icon"
                    onClick={() => handleEditClick(product)}
                  />
                  <MdDeleteOutline
                    onClick={() => handleDelete(product.ItemCode)}
                    size={15}
                    className="table-icon "
                    style={{ color: "red" }}
                  />
                </span>
              </div>
            ))
          ) : (
            <div>No product found</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="pramod modal">
          <div className="modal-content">
            <h2>Update Product Details</h2>
            <label>
              Item Name: {editSale?.ItemCode}&nbsp;{editSale?.ItemName}
            </label>
            <label>
              Item Rate:
              <input
                type="text"
                value={editSale?.ItemRate}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemRate: e.target.value })
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label>
              Item Qty:
              <input
                type="text"
                value={editSale?.ItemQty}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemQty: e.target.value })
                }
              />
            </label>{" "}
            <label>
              Sale Rate:
              <input
                type="text"
                value={editSale?.SaleRate}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, SaleRate: e.target.value })
                }
              />
            </label>
            <div>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleSaveChanges}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;
