// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../../../App/axiosInstance";
import { useSelector } from "react-redux";
import "../../Inventory/InventroyPages/productSale.css";

const Create = () => {
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
  const [rctno, setRctno] = useState(localStorage.getItem("receiptpurno") || 1);
  const customerslist = useSelector((state) => state.customer.customerlist);
  const [filterlist, setFilterlist] = useState([]);
  const [userid, setUserid] = useState("");
  const [billNo, setBillNo] = useState("9112");

  useEffect(() => {
    console.log("Filtering customers with ctype = 2");
    if (customerslist) {
      const filtered = customerslist.filter((customer) => customer.ctype === 2);
      setFilterlist(filtered);
    }
    console.log(filterlist);
  }, []); // Added customerslist as dependency to ensure filtering updates when it changes

  // Fetch all items for the cattle feed sale
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all?ItemGroupCode=1");
        setItemList(data.itemsData || []);
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
    if (filterlist.length > 0) {
      console.log(filterlist);
      const customer = filterlist.find(
        (customer) => customer.srno === parseInt(fcode)
      );
      setCname(customer?.cname || "");
      setUserid(customer?.rno || "");
    } else {
      setCname("");
    }
  }, [fcode, filterlist]);

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
        receiptpurno: rctno, // Receipt No
        userid: userid,
        BillNo: billNo,
        ItemCode: selectedItem?.ItemCode,
        BillDate: date + " 00:00:00",
        Qty: qty,
        CustCode: fcode,
        ItemGroupCode: 1, // update Itemgroupcode
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
          alert(res.data.message);
          const timestamp = Date.now();
          setBillNo(`9${timestamp}`);
          localStorage.setItem("receiptpurno", parseInt(rctno) + 1);
        }
      } catch (error) {
        console.error("Error Submitting items:", error);
      }
    }
  };

  // Function to handle printing the invoice
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const printContent = document.getElementById("print-section").innerHTML;

    if (printWindow) {
      printWindow.document.write(
        `
    <html>
      <head>
        <title>Print</title>
        <style>
          #print-section { width: 100%; display: flex; flex-direction: row; justify-content: space-between; gap: 1cm; padding: 1cm; }
          .invoice { width: 48%; border: 1px solid black; padding: 1cm; box-sizing: border-box; }
          .invoice-table { width: 100%; border-collapse: collapse; }
          .invoice-table th, .invoice-table td { border: 1px solid black; padding: 5px; text-align: left; word-wrap: break-word; }
          body { font-size: 12px; }
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
  };
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
          </div>{" "}
          <div className="col">
            <label className="info-text px10">Receipt No:</label>
            <input
              type="number"
              name="number"
              value={rctno}
              className="data"
              onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
              min="0"
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="info-text px10">Dealer Code:</label>
            <input
              type="number"
              name="code"
              className="data"
              value={fcode}
              onChange={(e) => setFcode(e.target.value.replace(/\D/, ""))}
              min="0"
            />
          </div>
          <div className="col">
            <label className="info-text px10">Farmer Name:</label>
            <input
              type="text"
              name="fname"
              className="data"
              value={cname}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="info-text px10">Select Items:</label>
            {itemList.length > 0 && (
              <select
                disabled={!cname}
                value={selectitemcode}
                className="data"
                onChange={(e) => setSelectitemcode(parseInt(e.target.value))}
              >
                <option value="0">Select Item</option>
                {itemList.map((item, i) => (
                  <option key={i} value={item.ItemCode}>
                    {item.ItemName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="info-text px10">QTY:</label>
            <input
              disabled={!selectitemcode}
              type="number"
              value={qty}
              className="data"
              name="qty"
              min="1"
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
            />
          </div>
        </div>
        <div className="row w100  d-flex a-center">
          <div className="col">
            <label className="info-text px10">Rate:</label>
            <input
              type="number"
              name="rate"
              className="data"
              value={rate}
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
        <div className=" d-flex sa my10">
          <button className="w-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button
            className="w-btn"
            onClick={handleSubmit}
            disabled={cartItem.length == 0}
          >
            Save
          </button>

          <button className="w-btn" onClick={handelClear}>
            Clear
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

          <div id="print-section" style={{ display: "none" }}>
            <div className="invoice">
              <h2 className="invoice-header">हरि ओम दूध संकलन केंद्र</h2>
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>तारीख</th>
                    <th>नरे</th>
                    <th>रेट</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>20/01/2025</td>
                    <td>10</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <b>कुल रक्कम:</b>
                    </td>
                    <td>500</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="invoice">
              <h2 className="invoice-header">हरि ओम दूध संकलन केंद्र</h2>
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>तारीख</th>
                    <th>नरे</th>
                    <th>रेट</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>20/01/2025</td>
                    <td>15</td>
                    <td>75</td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <b>कुल रक्कम:</b>
                    </td>
                    <td>1125</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="w100 d-flex j-end  my10">
            <button className="w-btn" onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
