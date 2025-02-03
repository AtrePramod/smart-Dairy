/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../../../App/axiosInstance";
import { toast } from "react-toastify";
import "../purchase.css";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";

const List = () => {
  const [purchaseList, setPurchaseList] = useState([]);
  const [dealerList, setDealerList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredList, setFilteredList] = useState(purchaseList); // Store filtered items

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
    // console.log(filterList);
    setIsModalOpen(true);
  };

  // Fetch purchase list from API
  useEffect(() => {
    const fetchPurchaseList = async () => {
      try {
        const response = await axiosInstance.get(
          "/purchase/all?itemgroupcode=4"
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
        // toast.success(res?.data?.message);

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
    SetDate1(getPreviousDate(0));
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
  const groupedPurchase = (filteredList || []).reduce((acc, item) => {
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
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/purchase/all?itemgroupcode=4&${queryParams}`
      );
      // console.log(data);
      if (data?.success) {
        setPurchaseList(data.purchaseData || []);
        setFcode("");
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

  //for searching Name /code to get the purchase list
  useEffect(() => {
    if (fcode) {
      const filteredItems = purchaseList.filter(
        (item) =>
          item.dealerCode.toString().includes(fcode) ||
          item.dealerName.toLowerCase().includes(fcode.toLowerCase())
      );
      setFilteredList(filteredItems);
    } else {
      setFilteredList(purchaseList);
    }
  }, [fcode, purchaseList]);

  // Function to handle changes in the  input field
  const handleItemChange = (index, field, value) => {
    setUpdateList((prevList) => {
      const updatedList = [...prevList];

      // Update the specific field with the new value
      updatedList[index] = {
        ...updatedList[index],
        [field]: value,
      };

      // Convert rate & qty to numbers before calculating amount
      const rate = parseFloat(updatedList[index].rate) || 0;
      const qty = parseFloat(updatedList[index].qty) || 0;

      // Update amount only when rate or qty is changed
      if (field === "rate" || field === "qty") {
        updatedList[index].amount = rate * qty;
      }

      return updatedList;
    });
  };

  // Function to handle the update action (e.g., saving the changes to the server)
  const handleUpdate = async () => {
    try {
      // Sending updated data to the backend
      const res = await axiosInstance.put("/purchase/update", {
        purchases: updatelist.map((item) => ({
          purchaseid: item.purchaseid,
          rate: item.rate,
          salerate: item.salerate,
          qty: item.qty,
          amount: item.amount,
        })),
      });

      // Check if the update was successful
      if (res?.data?.success) {
        toast.success("Purchase data updated successfully!");

        // Optionally, update the frontend state with the new data
        setPurchaseList((prevList) =>
          prevList.map((item) => {
            const updatedItem = updatelist.find(
              (updated) => updated.purchaseid === item.purchaseid
            );
            return updatedItem ? { ...item, ...updatedItem } : item;
          })
        );

        setIsModalOpen(false); // Close the modal after successful update
      } else {
        toast.error("Error updating purchase data.");
      }
    } catch (error) {
      toast.error("Error updating purchase data.");
      console.error(error);
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
          <div className="my10">
            <button className="w-btn" onClick={handleShowbutton}>
              Show
            </button>
          </div>
        </div>
        <div className="w100 d-flex sa my5">
          <div>
            <label htmlFor="" className="info-text px10">
              Dealer Code/Name
            </label>
            <input
              type="text"
              className="data"
              name="code"
              onFocus={(e) => e.target.select()}
              value={fcode}
              onChange={(e) =>
                setFcode(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
              }
              min="0"
              title="Enter code or name to search details"
            />
          </div>

          <button className="w-btn" onClick={downloadExcel}>
            Export Excel
          </button>
        </div>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
        <span className="heading p10">Other Report</span>
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
              <h2>Purchase Bill Details</h2>
              <IoClose
                style={{ cursor: "pointer" }}
                size={25}
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <hr />
            <div className=" d-flex sb mx15 px15">
              <h4>Rect. No : {updatelist[0]?.receiptno || ""}</h4>
              <div className="10">
                <input
                  type="text"
                  name="date"
                  className="w20"
                  value={new Date(
                    updatelist[0]?.purchasedate
                  ).toLocaleDateString("en-US", {
                    dateStyle: "short",
                  })}
                  disabled
                />
              </div>
            </div>
            <div className=" d-flex sb mx15 px15">
              <h4>Dealer code : {updatelist[0]?.dealerCode || ""}</h4>
              <h4>Dealer Name : {updatelist[0]?.dealerName || ""}</h4>
            </div>
            <div className="modal-content w100  ">
              <div className="sales-table-container w100">
                <table className="sales-table w100 ">
                  <thead className="bg1">
                    <tr>
                      <th>SrNo</th>
                      <th>Item Name</th>
                      <th>Rate</th>
                      <th>Sale Rate</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatelist.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.itemname}</td>
                        <td className="w15">
                          <input
                            name="rate"
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              handleItemChange(i, "rate", e.target.value)
                            }
                          />
                        </td>
                        <td className="w15">
                          <input
                            name="sale"
                            type="number"
                            value={item.salerate}
                            onChange={(e) =>
                              handleItemChange(i, "salerate", e.target.value)
                            }
                          />
                        </td>
                        <td className="w15">
                          <input
                            name="qty"
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(i, "qty", e.target.value)
                            }
                          />
                        </td>
                        <td>{item.rate * item.qty}</td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
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
            <div className="d-flex my15 j-end">
              <button className="btn" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
