import React, { useEffect, useState } from "react";
import CenterNavlinks from "./CenterNavlinks";
import CenterNavViews from "./CenterNavViews";
import { useDispatch, useSelector } from "react-redux";
import { maxCenterId } from "../../../../App/Features/Dairy/Center/centerSlice";

const Centers = () => {
  const dispatch = useDispatch();
  const dairy_id = useSelector((state) => state.dairy.dairyData.SocietyCode);

  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedcenternavIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedcenternavIndex", isselected);
  }, [isselected]);

  useEffect(() => {
    localStorage.setItem("selectedcenternavindex", isselected);
  }, [isselected]);

  useEffect(() => {
    dispatch(maxCenterId(dairy_id));
  }, []);

  return (
    <div className="center-container w100 h1 d-flex-col">
      <div className="center-navigation w100 h10 d-flex bg3">
        <CenterNavlinks isselected={isselected} setIsSelected={setIsSelected} />
      </div>
      <div className="center-views w100 h90 d-flex center">
        <CenterNavViews index={isselected} />
      </div>
    </div>
  );
};

export default Centers;
