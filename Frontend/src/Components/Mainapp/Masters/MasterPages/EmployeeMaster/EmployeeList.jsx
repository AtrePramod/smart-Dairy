import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listEmployee } from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import "../../../../../Styles/Common.css";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const Emplist = useSelector((state) => state.emp.emplist);

  useEffect(() => {
    dispatch(listEmployee());
  }, []);

  return (
    <div className="emp-list-container w70 h90 d-flex-col">
      <div className="title-div w100 h10 d-flex px10">
        <span className="heading w100 t-center">Employee List</span>
      </div>
      <div className="emp-data-list-container w100 h1 d-flex-col bg">
        <div className="data-heading-div w100 h10 d-flex a-center t-center sb bg2">
          <span className="label-text w10">No</span>
          <span className="label-text w30">Employee Name</span>
          <span className="label-text w20">Designation</span>
          <span className="label-text w15">Mobile</span>
          <span className="label-text w20">Salary</span>
        </div>
        <div className="emp-data-list-div w100 h90 mh90 d-flex-col hidescrollbar">
          {Emplist.map((emp, i) => (
            <div
              className={`emp-data-div w100 h10 d-flex a-center t-center sb ${
                i % 2 === 0 ? "bg-light" : "bg-dark"
              }`}
              style={{
                backgroundColor: i % 2 === 0 ? "#faefe3" : "#fff",
              }}>
              <span className="text w10">{emp.emp_id}</span>
              <span className="text w30">{emp.emp_name}</span>
              <span className="text w20">{emp.designation}</span>
              <span className="text w15">{emp.emp_mobile}</span>
              <span className="text w20">{emp.salary}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
