/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";
import "./SellRate.css";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";

const ProductsList = () => {
  const [purchaseList, setPurchaseList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredList, setFilteredList] = useState(purchaseList); // Store filtered items
  const [filteredList2, setFilteredList2] = useState(filteredList); // Store filtered items

  const [selectcode, setSelectcode] = useState("");
  const [itemcode, setItemcode] = useState("");

  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");

  const [editSale, setEditSale] = useState(null);
  const uniqueItems = new Set();

  // Function to get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Function to get date from X days ago
  const getPreviousDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    SetDate1(getPreviousDate(30));
    SetDate2(getTodaysDate());
  }, []);
  // Fetch purchase list from API
  useEffect(() => {
    const fetchPurchaseList = async () => {
      if (!date1 || !date2) return; // Ensure dates are defined before making the request

      const getItem = { date1, date2 };

      try {
        const queryParams = new URLSearchParams(getItem).toString();
        const response = await axiosInstance.get(
          `/purchase/all?${queryParams}`
        );

        let purchase = response?.data?.purchaseData || [];
        purchase.sort(
          (a, b) => new Date(b.purchasedate) - new Date(a.purchasedate)
        );

        setPurchaseList(purchase);
      } catch (error) {
        toast.error("Error fetching purchase list.");
      }
    };

    fetchPurchaseList();
  }, [date1, date2]);

  // Handle view button click for purchase list
  const handleEditClick = (id) => {
    const filterList =
      purchaseList.find((item) => item.purchaseid === id) || [];
    setEditSale(filterList);
    setIsModalOpen(true);
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr); // Parse the ISO string
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensures two digits for month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (selectcode) {
      // First filter by itemgroupcode
      const filteredItems = purchaseList.filter(
        (item) => item.itemgroupcode.toString() === selectcode
      );
      setFilteredList(filteredItems);
      setItemcode(""); // Reset itemcode when itemgroupcode changes
      setFilteredList2(filteredItems); // Initialize filteredList2 with filteredItems
    } else {
      setFilteredList(purchaseList);
      setFilteredList2(purchaseList); // Reset both when no itemgroupcode is selected
    }
  }, [purchaseList, selectcode]);

  useEffect(() => {
    if (itemcode) {
      // Then filter by itemcode
      const filteredItems = filteredList.filter(
        (item) => item.itemcode.toString() === itemcode
      );
      setFilteredList2(filteredItems);
    } else {
      setFilteredList2(filteredList); // If no itemcode is selected, show all from selected group
    }
  }, [itemcode, filteredList]);

  // Function to handle the update action
  const handleUpdate = async () => {
    try {
      const res = await axiosInstance.put("/purchase/update", {
        purchases: [editSale],
      });

      if (res?.data?.success) {
        toast.success("Purchase data updated successfully!");

        setPurchaseList((prevList) =>
          prevList.map((item) =>
            item.purchaseid === editSale.purchaseid
              ? { ...item, ...editSale }
              : item
          )
        );
        setFilteredList2((prevList) =>
          prevList.map((item) =>
            item.purchaseid === editSale.purchaseid
              ? { ...item, ...editSale }
              : item
          )
        );

        setIsModalOpen(false);
      } else {
        toast.error("Error updating purchase data.");
      }
    } catch (error) {
      toast.error("Error updating purchase data.");
    }
  };

  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div
        className="download-print-pdf-excel-container w100 h10 d-flex j-end"
        style={{ display: "contents" }}
      >
        <div className="w100 d-flex sa my5 f-wrap">
          <div className="my10">
            <label htmlFor="" className="info-text px10">
              Date:
            </label>
            <input
              type="date"
              className="data"
              value={date1}
              onChange={(e) => SetDate1(e.target.value)}
              max={date2}
            />
          </div>
          <div className="my10">
            <label className="info-text px10" htmlFor="">
              To Date:
            </label>
            <input
              type="date"
              name="date"
              className="data"
              value={date2}
              onChange={(e) => SetDate2(e.target.value)}
              min={date1}
            />
          </div>
        </div>
        <div className="w100 d-flex sa f-wrap my5">
          <div className="my5">
            <select
              name="ItemGroupCode"
              className="data form-field"
              onChange={(e) => setSelectcode(e.target.value)}
              value={selectcode}
            >
              <option value="">Select Group Name</option>
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
          <div className="my5">
            <select
              name="ItemGroupCode"
              className="data form-field"
              onChange={(e) => setItemcode(e.target.value)}
              value={itemcode}
              disabled={!selectcode}
            >
              <option value="">Select Item Name</option>
              {filteredList.map((item) => {
                if (!uniqueItems.has(item.itemcode)) {
                  uniqueItems.add(item.itemcode);
                  return (
                    <option key={item.itemcode} value={item.itemcode}>
                      {item.itemname}
                    </option>
                  );
                }
                return null;
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
        <span className="heading p10">Cattle Feed Report</span>
        <div className="customer-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div h10 d-flex center forDWidth t-center sb">
            <span className="f-info-text w5">SrNo</span>
            <span className="f-info-text w5">Date</span>
            <span className="f-info-text w5">Rec. No</span>
            <span className="f-info-text w10">Item Name</span>
            <span className="f-info-text w5">Rate</span>
            <span className="f-info-text w5">Sell Rate</span>
            <span className="f-info-text w5">Qty</span>
            <span className="f-info-text w10">Actions</span>
          </div>
          {filteredList2.length > 0 ? (
            filteredList2.map((item, index) => (
              <div
                key={index}
                className={`data-values-div w100 h10 d-flex forDWidth center t-center py5 sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w5">{index + 1}</span>
                <span className="text w5">
                  {formatDateToDDMMYYYY(item.purchasedate)}
                </span>
                <span className="text w5">{item.receiptno}</span>
                <span className="text w10">{item.itemname}</span>
                <span className="text w5">{item.rate}</span>
                <span className="text w5">{item.salerate}</span>
                <span className="text w5">{item.qty}</span>
                <span className="text w10 d-flex j-center a-center">
                  <FaRegEdit
                    size={15}
                    className="table-icon"
                    onClick={() => handleEditClick(item.purchaseid)}
                  />
                </span>
              </div>
            ))
          ) : (
            <div>No purchases found</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="pramod modal">
          <div className="modal-content">
            <h2 className="my10">Update Product Details</h2>
            <b>
              <div className="d-flex w100 sb">
                <label>Name: {editSale?.itemname}</label>
                <label> Rate: {editSale?.rate}</label>
                <label> Qty: {editSale?.qty}</label>
              </div>
            </b>
            <label>
              Sale Rate:
              <input
                type="text"
                value={editSale?.salerate}
                onChange={(e) =>
                  setEditSale({ ...editSale, salerate: e.target.value })
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
            <div>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
