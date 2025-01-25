import React, { useEffect, useState } from "react";
import {
  BsDatabaseAdd,
  BsFileTextFill,
  BsFillFileEarmarkArrowUpFill,
} from "react-icons/bs";
import "../../../Styles/Mainapp/Apphome/Apphome.css";
import { useTranslation } from "react-i18next";

const AppNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const hnavlinks = [
    {
      name: `${t("m-milkcoll")}`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: `${t("m-milkcoll")}`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: [
        "super_admin",
        "admin",
        "manager",
        "milkcollector",
        "mobilecollector",
      ],
    },
    // {
    //   name: "Previous Collection",
    //   icon: <BsPassFill className="icon" />,
    //   index: 2,
    //   role: [
    //     "super_admin",
    //     "admin",
    //     "manager",
    //   ],
    // },
    {
      name: `${t("m-complete-coll")}`,
      icon: <BsFillFileEarmarkArrowUpFill className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "manager", "admin", "manager"],
    },
    // {
    //   name: "Update Collection",
    //   icon: <BsFileEarmarkCodeFill className="icon" />,
    //   index: 3,
    //   role: ["super_admin", "admin", "manager"],
    // },
    // {
    //   name: "Report",
    //   icon: <BsFileTextFill className="icon" />,
    //   index: 5,
    //   role: ["super_admin", "admin", "manager", "milkcollector"],
    // },
    // {
    //   name: "Sales",
    //   icon: <TfiStatsUp className="icon" />,
    //   index: 6,
    //   role: ["super_admin", "admin", "manager"],
    // },
    // {
    //   name: "Payments",
    //   icon: <BsCurrencyRupee className="icon" />,
    //   index: 7,
    //   role: ["super_admin", "admin", "manager"],
    // },
    {
      name: `${t("m-reports")}`,
      icon: <BsFileTextFill className="icon" />,
      index: 4,
      role: [
        "super_admin",
        "admin",
        "manager",
        "milkcollector",
        "mobilecollector",
      ],
    },
    {
      name: `${t("m-reports")}`,
      icon: <BsFileTextFill className="icon" />,
      index: 5,
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

  const filteredNavButtons = filterRoutesByRole(hnavlinks, userRole);

  return (
    <>
      {filteredNavButtons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}>
          <a className="f-label-text">
            <span>{button.icon}</span>
            {button.name}
          </a>
        </li>
      ))}
    </>
  );
};

export default AppNavlinks;
