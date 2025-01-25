import React, { useEffect, useState } from "react";
import Reportviews from "./Reportviews";
import Reportlinks from "./Reportlinks";
import "../../../../Styles/Customer/CustNavViews/CustMilkCollection.css";
import { useTranslation } from "react-i18next";

const CustMilkCollection = () => {
  const { t } = useTranslation();
  const [isselected, setIsselected] = useState(0);

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectednavIndex", isselected);
  }, [isselected]);

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedReport", isselected);
  }, [isselected]);

  // ...............................
  return (
    <div className="cust-milk-collection-info w100 h1 d-felx-col">
      <div className="title-type-conatiner w100 d-flex-col">
        <div className="menu-title-div w70 mx-15 h10 d-flex a-center p10">
          <h2 className="f-heading">{t("mc-title")}</h2>
        </div>
        <div className="report-type-container w70 d-flex a-center px10">
          <Reportlinks isselected={isselected} setselected={setIsselected} />
        </div>
      </div>
      <div className="report-virews-container w70 mx-15 h80 d-flex p10 ">
        <Reportviews index={isselected} />
      </div>
    </div>
  );
};

export default CustMilkCollection;
