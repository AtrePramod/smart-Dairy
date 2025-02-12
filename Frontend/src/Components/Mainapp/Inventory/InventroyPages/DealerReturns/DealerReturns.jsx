// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import DealerReturnsNavViews from "./DealerReturnsNavViews";
import DealerReturnsNavlinks from "./DealerReturnsNavlinks";

const DealerReturns = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedDealerReturnsIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedDealerReturnsIndex", isselected);
  }, [isselected]);
  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <DealerReturnsNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        <DealerReturnsNavViews index={isselected} />
      </div>
    </div>
  );
};

export default DealerReturns;
