import React, { useEffect, useState } from "react";
import Mainappviews from "./Mainappviews";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../Styles/Mainapp/Mainapphome.css";
import {
  centerDetails,
  centersLists,
  maxCenterId,
} from "../../App/Features/Dairy/Center/centerSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";
// import { fetchMilkCollRatechart } from "../../App/Features/Mainapp/Masters/rateChartSlice";
import { listCustomer } from "../../App/Features/Customers/customerSlice";
import Footer from "./Footer";

const Mainapp = () => {
  const dispatch = useDispatch();
  const dairy_id = useSelector((state) => state.dairy.dairyData.SocietyCode);
  const [openSidebar, setOpenSidebar] = useState(false); //fuctional sidebar

  const handleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // Retrieve isselected from localStorage, defaulting to 0 if not set
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectedNavIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedNavIndex", isselected);
  }, [isselected]);

  useEffect(() => {
    dispatch(centerDetails());
    dispatch(centersLists());
    // dispatch(fetchMilkCollRatechart());
    dispatch(listCustomer());
  }, []);

  useEffect(() => {
    dispatch(fetchDairyInfo());
    dispatch(maxCenterId(dairy_id));
  }, []);
  

  return (
    <div className="main-home-container wh100 d-flex">
      <div
        className={`sidebar-container ${
          openSidebar ? "open-sidebar " : "close-sidebar"
        }`}>
        <Sidebar setselected={setIsselected} handleSidebar={handleSidebar} />
      </div>
      <div className="nav-main-view-container w80 h1 d-flex-col">
        <div className="header-navs w100 h10 d-flex a-center sb px10 bg6">
          <Header handleSidebar={handleSidebar} />
        </div>
        <div className="main-view-container w100 h90 d-flex">
          <Mainappviews index={isselected} />
        </div>
        {/* <Footer/> */}
      </div>
    </div>
  );
};

export default Mainapp;
