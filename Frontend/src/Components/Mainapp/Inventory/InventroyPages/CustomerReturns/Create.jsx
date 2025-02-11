// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";
import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import "./CustomerReturns.css";
import { toWords } from "number-to-words";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

const Create = () => {
  const [date, setDate] = useState("");
  const [cartItem, setCartItem] = useState([]);
  const [cname, setCname] = useState("");
  const [fcode, setFcode] = useState("");
  const [rctno, setRctno] = useState(
    localStorage.getItem("custretreceiptno") || 1
  );

  const [amt, setAmt] = useState(0);
  const [selectitemcode, setSelectitemcode] = useState(0);
  const [selectitemgrp, setSelectitemgrp] = useState(1);
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [userid, setUserid] = useState("");
  const customerslist = useSelector((state) => state.customer.customerlist);
  const [billNo, setBillNo] = useState("9112");
  const dairyInfo = useSelector((state) => state.dairy.dairyData.SocietyName);
  const [filteredProducts, setFilterProducts] = useState([]);

  // Fetch all items for the add to returns
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all");
        if (data.itemsData) {
          setItemList(data.itemsData);
        } else {
          console.warn("No items data found");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchAllItems();
  }, []);

  // Set customer name and ID based on the farmer code
  useEffect(() => {
    if (customerslist.length > 0 && fcode) {
      const customer = customerslist.find(
        (customer) => customer.srno === parseInt(fcode)
      );
      if (customer) {
        setCname(customer.cname || "");
        setUserid(customer.rno || "");
      } else {
        setCname("");
        setUserid("");
      }
    } else {
      setCname("");
      setUserid("");
    }
  }, [fcode, customerslist]);

  // Function to get the current date
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Set today's date
  useEffect(() => {
    setDate(getTodaysDate());
  }, []);

  // Update the amount whenever rate or quantity changes
  useEffect(() => {
    setAmt(rate * qty);
  }, [rate, qty]);

  // Generate a new bill number using the current timestamp
  useEffect(() => {
    const generateBillNo = () => {
      const timestamp = Date.now();
      setBillNo(`9${timestamp}`);
    };
    generateBillNo();
  }, []);

  // Add item to the cart
  const handleAddToCart = () => {
    if (selectitemcode > 0 && qty > 0 && rate > 0) {
      const selectedItem = itemList.find(
        (item) => item.ItemCode === selectitemcode
      );
      const newCartItem = {
        ReceiptNo: rctno, // Receipt No
        userid: userid,
        BillNo: billNo,
        ItemCode: selectedItem?.ItemCode,
        BillDate: date + " 00:00:00",
        Qty: qty,
        CustCode: fcode,
        ItemGroupCode: selectitemgrp,
        Rate: rate,
        Amount: qty * rate,
        cn: 1,
      };

      // Update the cart items
      setCartItem((prev) => {
        const updatedCart = [...prev, newCartItem];
        return updatedCart;
      });

      // Reset input values
      setQty(1);
      setRate(0);
      setAmt(0);
      setSelectitemcode(0);
    } else {
      toast.error("Please Enter all fields");
    }
  };

  // Delete an item from the cart
  const handleDeleteItem = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      const updatedCart = cartItem.filter((item, index) => index !== id);
      setCartItem(updatedCart);
    }
  };

  // Handle form submission and send cart data to the server
  const handleSubmit = async () => {
    if (cartItem.length > 0) {
      try {
        const res = await axiosInstance.post("/sale/create", cartItem);
        if (res?.data?.success) {
          setFcode("");
          setCartItem([]);
          setQty(1);
          setRate(0);
          setAmt(0);
          setRctno(parseInt(rctno) + 1);
          setSelectitemcode(0);
          toast.success(res.data.message);
          const timestamp = Date.now();
          setBillNo(`9${timestamp}`);
          localStorage.setItem("custretreceiptno", parseInt(rctno) + 1);
        }
      } catch (error) {
        console.error("Error Submitting items to server");
      }
    } else {
      toast.error("Please add items to the cart");
    }
  };

  // Clear all form fields and the cart
  const handelClear = () => {
    setFcode("");
    setCartItem([]);
    setQty(1);
    setRate(0);
    setAmt(0);
    setSelectitemcode(0);
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

  // Select all the text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  // Filter out items that are already in the cart
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const itemsNotInCart = filteredProducts.filter(
      (item) => !cartItem.some((cart) => cart.ItemCode === item.ItemCode)
    );
    setFilteredItems(itemsNotInCart);
  }, [filteredProducts, cartItem]);

  //onchange event for itemgroup code
  useEffect(() => {
    if (selectitemgrp) {
      const filteredProducts = itemList.filter(
        (product) => parseInt(product.ItemGroupCode) === parseInt(selectitemgrp)
      );
      setFilterProducts(filteredProducts);
    } else {
      setFilterProducts(itemList);
    }
  }, [itemList, selectitemgrp]);

  // Function to find item name based on item code
  const handleFindItemName = (id) => {
    const selectedItem = itemList.find((item) => item.ItemCode === id);
    return selectedItem.ItemName;
  };

  // Function to handle download pdf the invoice
  const exportToPDF = () => {
    if (cartItem.length === 0) {
      alert("No data available to export.");
      return;
    }
    handleSubmit();

    const convertToWords = (num) => {
      const [integerPart, decimalPart] = num.toString().split(".");
      const integerWords = toWords(integerPart);
      const decimalWords = decimalPart ? " point " + toWords(decimalPart) : "";
      return `Rupees ${integerWords}${decimalWords} only`;
    };
    const doc = new jsPDF();

    // Define columns and rows
    const columns = ["Sr No", "Items", "Qty", "Rate", "Amount"];
    const rows = cartItem.map((item, index) => [
      index + 1,
      handleFindItemName(item.ItemCode),
      item.Qty,
      item.Rate,
      item.Amount,
    ]);

    const totalAmount = cartItem.reduce((acc, item) => acc + item.Amount, 0);

    // Page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Define the margin and the height of the box
    const margin = 10;
    const boxHeight = pageHeight - 20; // Adjust as needed

    // Add border for the entire content
    doc.rect(margin, margin, pageWidth - 2 * margin, boxHeight);

    // Add dairy name with border inside the box
    const dairyName = dairyInfo;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(dairyName);
    doc.text(dairyName, (pageWidth - dairyTextWidth) / 2, margin + 15);

    // Add "Return Sale-Info" heading with border
    doc.setFontSize(14);
    const invoiceInfo = doc.getTextWidth("Return Sale-Info");
    doc.text("Return Sale-Info", (pageWidth - invoiceInfo) / 2, margin + 25);

    //

    // Add Bill No and Date (aligned) with border
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const billNoText = `Bill No.: ${rctno || ""}`;
    const dateText = `Date: ${date || ""}`;
    doc.text(billNoText, margin + 5, margin + 40);
    doc.text(
      dateText,
      pageWidth - doc.getTextWidth(dateText) - 15,
      margin + 40
    );

    // Add Customer Code and Customer Name (aligned) with border
    const CustCode = `Cust No.: ${fcode || ""}`;
    const CustName = `Cust. Name: ${cname || ""}`;
    doc.text(CustCode, margin + 5, margin + 50);
    doc.text(
      CustName,
      pageWidth - doc.getTextWidth(CustName) - 15,
      margin + 50
    );

    // Add table for items with borders and centered text
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: margin + 60,
      margin: { top: 10 },
      styles: {
        cellPadding: 2,
        fontSize: 11,
        halign: "center", // Horizontal alignment for cells (centered)
        valign: "middle", // Vertical alignment for cells (centered)
        lineWidth: 0.08, // Line width for the borders
        lineColor: [0, 0, 0], // Black border color
      },
      headStyles: {
        fontSize: 12,
        fontStyle: "bold",
        fillColor: [225, 225, 225], // Light gray background for the header
        textColor: [0, 0, 0], // Black text color for header
      },
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.1, // Border width
    });

    // Add total amount with border
    doc.setFontSize(12);
    const totalAmountTextStr = `${convertToWords(totalAmount)}`;
    const totalAmountLabel = `Total Amount: ${totalAmount}`;

    const totalAmountTextWidth = doc.getTextWidth(totalAmountTextStr);
    const totalAmountLabelWidth = doc.getTextWidth(totalAmountLabel);

    // Add borders for total amount text
    doc.text(totalAmountTextStr, margin + 5, doc.lastAutoTable.finalY + 10);
    doc.text(
      totalAmountLabel,
      pageWidth - totalAmountLabelWidth - 15,
      doc.lastAutoTable.finalY + 10
    );

    // Footer (Signatures) with borders
    doc.text(
      "Signature of the consignee",
      margin + 5,
      doc.lastAutoTable.finalY + 40
    );
    doc.text(
      "Signature of the consignor",
      pageWidth - doc.getTextWidth("Signature of the consignor") - 15,
      doc.lastAutoTable.finalY + 40
    );
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const Info = doc.getTextWidth("Goods received as per the above details.");
    doc.text(
      "Goods received as per the above details.",
      (pageWidth - Info) / 2,
      doc.lastAutoTable.finalY + 50
    );

    // Save the PDF
    doc.save("Invoice.pdf");
  };

  return (
    <div className="h1 w100 d-flex p10 sa a-center cust-return">
      <div className="custCol bg w45 h80">
        <span className="heading p10">Add Customer Returns</span>
        <div className="w100 py10 px10">
          <div className="d-flex sb">
            <div className="col">
              <label className="info-text px10">Date:</label>
              <input
                type="date"
                className="data"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={date}
              />
            </div>
            <div className="col">
              <label className="info-text px10">Receipt No:</label>
              <input
                type="number"
                name="number"
                value={rctno}
                onFocus={handleFocus}
                className="data w40"
                onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
                min="0"
              />
            </div>
          </div>
          <div className="d-flex sb">
            <div className="col">
              <label className="info-text px10">Farmer Code:</label>
              <input
                type="number"
                name="code"
                className="data w40"
                value={fcode}
                onChange={(e) => setFcode(e.target.value.replace(/\D/, ""))}
                min="0"
                onFocus={handleFocus}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("selectitemgrp"))
                }
              />
            </div>
            <div className="col">
              <label className="info-text px10">Farmer Name:</label>
              <input
                type="text"
                name="fname"
                className="data"
                list="farmer-list"
                onFocus={handleFocus}
                value={cname}
                onChange={(e) => setCname(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("selectitemgrp"))
                }
              />
              <datalist id="farmer-list">
                {customerslist
                  .filter((customer) =>
                    customer.cname.toLowerCase().includes(cname.toLowerCase())
                  )
                  .map((customer, index) => (
                    <option key={index} value={customer.cname} />
                  ))}
              </datalist>
            </div>
          </div>
          <div className="d-flex sb w100 ">
            <div className="col w45">
              <label className="info-text px10">Select Item Group:</label>
              <select
                disabled={!cname}
                id="selectitemgrp"
                value={selectitemgrp}
                className="data"
                onChange={(e) => setSelectitemgrp(parseInt(e.target.value))}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("selectitemcode"))
                }
              >
                <option value="1">Cattle Feeds</option>
                <option value="2">Medicines</option>
                <option value="3">Grocery</option>
                <option value="4">Others</option>
              </select>
            </div>
            <div className="col w45">
              <label className="info-text px10">Select Items:</label>

              <select
                disabled={!fcode}
                id="selectitemcode"
                value={selectitemcode}
                className="data"
                onChange={(e) => setSelectitemcode(parseInt(e.target.value))}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("qty"))
                }
              >
                <option value="0">Select Item</option>
                {filteredItems.length > 0 &&
                  filteredItems.map((item, i) => (
                    <option key={i} value={item.ItemCode}>
                      {item.ItemName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="d-flex sb ">
            <div className="col">
              <label className="info-text px10">QTY:</label>
              <input
                disabled={!selectitemcode}
                type="number"
                value={qty}
                onFocus={handleFocus}
                className="data"
                id="qty"
                name="qty"
                min="1"
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("rate"))
                }
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
              />
            </div>
            <div className="col">
              <label className="info-text px10">Rate:</label>
              <input
                type="number"
                name="rate"
                id="rate"
                className="data w50"
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("addtocart"))
                }
                value={rate}
                onFocus={handleFocus}
                onChange={(e) =>
                  setRate(Math.max(0, parseFloat(e.target.value)))
                }
                min="0"
                disabled={!selectitemcode}
              />
            </div>
          </div>
          <div className="d-flex sb ">
            <div className="col">
              <label className="info-text px10">Amount:</label>
              <input
                type="number"
                className="data"
                name="amount w50"
                value={amt}
                readOnly
              />
            </div>
            <div className="col d-flex j-end my10">
              <button className="btn" id="addtocart" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="custCol bg w45 h80">
        <span className="heading p10">Item List</span>
        <div className="w100 h1 p10">
          <div className="w100 h10 d-flex sb a-center t-center sticky-top bg2 py10">
            <span className="f-label-text w5">No.</span>
            <span className="f-label-text w15">Name</span>
            <span className="f-label-text w5">Qty</span>
            <span className="f-label-text w5">Rate</span>
            <span className="f-label-text w10">Amount</span>
            <span className="f-label-text w20">Action</span>
          </div>
          {cartItem.map((item, i) => (
            <div key={i} className="w100 h10 d-flex sb a-center t-center">
              <span className="label-text w5">{i + 1}</span>
              <span className="label-text w15">
                {handleFindItemName(item.ItemCode)}
              </span>
              <span className="label-text w5">{item.Qty}</span>
              <span className="label-text w5">{item.Rate}</span>
              <span className="label-text w10">{item.Qty * item.Rate}</span>
              <span className="label-text w20 d-flex j-center">
                <MdDeleteOutline
                  color="red"
                  className="color-icon"
                  onClick={() => handleDeleteItem(i)}
                />
              </span>
            </div>
          ))}

          <div className="w100 h10 d-flex sb a-center t-center ">
            <span className="label-text w5"> </span>
            <span className="label-text w15"></span>
            <span className="label-text w5"> </span>
            <span className="label-text w5">Total </span>
            <span className="label-text w10">
              {cartItem.reduce((acc, item) => acc + item.Amount, 0)}
            </span>
            <span className="label-text w20 d-flex j-center"></span>
          </div>
          <div className="w100 d-flex j-end  my10">
            <button className="w-btn mx10 " onClick={handelClear}>
              Clear
            </button>
            <button className="w-btn mx10" onClick={exportToPDF}>
              Pdf
            </button>

            <button
              className="w-btn "
              onClick={handleSubmit}
              disabled={cartItem.length == 0}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
