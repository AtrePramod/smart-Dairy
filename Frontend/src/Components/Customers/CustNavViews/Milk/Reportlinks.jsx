import React from "react";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsEscape,
  BsGridFill,
} from "react-icons/bs";
import "../../../../Styles/Customer/CustNavViews/Milk/Milk.css";
import { useTranslation } from "react-i18next";

const Reportlinks = ({ isselected, setselected }) => {
  const { t } = useTranslation("common");

  const mainnavbuttons = [
    { name: `${t("c-coll-report")}`, icon: <BsGridFill className="icon" /> },
    // { name: `${t("c-mlik-summary")}`, icon: <BsGridFill className="icon" /> },
  ];

  return (
    <>
      {mainnavbuttons.map((button, index) => (
        <li
          key={index}
          className={`sidebar-list-item ${
            isselected === index ? "selected" : ""
          }`}
          onClick={() => {
            setselected(index);
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

export default Reportlinks;
