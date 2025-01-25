import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import EmployeeNavlinks from "./EmployeeNavlinks";
import EmployeeNavViews from "./EmployeeNavViews";
import "../../../../../Styles/Mainapp/Masters/EmpMaster.css";

const EmployeeMaster = () => {
  const dispatch = useDispatch();
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedEmpNavIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedEmpNavIndex", isselected);
  }, [isselected]);

  useEffect(() => {
    localStorage.setItem("selectedEmpNavIndex", isselected);
  }, [isselected]);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="Employee-master-navigation w100 h10 d-flex bg3">
        <EmployeeNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="Employee-views w100 h90 d-flex center">
        <EmployeeNavViews index={isselected} />
      </div>
    </div>
  );
};

export default EmployeeMaster;
