// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import "../../Inventory/InventroyPages/productSale.css";
import Invoice from "../Invoice";
import { toast } from "react-toastify";

const CreateGrocery = () => {
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
  // Fetch all items for the cattle feed sale
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all?ItemGroupCode=3");
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
        companyid: selectedItem?.companyid,
        ReceiptNo: rctno, // Receipt No
        userid: userid,
        BillNo: billNo,
        ItemCode: selectedItem?.ItemCode,
        BillDate: date + " 00:00:00",
        Qty: qty,
        CustCode: fcode,
        ItemGroupCode: 3, // update grpcode
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
        const res = await axiosInstance.get("/purchase/all?itemgroupcode=3");
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
        toast.error("Failed to open print window. Check pop-up settings.");
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
        <span className="heading">Grocery Cattle Feed</span>
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
            <button
              className="w-btn "
              onClick={handleSubmit}
              disabled={cartItem.length == 0}
            >
              Save
            </button>

            <button className="w-btn mx15" onClick={handlePrint}>
              Print
            </button>
            <button className="w-btn " onClick={handelClear}>
              Clear
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
          date={date}
        />
      </div>
    </div>
  );
};
export default CreateGrocery;
