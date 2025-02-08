// eslint-disable-next-line no-unused-vars
import React from "react";
import { IoList } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
const SellRateNavlinks = ({ isselected, setIsSelected }) => {
  const CustNavbuttons = [
    { name: "Product List", icon: <IoList className="icon" />, index: 0 },
  ];
  return (
    <>
      {CustNavbuttons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(index);
          }}
        >
          <a>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default SellRateNavlinks;
