import React from "react";
import { IoList } from "react-icons/io5";
import { BsBuildingAdd } from "react-icons/bs";

const CenterNavlinks = ({ isselected, setIsSelected }) => {
  const centerNavs = [
    { name: "Center List", icon: <IoList className="icon" />, index: 0 },
    {
      name: "Create Center",
      icon: <BsBuildingAdd className="icon" />,
      index: 1,
    },
  ];
  return (
    <>
      {centerNavs.map((button, index) => (
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

export default CenterNavlinks;
