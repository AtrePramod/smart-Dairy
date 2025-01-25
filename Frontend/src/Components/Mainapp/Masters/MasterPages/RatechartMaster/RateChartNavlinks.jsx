import React from "react";
import { BsSaveFill } from "react-icons/bs";
import { VscSave } from "react-icons/vsc";
import { CiSaveUp1 } from "react-icons/ci";
import { GrUpdate } from "react-icons/gr";

const RateChartNavlinks = ({ isselected, setIsSelected }) => {
  const ratechartnavlinks = [
    {
      name: "Save",
      icon: <VscSave className="icon" />,
      index: 0,
    },
    {
      name: "Update",
      icon: <GrUpdate className="icon" />,
      index: 1,
    },
    {
      name: "Apply",
      icon: <BsSaveFill className="icon" />,
      index: 2,
    },
  ];
  return (
    <>
      {ratechartnavlinks.map((button, index) => (
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

export default RateChartNavlinks;
