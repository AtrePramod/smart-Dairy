// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import * as XLSX from "xlsx";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  // const [cname, setCname] = useState("");
  const [fcode, setFcode] = useState("");
  const customerslist = useSelector((state) => state.customer.customerlist);
  const [itemList, setItemList] = useState([]);
  const [editSale, setEditSale] = useState(null); // State to hold the sale being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const dispatch = useDispatch();

  const handleEditClick = (sale) => {
    setEditSale(sale);
    setIsModalOpen(true);
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

  useEffect(() => {
    dispatch(listCustomer());
  }, [dispatch]);
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
  // Fetch sales data from backend (API endpoint)
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await axiosInstance.get("/sale/all"); // Replace with your actual API URL

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
    const selectedItem = customerslist.find((item) => item.srno === id);
    return selectedItem?.cname || "Unknown Customer";
  };
  const handleShowbutton = async () => {
    const getItem = {
      date1,
      date2,
      ...(fcode && { fcode }), // Include fcode only if it has a value
    };
    console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(`/sale/all?${queryParams}`);
      if (data?.success) {
        setSales(data.salesData);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAmountCalculation = () => {
    const qty = parseFloat(editSale?.Qty || 0);
    const rate = parseFloat(editSale?.Rate || 0);
    return qty * rate;
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
    console.log(updateItem);
    console.log("Updatiing sales");
    try {
      const res = await axiosInstance.put("/sale/update", updateItem);
      if (res?.data?.success) {
        alert("Sale updated successfully");
        setSales((prevSales) => {
          return prevSales.map((sale) => {
            if (sale.saleid === editSale.saleid) {
              return { ...sale, ...editSale };
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
  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr); // Parse the ISO string
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensures two digits for month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleExportExcel = () => {
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

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Convert sales data to Excel sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add sheet to workbook
    XLSX.writeFile(workbook, `${date1}_to_${date2}.xlsx`); // Trigger download as .xlsx file
  };
  return (
    <div className="sales-list-container">
      <h1>Sales Records</h1>
      <div className="row">
        <div className="w100 d-flex sa my10 f-wrap">
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
        <div className="w100 d-flex sa my10">
          <button className="w-btn" onClick={handleShowbutton}>
            Show
          </button>
          <button className="w-btn" onClick={handleExportExcel}>
            Export Excel
          </button>
        </div>
      </div>
      {/* Check if sales data is available */}
      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr className="bg2">
              <th>Bill Date</th>
              <th>Receipt No</th>
              <th>Customer Code</th>
              <th>Customer Name</th>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale.saleid}>
                  <td>
                    {new Date(sale.BillDate).toLocaleDateString("en-US", {
                      dateStyle: "short",
                    })}
                  </td>
                  <td>{sale.ReceiptNo}</td>
                  <td>{sale.CustCode}</td>
                  <td>{handleFindCustName(sale.CustCode)}</td>
                  <td>{handleFindItemName(sale.ItemCode)}</td>
                  <td>{sale.Qty}</td>
                  <td>{sale.Rate}</td>
                  <td>{sale.Amount}</td>
                  <td>
                    <FaRegEdit
                      size={20}
                      className="table-icon"
                      onClick={() => handleEditClick(sale)}
                    />
                    <MdDeleteOutline
                      onClick={() => handleDelete(sale?.saleid)}
                      size={20}
                      className="table-icon"
                      style={{ color: "red" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No sales records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Sale</h2>
            <label>
              Receipt No:
              <input
                type="text"
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
              <input type="number" value={handleAmountCalculation()} disabled />
            </label>
            <div>
              <button onClick={handleSaveChanges}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesList;
