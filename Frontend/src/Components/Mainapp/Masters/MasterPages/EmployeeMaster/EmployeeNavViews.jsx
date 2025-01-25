import React from "react";
import CreateEmployee from "./CreateEmployee";
import EmployeeList from "./EmployeeList";

const EmployeeNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <CreateEmployee />;
      break;
    case 1:
      return <EmployeeList />;
      break;

    default:
      break;
  }
};

export default EmployeeNavViews;
