// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../../../App/axiosInstance";
import "../../Inventory/InventroyPages/productSale.css";
import { toast } from "react-toastify";
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
  const [dealerList, setDealerList] = useState([]);
  const [billNo, setBillNo] = useState("9112");
  const [sellrate, setSellrate] = useState(0);
  const [errors, setErrors] = useState({});

  // Fetch all items from API GRP wise
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all?ItemGroupCode=3");
        setItemList(data.itemsData || []);
      } catch (error) {
        toast.error("Failed to fetch items. Please try again.");
      }
    };
    fetchAllItems();
  }, []);

  // Fetch all dealer from API
  useEffect(() => {
    const fetchDealerList = async () => {
      try {
        const response = await axiosInstance.post("/dealer");
        let customers = response?.data?.customerList || [];
        customers.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        setDealerList(customers);
      } catch (error) {
        toast.error("Failed to fetch Dealer. Please try again.");
      }
    };
    fetchDealerList();
  }, []);

  // Set today's date
  useEffect(() => {
    setDate(getTodaysDate());
  }, []);

  // Set customer name on the dealer code
  useEffect(() => {
    if (fcode) {
      const dealer = dealerList.find(
        (customer) => customer.srno === parseInt(fcode)
      );
      if (dealer) {
        setCname(dealer.cname);
      } else {
        setCname(""); // Reset if code doesn't match
      }
    } else {
      setCname("");
    }
  }, [fcode, dealerList]);

  // Set dealer code on the dealer name
  useEffect(() => {
    if (cname) {
      const dealer = dealerList.find((customer) => customer.cname === cname);
      if (dealer) {
        setFcode(dealer.srno.toString());
      } else {
        setFcode(""); // Reset if name doesn't match
      }
    }
  }, [cname, dealerList]);

  // Update the amount whenever rate or quantity changes
  useEffect(() => {
    setAmt(rate * qty);
  }, [rate, qty]);

  // Function to get the current date
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const validateForm = () => {
    const newErrors = {};

    if (!date) newErrors.date = "date is required";
    if (!rctno) newErrors.rctno = "Receipt No is required";
    if (!fcode) newErrors.fcode = "Dealer code is required";
    if (!cname) newErrors.cname = "Dealer name is required";
    if (!selectitemcode) newErrors.selectitemcode = "Item is required";
    if (qty <= 0) newErrors.qty = "Quantity must be greater than 0";
    if (rate <= 0) newErrors.rate = "Rate must be greater than 0";
    if (sellrate < rate)
      newErrors.sellrate = "Sale rate must be greater than Purchase Rate";
    return newErrors;
  };

  // Add item to the cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      if (selectitemcode > 0 && qty > 0 && rate > 0) {
        const selectedItem = itemList.find(
          (item) => item.ItemCode === selectitemcode
        );
        const newCartItem = {
          receiptno: rctno, // Receipt No
          dealerCode: fcode,
          dealerName: cname,
          billno: billNo,
          itemcode: selectedItem?.ItemCode,
          itemname: selectedItem?.ItemName,
          purchasedate: date + " 00:00:00",
          qty: qty,
          itemgroupcode: 3, // update Itemgroupcode
          rate: rate,
          amount: qty * rate,
          salerate: parseInt(sellrate),
        };

        // Update the cart items
        setCartItem((prev) => [...prev, newCartItem]);

        // Reset input values
        setQty(1);
        setRate(0);
        setAmt(0);
        setSelectitemcode(0);
        setSellrate(0);
      } else {
        toast.error("Please select item and enter quantity and rate");
      }
    }
  };

  // Generate a new bill number using the current timestamp
  useEffect(() => {
    const generateBillNo = () => {
      const timestamp = Date.now();
      setBillNo(`9${timestamp}`);
    };
    generateBillNo();
  }, [rctno]);

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
    setSellrate(0);
    setErrors([]);
  };

  // Handle form submission and send cart data to the server
  const handleSubmit = async () => {
    if (cartItem.length > 0) {
      try {
        const res = await axiosInstance.post("/purchase/new", cartItem);
        if (res?.data?.success) {
          handelClear();
          setRctno(parseInt(rctno) + 1);
          toast.success(res.data.message);
          localStorage.setItem("receiptpurno", parseInt(rctno) + 1);
        }
      } catch (error) {
        console.error("Error Submitting items:", error);
        toast.error("Submitting items Error");
      }

      // console.log("Submit data: ", cartItem);
    } else {
      toast.error("Please add items to the cart.");
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
    <div className="sale-add  w100">
      <div className="form w100 bg">
        <span className="heading">Create Grocery</span>
        <div className="row">
          <div className="col">
            <label className="info-text px10">Date:</label>
            <input
              type="date"
              id="date"
              className={`data ${errors.date ? "input-error" : ""}`}
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={date}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("rctno"))
              }
            />
          </div>
          <div className="col">
            <label className="info-text px10">Receipt No:</label>
            <input
              type="number"
              id="rctno"
              name="number"
              value={rctno}
              className={`data ${errors.rctno ? "input-error" : ""}`}
              onChange={(e) => setRctno(e.target.value.replace(/\D/, ""))}
              min="0"
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("fcode"))
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="info-text px10">Dealer Code:</label>
            <input
              type="number"
              id="fcode"
              name="code"
              className={`data ${errors.fcode ? "input-error" : ""}`}
              value={fcode}
              onChange={(e) => setFcode(e.target.value.replace(/\D/, ""))}
              min="0"
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("cname"))
              }
            />
          </div>
          <div className="col">
            <label className="info-text px10">Dealer Name:</label>
            <select
              id="cname"
              value={cname}
              className={`data ${errors.cname ? "input-error" : ""}`}
              onChange={(e) => setCname(e.target.value)}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("selectitemcode"))
              }
            >
              <option value="">Select Dealer</option>
              {dealerList.map((item, i) => (
                <option key={i} value={item.cname}>
                  {item.cname}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label className="info-text px10">Select Items:</label>

            <select
              id="selectitemcode"
              disabled={!cname}
              value={selectitemcode}
              className={`data ${errors.selectitemcode ? "input-error" : ""}`}
              onChange={(e) => setSelectitemcode(parseInt(e.target.value))}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("qty"))
              }
            >
              <option value="0">Select Item</option>
              {itemList.length > 0 &&
                itemList.map((item, i) => (
                  <option key={i} value={item.ItemCode}>
                    {item.ItemName}
                  </option>
                ))}
            </select>
          </div>
          <div className="col">
            <label className="info-text px10">QTY:</label>
            <input
              id="qty"
              disabled={!selectitemcode}
              type="number"
              value={qty}
              className={`data ${errors.qty ? "input-error" : ""}`}
              name="qty"
              min="1"
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("rate"))
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="info-text px10">Purchase Rate:</label>
            <input
              id="rate"
              type="number"
              name="rate"
              className={`data ${errors.rate ? "input-error" : ""}`}
              value={rate}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value)))}
              min="0"
              disabled={!selectitemcode}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("sellrate"))
              }
            />
          </div>
          <div className="col">
            <label className="info-text px10">Sale Rate:</label>
            <input
              id="sellrate"
              type="number"
              name="rate"
              className={`data ${errors.sellrate ? "input-error" : ""}`}
              value={sellrate}
              onChange={(e) => setSellrate(e.target.value)}
              disabled={!selectitemcode}
            />
          </div>
        </div>
        <div className="row w100  d-flex a-center">
          <div className="col">
            <label className="info-text px10">Amount:</label>
            <input
              id="amt"
              type="number"
              className={`data ${errors.amt ? "input-error" : ""}`}
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
                    <td>{item.itemname}</td>
                    <td>{item.rate}</td>
                    <td>{item.qty}</td>
                    <td>{item.amount}</td>
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
                    {cartItem.reduce((acc, item) => acc + item.amount, 0)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w100 d-flex  my10">
            <button className="w-btn" onClick={handleSubmit}>
              save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
