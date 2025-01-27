/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import axiosInstance from "../../../../App/axiosInstance";
const List = () => {
  const [dealerList, setDealerList] = useState([]);

  const [editSale, setEditSale] = useState(null); // State to hold the sale being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleEditClick = (id) => {
    setEditSale(id);
    setIsModalOpen(true);
  };

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
        alert("Cust updated successfully");
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
      console.error("Error updating cust:", error);
    }
  };

  const downloadExcel = () => {
    if (dealerList.length === 0) {
      alert("No data available to download.");
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

  useEffect(() => {
    const fetchDealerList = async () => {
      try {
        const response = await axiosInstance.post("/dealer");
        let customers = response?.data?.customerList || [];
        // Sort customers by createdon in descending order (newest first)
        customers.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        setDealerList(customers);
      } catch (error) {
        console.error("Error fetching dealer list: ", error);
        alert("There was an error fetching the dealer list.");
      }
    };
    fetchDealerList();
  }, []);

  const handleDelete = async (cid) => {
    if (confirm("Are you sure you want to Delete?")) {
      try {
        // console.log("saleid", id);
        const res = await axiosInstance.post("/delete/customer", { cid }); // Replace with your actual API URL
        alert(res?.data?.message);

        setDealerList((prevSales) =>
          prevSales.filter((sale) => sale.cid !== cid)
        );
      } catch (error) {
        console.error("Error deleting sale item:", error);
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
        <span className="heading p10">Cattle Feed List</span>
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
              Customer Name:
              <input
                type="text"
                value={editSale?.cname}
                onChange={(e) =>
                  setEditSale({ ...editSale, cname: e.target.value })
                }
              />
            </label>{" "}
            <label>
              Phone:
              <input
                type="number"
                value={editSale?.Phone}
                onChange={(e) =>
                  setEditSale({ ...editSale, Phone: e.target.value })
                }
              />
            </label>
            <div className="row d-flex my10">
              <label>
                City:
                <input
                  type="text"
                  value={editSale?.City}
                  onChange={(e) =>
                    setEditSale({ ...editSale, City: e.target.value })
                  }
                />
              </label>
              <label style={{ marginLeft: "10px" }}>
                District:
                <input
                  type="text"
                  value={editSale?.dist}
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
                value={editSale?.cust_ifsc}
                onChange={(e) =>
                  setEditSale({ ...editSale, cust_ifsc: e.target.value })
                }
              />
            </label>
            <label>
              A/C No:
              <input
                type="number"
                value={editSale?.cust_accno}
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
export default List;
