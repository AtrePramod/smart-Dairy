// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import CustomerReturnsNavlinks from "./CustomerReturnsNavlinks";
import CustomerReturnsNavViews from "./CustomerReturnsNavViews";

const CustomerReturns = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedCustomerReturnsIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedCustomerReturnsIndex", isselected);
  }, [isselected]);
  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <CustomerReturnsNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        <CustomerReturnsNavViews index={isselected} />
      </div>
    </div>
  );
};

export default CustomerReturns;
