import React from "react";
import {
  BsCurrencyRupee,
  BsDatabaseAdd,
  BsFileTextFill,
  BsSaveFill,
  BsFileEarmarkCodeFill,
} from "react-icons/bs";

const ReportNavlinks = ({ isselected, setIsSelected }) => {
  const ReportNavlinks = [
    {
      name: "Todays Milk Report",
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Mobile Collection",
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "manager", ,],
    },
  ];

  return (
    <>
      {ReportNavlinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
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

export default ReportNavlinks;
