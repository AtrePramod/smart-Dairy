// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axiosInstance from "../../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import * as XLSX from "xlsx";

const List = () => {
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [fcode, setFcode] = useState("");
  const [purchaseList, setPurchaseList] = useState([]);

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [filteredPurchaseList, setfilteredPurchaseList] =
    useState(purchaseList);
  const [viewItems, setViewItems] = useState([]);

  //download Excel sheet
  const downloadExcel = () => {
    const exportData = filteredPurchaseList.map((sale) => ({
      BillDate: formatDateToDDMMYYYY(sale.purchasedate),
      BillNo: sale.receiptno,
      DealerCode: sale.dealerCode,
      DealerName: sale.dealerName,
      ItemCode: sale.itemcode,
      ItemName: sale.itemname,
      Qty: sale.qty,
      Rate: sale.rate,
      Amt: sale.Amount,
      cgst: sale.cgst || 0,
      sgst: sale.sgst || 0,
      cn: sale.cn || 0,
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

  // Fetch purchase list from API
  useEffect(() => {
    const fetchPurchaseList = async () => {
      try {
        const response = await axiosInstance.get("/purchase/all?cn=1");
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

  //set to date of range to  get default data
  useEffect(() => {
    SetDate1(getPreviousDate(0));
    SetDate2(getTodaysDate());
  }, []);
  //get today day
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  //get previous date with give to number
  const getPreviousDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };

  // Function to fetch purchase data based on date and dealer code filt
  const handleShowbutton = async () => {
    const getItem = {
      date1,
      date2,
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/purchase/all?cn=1&${queryParams}`
      );
      // console.log(data);
      if (data?.success) {
        setPurchaseList(data.purchaseData || []);
        setFcode("");
      } else {
        setPurchaseList([]);
      }
    } catch (error) {
      toast.error("Error fetching Purchase list");
      setPurchaseList([]);
    }
  };

  // Function to delete a purchase item
  const handleDelete = async (id) => {
    // Show the confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this Bill?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Delete the item using axios
        const res = await axiosInstance.delete(`/purchase/delete/${id}`);
        toast.success(res?.data?.message);

        // Remove the deleted item from the list
        setPurchaseList((prevItems) =>
          prevItems.filter((item) => item.billno !== id)
        );

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Item deleted successfully.",
          icon: "success",
        });
      } catch (error) {
        // Handle error in deletion
        toast.error("Error deleting purchase item.");
      }
    }
  };

  //get date like DD/MM/YYYY formate
  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Group purchase by bill number
  const groupedPurchase = (filteredPurchaseList || []).reduce((acc, item) => {
    const key = item.billno;
    if (!acc[key]) {
      acc[key] = { ...item, TotalAmount: 0 };
    }
    acc[key].TotalAmount += item.amount;
    return acc;
  }, {});

  const groupedPurchaseArray = Object.values(groupedPurchase);

  //for filter item grp code
  useEffect(() => {
    if (fcode) {
      const filteredItems = purchaseList.filter((item) => {
        const isCodeMatch = item.itemgroupcode.toString().includes(fcode);
        return isCodeMatch;
      });

      setfilteredPurchaseList(filteredItems);
    } else {
      setfilteredPurchaseList(purchaseList);
    }
  }, [fcode, purchaseList]);

  const handleView = (billno) => {
    const filterList = purchaseList.filter((item) => item.billno === billno);
    setViewItems(filterList);
    // console.log(filterList);
    setIsInvoiceOpen(true);
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
            <button className="w-btn" onClick={handleShowbutton}>
              Show
            </button>
          </div>
        </div>
        <div className="w100 d-flex sa my5">
          <div>
            <label htmlFor="" className="info-text px10">
              Select Item Group:
            </label>
            <select
              id="selectitemcode"
              className="data"
              value={fcode}
              onChange={(e) =>
                setFcode(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
              }
            >
              <option value="">All</option>
              <option value="1">Cattle Feeds</option>
              <option value="2">Medicines</option>
              <option value="3">Grocery</option>
              <option value="4">Others</option>
            </select>
          </div>

          <button className="w-btn" onClick={downloadExcel}>
            Export Excel
          </button>
        </div>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
        <span className="heading p10">Dealer Returns Report</span>
        <div className="customer-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div sale-data-headings-div h10 d-flex center t-center sb">
            <span className="f-info-text w5">Sr.No</span>
            <span className="f-info-text w5">Date</span>
            <span className="f-info-text w5">Rec. No</span>
            <span className="f-info-text w10">DealerCode</span>
            <span className="f-info-text w25">Dealer Name</span>
            <span className="f-info-text w5">Amount</span>
            <span className="f-info-text w5">Actions</span>
          </div>
          {/* Show Spinner if loading, otherwise show the feed list */}
          {groupedPurchaseArray.length > 0 ? (
            groupedPurchaseArray.map((item, index) => (
              <div
                key={index}
                className={`data-values-div sale-data-values-div w100 h10 d-flex center t-center sa ${
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
                <span className="text w5 ">{item.receiptno}</span>
                <span className="text w10">{item.dealerCode}</span>
                <span className="text w25">{item.dealerName}</span>

                <span className="text w5">{item.TotalAmount}</span>
                <span className="text w5 d-flex j-center a-center">
                  <button
                    className="px5"
                    onClick={() => handleView(item?.billno)}
                    title="View the Bill"
                  >
                    View
                  </button>
                  <MdDeleteOutline
                    onClick={() => handleDelete(item?.billno)}
                    size={15}
                    className="table-icon "
                    title="Delete the Bill"
                    style={{ color: "red" }}
                  />
                </span>

                {/* Assuming all customers are active */}
              </div>
            ))
          ) : (
            <div className="d-flex center">No Items found</div>
          )}
        </div>
      </div>
      {/* show invoice */}
      {isInvoiceOpen && viewItems.length > 0 && (
        <div className="pramod modal">
          <div className="modal-content">
            <div className="d-flex sb">
              <h2>Purchase Bill Details</h2>
              <IoClose
                style={{ cursor: "pointer" }}
                size={25}
                onClick={() => setIsInvoiceOpen(false)}
              />
            </div>
            <hr />
            <div className=" d-flex sb mx15 px15">
              <h4>Rect. No : {viewItems[0]?.receiptno || ""}</h4>
              <div className="10">
                Date :{formatDateToDDMMYYYY(viewItems[0]?.purchasedate)}
              </div>
            </div>
            <div className=" d-flex sb mx15 px15">
              <h4>Dealer code : {viewItems[0]?.dealerCode || ""}</h4>
              <h4 className="mx15">{viewItems[0]?.dealerName || ""}</h4>
            </div>
            <div className="modal-content w100  ">
              <div className="sales-table-container w100">
                <table className="sales-table w100 ">
                  <thead className="bg1">
                    <tr>
                      <th>SrNo</th>
                      <th>Item Name</th>
                      <th>Rate</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewItems.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.itemname}</td>
                        <td className="w15"> {item.rate}</td>

                        <td className="w15">{item.qty}</td>
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
                        {(viewItems || []).reduce(
                          (acc, item) => acc + (item.amount || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="d-flex my15 j-end">
                      <button className="btn">Update</button>
                    </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
