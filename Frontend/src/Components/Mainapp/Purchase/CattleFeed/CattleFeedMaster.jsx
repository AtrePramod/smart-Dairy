// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
// import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";
// import { useDispatch } from "react-redux";
import CattleFeedPurNavlinks from "./CattleFeedNavlinks";
import CattleFeedPurNavViews from "./CattleFeedPurNavViews";

const CattleFeedPurMaster = () => {
  // const dispatch = useDispatch();
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedCattleFeedSaleIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedCattleFeedSaleIndex", isselected);
  }, [isselected]);

  // useEffect(() => {
  //   localStorage.setItem("selectedCustIndex", isselected);
  // }, [isselected]);

  // useEffect(() => {
  //   dispatch(getMaxCustNo());
  // }, []);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <CattleFeedPurNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        <CattleFeedPurNavViews index={isselected} />
      </div>
    </div>
  );
};

export default CattleFeedPurMaster;
