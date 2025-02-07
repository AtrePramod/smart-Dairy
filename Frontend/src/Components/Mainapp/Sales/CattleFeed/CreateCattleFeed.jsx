// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../../../App/axiosInstance";
import { useSelector } from "react-redux";
import "../sales.css";
import Invoice from "../Invoice";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toWords } from "number-to-words";

const CreateCattleFeed = () => {
  // State variables for cart, customer info, date, etc.
  const [cartItem, setCartItem] = useState([]);
  const [cname, setCname] = useState("");
  const [fcode, setFcode] = useState("");
  const [date, setDate] = useState("");
  const [itemList, setItemList] = useState([]);
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [selectitemcode, setSelectitemcode] = useState(0);
  const [amt, setAmt] = useState(0);
  const [rctno, setRctno] = useState(localStorage.getItem("receiptno") || 1);
  const customerslist = useSelector((state) => state.customer.customerlist);
  const [userid, setUserid] = useState("");
  const [billNo, setBillNo] = useState("9112");
  const [purchaseData, setPurchaseData] = useState([]);
  const dairyInfo = useSelector((state) => state.dairy.dairyData.SocietyName);

  // Fetch all items for the cattle feed sale
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all?ItemGroupCode=1");
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

  // Set today's date
  useEffect(() => {
    setDate(getTodaysDate());
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

  // Set customer code (fcode) based on cname
  useEffect(() => {
    if (cname && customerslist.length > 0) {
      const custname = customerslist.find((item) => item.cname === cname);
      if (custname) {
        setFcode(custname.srno ?? "");
      } else {
        setFcode("");
      }
    } else {
      setFcode("");
    }
  }, [cname, customerslist]);

  // Update the amount whenever rate or quantity changes
  useEffect(() => {
    setAmt(rate * qty);
  }, [rate, qty]);

  // Function to get the current date
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Function to find item name based on item code
  const handleFindItemName = (id) => {
    const selectedItem = itemList.find((item) => item.ItemCode === id);
    return selectedItem.ItemName;
  };

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
        ItemGroupCode: 1, // update grpcode
        Rate: rate,
        Amount: qty * rate,
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

  // Generate a new bill number using the current timestamp
  useEffect(() => {
    const generateBillNo = () => {
      const timestamp = Date.now();
      setBillNo(`9${timestamp}`);
    };
    generateBillNo();
  }, []);

  // Delete an item from the cart
  const handleDeleteItem = (id) => {
    if (confirm("Are you sure you want to Delete?")) {
      const updatedCart = cartItem.filter((item, index) => index !== id);
      setCartItem(updatedCart);
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
          localStorage.setItem("receiptno", parseInt(rctno) + 1);
        }
      } catch (error) {
        console.error("Error Submitting items to server");
      }
    } else {
      toast.error("Please add items to the cart");
    }
  };

  // get rate of item from purchasemaster
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/purchase/all?itemgroupcode=1");
        if (res?.data?.purchaseData) {
          setPurchaseData(res.data.purchaseData);
          // console.log(res.data.purchaseData);
        }
      } catch (error) {
        console.log("Rate fetching:", error);
      }
    };
    fetch();
  }, []);

  //use set rate in rate field
  useEffect(() => {
    if (purchaseData.length > 0) {
      const sortedPurchaseData = [...purchaseData].sort(
        (a, b) => new Date(b.purchaseid) - new Date(a.purchaseid)
      );
      const rateItem = sortedPurchaseData.find(
        (item) => item.itemcode === selectitemcode
      );
      setRate(rateItem?.salerate ?? "");
    }
  }, [selectitemcode]);

  // Function to handle printing the invoice
  const handlePrint = () => {
    handleSubmit();
    if (cartItem.length > 0) {
      const printWindow = window.open("", "_blank");
      const printContent = document.getElementById("print-section").innerHTML;

      if (printWindow) {
        printWindow.document.write(
          `
        <html>
          <head>
            <title>Print</title>
            <style>
              @page {
                size: A4 landscape;
                margin: 5mm;
              }
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                margin: 0;
                padding: 0;
              }
              #print-section {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height:100%;
                padding: 10mm;
                box-sizing: border-box;
                flex-wrap: wrap;
              }
              .invoice { 
                width: 46%;
                border: 1px solid black;
                height:100%;
                padding: 1mm;
                box-sizing: border-box;
               display: flex;
              flex-direction: column;
              }
              .invoice-header {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 0;
              }
                 .invoice-sub-header {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
                margin-right: 90px;

              }
              .invoice-info {
                display: flex;
                margin:0 10px;
                justify-content: space-between;
                margin-bottom: 10px;
              }

              .invoice-outstanding-container{
                width: 100%;
                display: flex; 
                justify-content: end;
                margin-bottom:10px;
              }
              .outstanding-conatiner{
                width: 120px;
                height : 50px;
                text-align: center;
                border: 1px solid black;
              }
     

              .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 10px;
              }
              .invoice-table th, .invoice-table td {
              font-size: 12px;
                border: 1px solid black;
                padding: 5px;
                text-align: center;
                word-wrap: break-word;
              }
              
            
              .signature-box {
                display: flex;
                justify-content: space-between;
                margin-top: auto;
                font-weight: bold;
              }
              .signature-box span {
                width: 45%;
                text-align: center;
                border-top: 1px solid black;
                padding-top: 10px;
              }
                .footer{
                margin-top:10px;
                display:flex;
                justify-content:center;
                }
            </style>
          </head>
          <body>
            <div id="print-section">${printContent}</div>
          </body>
        </html>
        `
        );
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        alert("Failed to open print window. Check pop-up settings.");
      }
    }
  };

  // Function to handle download pdf the invoice
  const exportToPDF = () => {
    if (cartItem.length === 0) {
      alert("No data available to export.");
      return;
    }

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

    // Add "Sale-Info" heading with border
    doc.setFontSize(14);
    const invoiceInfo = doc.getTextWidth("Sale-Info");
    doc.text("Sale-Info", (pageWidth - invoiceInfo) / 2, margin + 25);

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

    //table outstanding
    // Define columns and rows
    const columns1 = ["Current Outstanding"];
    const rows1 = [[`${0}`]];
    const columnWidths = [40];
    doc.autoTable({
      head: [columns1],
      body: rows1,
      startY: margin + 5,
      columnStyles: {
        0: { cellWidth: columnWidths[0] }, // Setting width for the first column (Current Outstanding)
      },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        halign: "center", // Horizontal alignment for cells (centered)
        valign: "middle", // Vertical alignment for cells (centered)
        lineWidth: 0.08, // Line width for the borders
        lineColor: [0, 0, 0], // Black border color
      },
      headStyles: {
        fontSize: 10,
        fillColor: [225, 225, 225], // Light gray background for the header
        textColor: [0, 0, 0], // Black text color for header
      },
      tableLineColor: [0, 0, 0], // Table border color (black)
    });

    // Save the PDF
    doc.save("Invoice.pdf");
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
    const itemsNotInCart = itemList.filter(
      (item) => !cartItem.some((cart) => cart.ItemCode === item.ItemCode)
    );
    setFilteredItems(itemsNotInCart);
  }, [itemList, cartItem]);

  return (
    <div className="sale-add  w100">
      <div className="form w100 bg">
        <span className="heading">Create Cattle Feed</span>
        <div className="row">
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
              className="data"
              onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
              min="0"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="info-text px10">Farmer Code:</label>
            <input
              type="number"
              name="code"
              className="data"
              value={fcode}
              onChange={(e) => setFcode(e.target.value.replace(/\D/, ""))}
              min="0"
              onFocus={handleFocus}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("selectitemcode"))
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
                handleKeyPress(e, document.getElementById("selectitemcode"))
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
        <div className="row">
          <div className="col">
            <label className="info-text px10">Select Items:</label>

            <select
              disabled={!cname}
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
        </div>
        <div className="row"></div>
        <div className="row w100  d-flex ">
          <div className="col">
            <label className="info-text px10">Rate:</label>
            <input
              type="number"
              name="rate"
              id="rate"
              className="data"
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("addtocart"))
              }
              value={rate}
              onFocus={handleFocus}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value)))}
              min="0"
              disabled={!selectitemcode}
            />
          </div>
          <div className="col">
            <label className="info-text px10">Amount:</label>
            <input
              type="number"
              className="data"
              name="amount"
              value={amt}
              readOnly
            />
          </div>
        </div>
        <div className=" d-flex j-end my10">
          <button className="btn" id="addtocart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="for-table mx15 px10 w100">
        <div className="modal-content w100  ">
          <div className="header">
            <h2>Items List</h2>
          </div>

          <div className="sales-table-container w100">
            <table className="sales-table w100 ">
              <thead className="bg2">
                <tr>
                  <th>SrNo</th>
                  <th>Item Name</th>
                  <th>Rate</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItem.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{handleFindItemName(item.ItemCode)}</td>
                    <td>{item.Rate}</td>
                    <td>{item.Qty}</td>
                    <td>{item.Amount}</td>
                    <td>
                      <MdDeleteOutline
                        size={20}
                        className="table-icon"
                        style={{ color: "red" }}
                        onClick={() => handleDeleteItem(i)}
                      />
                    </td>
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
                    {cartItem.reduce((acc, item) => acc + item.Amount, 0)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w100 d-flex j-end  my10">
            <button className="w-btn mx10 " onClick={handelClear}>
              Clear
            </button>{" "}
            <button className="w-btn " onClick={exportToPDF}>
              Pdf
            </button>
            <button className="w-btn mx15" onClick={handlePrint}>
              Print
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

      <div id="print-section" style={{ display: "none" }}>
        {/* <!-- First Invoice --> */}
        <Invoice
          cartItem={cartItem}
          handleFindItemName={handleFindItemName}
          cname={cname}
          dairyInfo={dairyInfo}
          fcode={fcode}
          rctno={rctno}
          date={date}
        />

        {/* <!-- Second Invoice (same as the first) --> */}
        <Invoice
          cartItem={cartItem}
          handleFindItemName={handleFindItemName}
          cname={cname}
          fcode={fcode}
          rctno={rctno}
          dairyInfo={dairyInfo}
          date={date}
        />
      </div>
    </div>
  );
};

export default CreateCattleFeed;
