import React, { useEffect, useState } from "react";
import CustomerNavlinks from "./CustomerNavlinks";
import CustomerNavViews from "./CustomerNavViews";
import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";
import { useDispatch } from "react-redux";
import { getMaxCustNo } from "../../../../../App/Features/Customers/customerSlice";

const CustomersMaster = () => {
  const dispatch = useDispatch();
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedCustIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedCustIndex", isselected);
  }, [isselected]);

  // useEffect(() => {
  //   localStorage.setItem("selectedCustIndex", isselected);
  // }, [isselected]);

  useEffect(() => {
    dispatch(getMaxCustNo());
  }, []);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <CustomerNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        <CustomerNavViews index={isselected} />
      </div>
    </div>
  );
};

export default CustomersMaster;
