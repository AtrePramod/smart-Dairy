/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Spinner from "../../../../Home/Spinner/Spinner";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import axiosInstance from "../../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DealersList = () => {
  const [dealerList, setDealerList] = useState([]);

  const [editSale, setEditSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //open to edit item
  const handleEditClick = (id) => {
    setEditSale(id);
    setIsModalOpen(true);
  };

  //update item
  const handleSaveChanges = async () => {
    const updateCust = {
      id: editSale.id,
      cname: editSale.cname,
      Phone: editSale.Phone,
      City: editSale.City,
      cust_ifsc: editSale.cust_ifsc,
      dist: editSale.dist,
      cust_accno: editSale.cust_accno,
    };
    // console.log(updateCust);
    try {
      const res = await axiosInstance.patch("/update/dealer", updateCust);
      if (res?.data?.success) {
        toast.success("Dealers updated successfully");
        setDealerList((prevCust) => {
          return prevCust.map((item) => {
            if (item.id === editSale.id) {
              return { ...item, ...editSale };
            }
            return item;
          });
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Dealers updated Error to server");
      // console.error("Error updating cust:", error);
    }
  };

  //download excel file
  const downloadExcel = () => {
    if (dealerList.length === 0) {
      toast.error("No data available to download.");
      return;
    }

    // Map dealerList to create a formatted array of objects
    const formattedData = dealerList.map((customer, index) => ({
      "Sr No": index + 1,
      Code: customer.srno,
      "Customer Name": customer.cname,
      Mobile: customer.mobile || customer.Phone,
      City: customer.City,
      District: customer.dist,
      "Bank Name": customer.cust_bankname,
      "A/C No": customer.cust_accno,
      IFSC: customer.cust_ifsc,
    }));

    // Create a new worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dealers List");

    // Write the workbook and download it
    XLSX.writeFile(workbook, "Dealers_List.xlsx");
  };

  //fetch Dealer list through API
  useEffect(() => {
    const fetchDealerList = async () => {
      try {
        const response = await axiosInstance.post("/dealer");
        let customers = response?.data?.customerList || [];
        // Sort customers by createdon in descending order (newest first)
        customers.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        setDealerList(customers);
      } catch (error) {
        // console.error("Error fetching dealer list: ", error);
        toast.error("There was an error fetching the dealer list.");
      }
    };
    fetchDealerList();
  }, []);

  //handle delete with api
  const handleDelete = async (cid) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this Dealer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // console.log("saleid", id);
        const res = await axiosInstance.post("/delete/customer", { cid }); // Replace with your actual API URL
        toast.success(res?.data?.message);

        setDealerList((prevSales) =>
          prevSales.filter((sale) => sale.cid !== cid)
        );
      } catch (error) {
        // console.error("Error deleting dealer:", error);
        toast.error("Error deleting  dealer to server");
      }
    }
  };

  // Handle Enter key press to move to the next field
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };

  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h10 d-flex j-end">
        <button className="btn" onClick={downloadExcel}>
          <span className="f-label-text px10">Download Excel</span>
          <FaDownload />
        </button>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
        <span className="heading p10">Dealers List</span>
        <div className="customer-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div h10 d-flex center forDWidth t-center sb">
            <span className="f-info-text w5">SrNo</span>
            <span className="f-info-text w5">Code</span>
            <span className="f-info-text w25">Customer Name</span>
            <span className="f-info-text w10">Mobile</span>
            <span className="f-info-text w10">City</span>
            <span className="f-info-text w10">District</span>
            {/* <span className="f-info-text w10">PinCode</span> */}
            <span className="f-info-text w15">Bank Name</span>
            <span className="f-info-text w15">A/C No</span>
            <span className="f-info-text w10">IFSC</span>
            <span className="f-info-text w10">Actions</span>
          </div>
          {/* Show Spinner if loading, otherwise show the customer list */}
          {dealerList.length > 0 ? (
            dealerList.map((customer, index) => (
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
                <span className="text w5">{customer.srno}</span>
                <span className="text w25 t-start">{customer.cname}</span>
                <span className="text w10">{customer.Phone}</span>
                <span className="text w10">{customer.City}</span>
                <span className="text w10">{customer.dist}</span>
                {/* <span className="text w10">{customer.cust_pincode}</span> */}
                <span className="text w15">{customer.cust_bankname}</span>
                <span className="text w15">{customer.cust_accno}</span>
                <span className="text w10">{customer.cust_ifsc}</span>
                <span className="text w10">
                  <FaRegEdit
                    size={15}
                    className="table-icon"
                    onClick={() => handleEditClick(customer)}
                  />
                  <MdDeleteOutline
                    onClick={() => handleDelete(customer.cid)}
                    size={15}
                    className="table-icon "
                    style={{ color: "red" }}
                  />
                </span>
              </div>
            ))
          ) : (
            <div>No customer found</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="pramod modal">
          <div className="modal-content">
            <h2>Update Dealer Details</h2>
            <label>
              Dealer Name:
              <input
                type="text"
                value={editSale?.cname}
                onChange={(e) =>
                  setEditSale({ ...editSale, cname: e.target.value })
                }
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("phono"))
                }
              />
            </label>{" "}
            <label>
              Phone:
              <input
                type="number"
                id="phono"
                value={editSale?.Phone}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, Phone: e.target.value })
                }
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("city"))
                }
              />
            </label>
            <div className="row d-flex my10">
              <label>
                City:
                <input
                  type="text"
                  id="city"
                  value={editSale?.City}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setEditSale({ ...editSale, City: e.target.value })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("dist"))
                  }
                />
              </label>
              <label style={{ marginLeft: "10px" }}>
                District:
                <input
                  type="text"
                  id="dist"
                  onFocus={(e) => e.target.select()}
                  value={editSale?.dist}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("ifsc"))
                  }
                  onChange={(e) =>
                    setEditSale({ ...editSale, dist: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Bank IFSC:
              <input
                type="text"
                id="ifsc"
                value={editSale?.cust_ifsc}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("acno"))
                }
                onChange={(e) =>
                  setEditSale({ ...editSale, cust_ifsc: e.target.value })
                }
              />
            </label>
            <label>
              A/C No:
              <input
                id="acno"
                type="number"
                value={editSale?.cust_accno}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, cust_accno: e.target.value })
                }
              />
            </label>
            <div>
              <button onClick={handleSaveChanges}>Update</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealersList;
