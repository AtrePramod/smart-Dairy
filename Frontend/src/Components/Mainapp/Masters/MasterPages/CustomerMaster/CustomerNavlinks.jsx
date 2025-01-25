import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";

const CustomerNavlinks = ({ isselected, setIsSelected }) => {
  const CustNavbuttons = [
    { name: "Customer List", icon: <IoList className="icon" />, index: 0 },
    {
      name: "Create Customer",
      icon: <IoPersonAdd className="icon" />,
      index: 1,
    },
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

export default CustomerNavlinks;
