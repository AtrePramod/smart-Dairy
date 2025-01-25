import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsJustify } from "react-icons/bs";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";

import "../../Styles/Mainapp/Mainapphome.css";

const Header = ({ handleSidebar, logout }) => {
  const dispatch = useDispatch();

  const toDate = useSelector((state) => state.date.toDate);
  
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );

  useEffect(() => {
    dispatch(fetchDairyInfo());
  }, []);

  return (
    <>
      <div className="menu-header w10 d-flex a-center ">
        <BsJustify className="menu-icon w100 c1" onClick={handleSidebar} />
      </div>
      <div className="dairy-name w90 d-flex a-center sb">
        <span className="title w80 px10">{dairyname}</span>
        <span className="label-text w20 d-flex j-center">{toDate}</span>
      </div>
    </>
  );
};

export default Header;
