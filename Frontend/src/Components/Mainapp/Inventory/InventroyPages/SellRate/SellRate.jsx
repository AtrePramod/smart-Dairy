// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import SellRateNavlinks from "./SellRateNavlinks";
import SellRateNavViews from "./SellRateNavViews";

const SellRate = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectsellrateIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectsellrateIndex", isselected);
  }, [isselected]);

  return (
    <>
      <div className="customer-master-container w100 h1 d-flex-col">
        <div className="customer-master-navigation w100 h10 d-flex bg3">
          <SellRateNavlinks
            isselected={isselected}
            setIsSelected={setIsSelected}
          />
        </div>
        <div className="customer-views w100 h90 d-flex center">
          <SellRateNavViews index={isselected} />
        </div>
      </div>
    </>
  );
};

export default SellRate;
