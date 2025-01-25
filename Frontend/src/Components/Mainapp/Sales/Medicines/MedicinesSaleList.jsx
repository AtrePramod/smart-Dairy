// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Spinner from "../../../Home/Spinner/Spinner";
import { FaDownload } from "react-icons/fa6";
import { useSelector } from "react-redux";
import axiosInstance from "../../../../App/axiosInstance";
import * as XLSX from "xlsx";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const MedicinesSaleList = () => {
  const { customerlist, loading } = useSelector((state) => state.customer);
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [fcode, setFcode] = useState("");
  const [sales, setSales] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [editSale, setEditSale] = useState(null); // State to hold the sale being edited
  const [isModalOpen, setIsModalOpen] = useState(false);

  const downloadExcel = () => {
    const exportData = sales.map((sale) => ({
      BillDate: formatDateToDDMMYYYY(sale.BillDate),
      BillNo: sale.BillNo,
      custCode: sale.CustCode,
      custName: handleFindCustName(sale.CustCode),
      ItemCode: sale.ItemCode,
      ItemName: handleFindItemName(sale.ItemCode),
      Qty: sale.Qty,
      Rate: sale.Rate,
      Amt: sale.Amount,
      cgst: sale.cgst || 0,
      sgst: sale.sgst || 0,
      cn: 0,
    }));

    if (!Array.isArray(exportData) || exportData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Convert sales data to Excel sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add sheet to workbook
    XLSX.writeFile(workbook, `${date1}_to_${date2}.xlsx`); // Trigger download as .xlsx file
  };

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all");
        setItemList(data.itemsData || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchAllItems();
  }, []);

  // Fetch sales data from backend (API endpoint)
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await axiosInstance.get("/sale/all?ItemGroupCode=2"); // Replace with your actual API URL
        if (data.success) {
          // console.log(data);
          setSales(data.salesData); // Assuming 'sales' is the array returned by your backend
        }
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    SetDate1(getPreviousDate(10));
    SetDate2(getTodaysDate());
  }, []);

  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const getPreviousDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };
  const handleShowbutton = async () => {
    const getItem = {
      date1,
      date2,
      ...(fcode && { fcode }), // Include fcode only if it has a value
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/sale/all?ItemGroupCode=2&${queryParams}`
      );
      if (data?.success) {
        setSales(data.salesData);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const handleEditClick = (sale) => {
    setEditSale(sale);
    setIsModalOpen(true);
  };
  const handleDelete = async (saleid) => {
    if (confirm("Are you sure you want to Delete?")) {
      try {
        console.log("saleid", saleid);
        const res = await axiosInstance.post("/sale/delete", { saleid }); // Replace with your actual API URL
        alert(res?.data?.message);

        setSales((prevSales) =>
          prevSales.filter((sale) => sale.saleid !== saleid)
        );
      } catch (error) {
        console.error("Error deleting sale item:", error);
      }
    }
  };

  const handleFindItemName = (id) => {
    const selectedItem = itemList.find((item) => item.ItemCode === id);
    return selectedItem?.ItemName || "Unknown Item";
  };
  const handleFindCustName = (id) => {
    const selectedItem = customerlist.find((item) => item.srno === id);
    return selectedItem?.cname || "Unknown Customer";
  };

  const handleAmountCalculation = () => {
    const qty = parseFloat(editSale?.Qty || 0);
    const rate = parseFloat(editSale?.Rate || 0);
    return qty * rate;
  };
  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr); // Parse the ISO string
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensures two digits for month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSaveChanges = async () => {
    const updatedAmount = parseFloat(editSale.Qty) * parseFloat(editSale.Rate);

    const updateItem = {
      saleid: editSale.saleid,
      ReceiptNo: editSale.ReceiptNo,
      Rate: editSale.Rate,
      Qty: editSale.Qty,
      Amount: updatedAmount,
    };
    // console.log(updateItem);
    // console.log("Updatiing sales");
    try {
      const res = await axiosInstance.put("/sale/update", updateItem);
      if (res?.data?.success) {
        alert("Sale updated successfully");
        setSales((prevSales) => {
          return prevSales.map((sale) => {
            if (sale.saleid === editSale.saleid) {
              return { ...sale, ...editSale, Amount: updatedAmount };
            }
            return sale;
          });
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };
  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div
        className="download-print-pdf-excel-container w100 h10 d-flex j-end "
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
              Customer Code
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
          <div className="data-headings-div h10 d-flex center t-center sb">
            <span className="f-info-text w5">Edit</span>
            <span className="f-info-text w5">Bill Date</span>
            <span className="f-info-text w5">Receipt No</span>
            <span className="f-info-text w5">Customer Code</span>
            <span className="f-info-text w15">Customer Name</span>
            <span className="f-info-text w10">Item Name</span>
            <span className="f-info-text w5">Qty</span>
            <span className="f-info-text w5">Rate</span>
            <span className="f-info-text w5">Amount</span>
            <span className="f-info-text w5">Actions</span>
          </div>
          {/* Show Spinner if loading, otherwise show the feed list */}
          {loading ? (
            <Spinner />
          ) : sales.length > 0 ? (
            sales.map((sale, index) => (
              <div
                key={index}
                className={`data-values-div w100 h10 d-flex center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w5">
                  <FaRegEdit
                    size={15}
                    className="table-icon"
                    onClick={() => handleEditClick(sale)}
                  />
                </span>
                <span className="text w5">
                  {" "}
                  {new Date(sale.BillDate).toLocaleDateString("en-US", {
                    dateStyle: "short",
                  })}
                </span>
                <span className="text w5 ">{sale.ReceiptNo}</span>
                <span className="text w5">{sale.CustCode}</span>
                <span className="text w15">
                  {handleFindCustName(sale.CustCode)}
                </span>
                <span className="text w10">
                  {handleFindItemName(sale.ItemCode)}
                </span>
                <span className="text w5">{sale.Qty}</span>
                <span className="text w5">{sale.Rate}</span>
                <span className="text w5">{sale.Amount}</span>
                <span className="text w5">
                  <MdDeleteOutline
                    onClick={() => handleDelete(sale?.saleid)}
                    size={15}
                    className="table-icon"
                    style={{ color: "red" }}
                  />
                </span>

                {/* Assuming all customers are active */}
              </div>
            ))
          ) : (
            <div>No Items found</div>
          )}
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Sale</h2>
              <label>
                Receipt No:
                <input
                  type="number"
                  value={editSale?.ReceiptNo}
                  onChange={(e) =>
                    setEditSale({ ...editSale, ReceiptNo: e.target.value })
                  }
                />
              </label>
              <label>
                Qty:
                <input
                  type="number"
                  value={editSale?.Qty}
                  onChange={(e) =>
                    setEditSale({ ...editSale, Qty: e.target.value })
                  }
                />
              </label>
              <label>
                Rate:
                <input
                  type="number"
                  value={editSale?.Rate}
                  onChange={(e) =>
                    setEditSale({ ...editSale, Rate: e.target.value })
                  }
                />
              </label>
              <label>
                Amount:
                <input
                  type="number"
                  value={handleAmountCalculation()}
                  disabled
                />
              </label>
              <div>
                <button onClick={handleSaveChanges}>Save</button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinesSaleList;
