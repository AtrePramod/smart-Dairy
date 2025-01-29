/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../../../App/axiosInstance";
import { toast } from "react-toastify";
import "../purchase.css";
import { IoClose } from "react-icons/io5";

const List = () => {
  const [purchaseList, setPurchaseList] = useState([]);
  const [dealerList, setDealerList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fcode, setFcode] = useState("");

  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");

  const [updatelist, setUpdateList] = useState([]);

  // Fetch dealer list from API
  useEffect(() => {
    const fetchDealerList = async () => {
      try {
        const response = await axiosInstance.post("/dealer");
        let customers = response?.data?.customerList || [];
        customers.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        setDealerList(customers);
      } catch (error) {
        toast.error("Failed to fetch dealer list. Please try again.");
      }
    };
    fetchDealerList();
  }, []);

  // Handle view button click for purchase list
  const handleEditClick = (id) => {
    const filterList = purchaseList.filter((item) => item.billno === id) || [];
    setUpdateList(filterList);
    setIsModalOpen(true);
  };

  // Fetch purchase list from API
  useEffect(() => {
    const fetchPurchaseList = async () => {
      try {
        const response = await axiosInstance.get(
          "/purchase/all?itemgroupcode=2"
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
  }, []);

  // Function to delete a purchase item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await axiosInstance.delete(`/purchase/delete/${id}`);
        toast.success(res?.data?.message);
        setPurchaseList((prevItems) =>
          prevItems.filter((item) => item.billno !== id)
        );
      } catch (error) {
        toast.error("Error deleting purchase item.");
      }
    }
  };

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
    SetDate1(getPreviousDate(10));
    SetDate2(getTodaysDate());
  }, []);

  // Function to download dealer list as an Excel file
  const downloadExcel = () => {
    if (dealerList.length === 0) {
      toast.warn("No data available to download.");
      return;
    }

    const formattedData = purchaseList.map((item) => ({
      PurchaseDate: formatDateToDDMMYYYY(item.purchasedate),
      InvoiceIdBillNo: item.receiptno,
      SupplierCode: item.dealerCode,
      CustName: item.dealerName,
      ItemCode: item.itemcode,
      ItemName: item.itemname,
      Qty: item.qty,
      Rate: item.rate,
      Amt: item.amount,
      "cgst%": item.cgst || 0,
      "sgst%": item.sgst || 0,
      CN: item.cn || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `PurchaseData_${date1}_to_${date2}.xlsx`);
  };

  // Group purchase by bill number
  const groupedPurchase = (purchaseList || []).reduce((acc, item) => {
    const key = item.billno;
    if (!acc[key]) {
      acc[key] = { ...item, TotalAmount: 0 };
    }
    acc[key].TotalAmount += item.amount;
    return acc;
  }, {});

  const groupedPurchaseArray = Object.values(groupedPurchase);

  // Function to fetch purchase data based on date and dealer code filt
  const handleShowbutton = async () => {
    const getItem = {
      date1,
      date2,
      ...(fcode && { dealerCode: fcode }), // Include fcode only if it has a value
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/purchase/all?ItemGroupCode=2&${queryParams}`
      );
      // console.log(data);
      if (data?.success) {
        setPurchaseList(data.purchaseData || []);
      } else {
        setPurchaseList([]);
      }
    } catch (error) {
      toast.error("Error fetching Purchase items");
      setPurchaseList([]);
    }
  };
  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr); // Parse the ISO string
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensures two digits for month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          <div className="my10">
            <label htmlFor="" className="info-text px10">
              Dealer Code
            </label>
            <input
              type="number"
              className="data"
              name="code"
              value={fcode}
              onChange={(e) => setFcode(e.target.value.replace(/\D/, ""))}
              min="0"
            />
          </div>
        </div>
        <div className="w100 d-flex sa my5">
          <button className="w-btn" onClick={handleShowbutton}>
            Show
          </button>
          <button className="w-btn" onClick={downloadExcel}>
            Export Excel
          </button>
        </div>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
        <span className="heading p10">Medicines List</span>
        <div className="customer-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div h10 d-flex center forDWidth t-center sb">
            <span className="f-info-text w5">SrNo</span>
            <span className="f-info-text w5">Date</span>
            <span className="f-info-text w5">Rec. No</span>
            <span className="f-info-text w10">Dealer Code</span>
            <span className="f-info-text w15">Dealer Name</span>
            <span className="f-info-text w10">Total Amount</span>
            <span className="f-info-text w10">Actions</span>
          </div>
          {groupedPurchaseArray.length > 0 ? (
            groupedPurchaseArray.map((item, index) => (
              <div
                key={index}
                className={`data-values-div w100 h10 d-flex forDWidth center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w5">{index + 1}</span>
                <span className="text w5">
                  {new Date(item.purchasedate).toLocaleDateString("en-US", {
                    dateStyle: "short",
                  })}
                </span>
                <span className="text w5">{item.receiptno}</span>
                <span className="text w10">{item.dealerCode}</span>
                <span className="text w15">{item.dealerName || "Unknown"}</span>
                <span className="text w10">{item.TotalAmount}</span>
                <span className="text w10 d-flex j-center a-center">
                  <button
                    style={{ cursor: "pointer" }}
                    className="px5 "
                    onClick={() => handleEditClick(item.billno)}
                  >
                    View
                  </button>
                  <MdDeleteOutline
                    onClick={() => handleDelete(item.billno)}
                    size={17}
                    className="table-icon"
                    style={{ color: "red" }}
                  />
                </span>
              </div>
            ))
          ) : (
            <div>No purchases found</div>
          )}
        </div>
      </div>
      {isModalOpen && updatelist.length > 0 && (
        <div className="pramod modal">
          <div className="modal-content">
            <div className="d-flex sb">
              <h2>View Purchase Details</h2>
              <IoClose
                style={{ cursor: "pointer" }}
                size={25}
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <hr />
            <div className="my5 d-flex sa">
              <h4>Dealer Name : {updatelist[0]?.dealerName || ""}</h4>
              <h4>Dealer code : {updatelist[0]?.dealerCode || ""}</h4>
            </div>

            <div className="modal-content w100  ">
              <div className="sales-table-container w100">
                <table className="sales-table w100 ">
                  <thead className="bg2">
                    <tr>
                      <th>SrNo</th>
                      <th>Item Name</th>
                      <th>Rate</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatelist.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.itemname}</td>
                        <td>{item.rate}</td>
                        <td>{item.qty}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <b>Total</b>
                      </td>
                      <td>
                        {(updatelist || []).reduce(
                          (acc, item) => acc + (item.amount || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
