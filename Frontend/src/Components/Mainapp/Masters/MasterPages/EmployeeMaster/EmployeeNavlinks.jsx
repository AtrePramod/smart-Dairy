import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";

const EmployeeNavlinks = ({ isselected, setIsSelected }) => {
  const empNavbuttons = [
    {
      name: "Create Employee",
      icon: <IoPersonAdd className="icon" />,
      index: 0,
    },
    { name: "Employee List", icon: <IoList className="icon" />, index: 1 },
  ];
  return (
    <>
      {empNavbuttons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(index);
          }}>
          <a>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default EmployeeNavlinks;
