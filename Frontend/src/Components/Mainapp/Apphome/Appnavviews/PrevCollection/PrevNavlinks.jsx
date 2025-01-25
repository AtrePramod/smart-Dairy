import React, { useEffect, useState } from "react";
import { BsCurrencyRupee, BsDatabaseAdd, BsFileTextFill } from "react-icons/bs";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/PrevMilkCollection.css";

const PrevNavlinks = ({ isselected, setIsSelected }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const prevCollectionlinks = [
    {
      name: "Complete Collection",
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Show Collection",
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Upload Collection",
      icon: <BsDatabaseAdd className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "manager"],
    },
  ];

  const filterRoutesByRole = (routes, userRole) => {
    return routes
      .filter((route) => route.role.includes(userRole))
      .map((route) => {
        if (route.submenus) {
          return {
            ...route,
            submenus: route.submenus.filter((submenu) =>
              submenu.role.includes(userRole)
            ),
          };
        }
        return route;
      });
  };

  const filteredNavButtons = filterRoutesByRole(prevCollectionlinks, userRole);

  return (
    <>
      {filteredNavButtons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "active-nav" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}>
          <a>
            <span className="nav-icons"> {button.icon}</span>
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default PrevNavlinks;
