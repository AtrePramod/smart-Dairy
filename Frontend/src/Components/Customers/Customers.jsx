import React, { useEffect, useState } from "react";
import CustNavbar from "./CustNavbar";
import Custnavviews from "./Custnavviews";
import "../../Styles/Customer/Customer.css";
import { useDispatch } from "react-redux";

const Customers = () => {

  const [isselected, setIsselected] = useState(0);

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectednavIndex", isselected);
  }, [isselected]);

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectednavIndex", isselected);
  }, [isselected]);

  // Handle back button click to reset the index to 0
  const handleBackButton = () => {
    setIsselected(0); // Set isselected to 0
  };

  

  return (
  
      <div className="customer-container w100 h100 d-flex-col">
        <CustNavbar
          handleBackButton={handleBackButton}
          setselected={setIsselected}
        />
        <div className="customer-nav-view-container w100 h90 d-flex">
          <Custnavviews setselected={setIsselected} index={isselected} />
        </div>
      </div>
  );
};

export default Customers;
