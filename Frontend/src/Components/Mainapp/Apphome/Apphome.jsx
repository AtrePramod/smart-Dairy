import React, { useEffect, useState } from "react";
import AppNavviews from "./AppNavviews";
import "../../../Styles/Mainapp/Apphome/Apphome.css";
import AppNavlinks from "./AppNavlinks";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../App/Features/Customers/customerSlice";
import { getRateCharts } from "../../../App/Features/Mainapp/Masters/rateChartSlice";
import { getMasterDates } from "../../../App/Features/Customers/Date/masterSlice";
import { generateMaster } from "../../../App/Features/Customers/Date/masterdateSlice";
import { getProfileInfo } from "../../../App/Features/Mainapp/Profile/ProfileSlice";

const Apphome = () => {
  const dispatch = useDispatch();
  const milkcollRatechart = useSelector((state) => state.ratechart.rateChart);
  const date = useSelector((state) => state.date.toDate);
  const yearStart = useSelector((state) => state.date.yearStart);
  const yearEnd = useSelector((state) => state.date.yearEnd);

  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("MilkCollTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("MilkCollTabIndex", isselected);
  }, [isselected]);

  //Store Milk Collection Ratechart to localstorage
  useEffect(() => {
    if (milkcollRatechart && milkcollRatechart.length > 0) {
      saveRatechart();
    }
  }, [milkcollRatechart]);

  const saveRatechart = () => {
    // Convert data to JSON and calculate size
    const jsonData = JSON.stringify(milkcollRatechart);
    const dataSize = new Blob([jsonData]).size;

    // Check if size is within localStorage limit (usually 5 MB)
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (dataSize <= maxSize) {
      localStorage.setItem("milkcollrcharts", jsonData);
      console.log("Data successfully stored in localStorage.");
    } else {
      console.warn("Data size exceeds localStorage limit, cannot store.");
    }
  };

  //save customer list in local storage
  useEffect(() => {
    dispatch(listCustomer());
    dispatch(getRateCharts());
    dispatch(getProfileInfo());
    dispatch(generateMaster(date));
    if (yearStart && yearEnd) {
      dispatch(getMasterDates({ yearStart, yearEnd }));
    }
  }, []);

  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center">
        <AppNavlinks isselected={isselected} setIsSelected={setIsSelected} />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center p10">
        <AppNavviews index={isselected} />
      </div>
    </div>
  );
};

export default Apphome;
