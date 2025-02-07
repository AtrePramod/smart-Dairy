// eslint-disable-next-line no-unused-vars
import React from "react";
import { toWords } from "number-to-words";

// eslint-disable-next-line react/prop-types
const Invoice = ({  cartItem,  handleFindItemName,  cname,  fcode,  rctno,  date,  dairyInfo,}) => {
  // eslint-disable-next-line react/prop-types
  const totalAmount = cartItem.reduce((acc, item) => acc + item.Amount, 0);
  const convertToWords = (num) => {
    const [integerPart, decimalPart] = num.toString().split(".");
    const integerWords = toWords(integerPart);
    const decimalWords = decimalPart ? " point " + toWords(decimalPart) : "";
    return `Rupees ${integerWords}${decimalWords} only`;
  };
  return (
    <div className="invoice">
      <h2 className="invoice-header">{dairyInfo}</h2>
      <div className="invoice-outstanding-container">
        <h3 className="invoice-sub-header">Sale-Info</h3>
        <div className="outstanding-conatiner">
          <span className="span1">Current Outstanding</span>
          <hr />
          <span className="span1">0</span>
        </div>
      </div>
      <div className="invoice-info">
        <span>
          <b>Bill No.: {rctno || ""}</b>
        </span>
        <span>
          <b>Date: {date || ""}</b>
        </span>
      </div>
      <div className="invoice-info">
        <span>
          <b>Cust No.: {fcode || ""}</b>
        </span>
        <span>
          <b>Cust. Name: {cname || ""}</b>
        </span>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>SrNo</th>
            <th>Items</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {cartItem.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{handleFindItemName(item.ItemCode)}</td>
              <td>{item.Qty}</td>
              <td style={{ textAlign: "right" }}>{item.Rate}</td>
              <td style={{ textAlign: "right" }}>{item.Amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-info">
        <span>{convertToWords(totalAmount)}</span>
        <span>
          <b>Total Amount &nbsp; {totalAmount}</b>
        </span>
      </div>

      <div className="signature-box">
        <span>Signature of the consignee</span>
        <span>Signature of the consignor</span>
      </div>

      <div className="footer">Goods received as per the above details.</div>
    </div>
  );
};

export default Invoice;
