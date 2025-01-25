import React, { useEffect, useState } from "react";
import { TbMilk } from "react-icons/tb";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsGridFill,
  BsCaretUpFill,
  BsCaretDownFill,
  BsBuildingFillGear,
  BsHouseGearFill,
} from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import {
  FaGears,
  FaFileLines,
  FaFileContract,
  FaFileInvoice,
  FaFileInvoiceDollar,
} from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { GrNotes, GrOrganization } from "react-icons/gr";
import "../../Styles/Mainapp/Mainapphome.css";

const Mainappnavlinks = ({ setselected, handleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const mainnavbuttons = [
    {
      name: "Dashboard",
      icon: <BsGridFill className="icon" />,
      index: 0,
      role: ["admin", "super_admin", "manager"],
    },
    {
      name: "Milk",
      icon: <TbMilk className="icon" />,
      index: 1,
      role: [
        "admin",
        "super_admin",
        "manager",
        "milkcollector",
        "mobilecollector",
      ],
    },
    {
      name: "Inventory",
      icon: <BsHouseFill className="icon" />,
      index: 2,
      role: ["admin", "super_admin", "manager", "salesman"],
      submenus: [
        {
          name: "Dealers ",
          icon: <BsGridFill className="icon" />,
          index: 2.1,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Product List",
          icon: <BsGridFill className="icon" />,
          index: 2.2,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Starting Stock",
          icon: <BsGridFill className="icon" />,
          index: 2.3,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Expired Products",
          icon: <BsGridFill className="icon" />,
          index: 2.4,
          role: [
            "admin",
            "super_admin",
            "manager",
            "milkcollector",
            "mobilecollector",
          ],
        },
        {
          name: "Customer Returns",
          icon: <BsGridFill className="icon" />,
          index: 2.5,
          role: [
            "admin",
            "super_admin",
            "manager",
            "milkcollector",
            "mobilecollector",
          ],
        },
        {
          name: "Dealers Returns",
          icon: <BsGridFill className="icon" />,
          index: 2.6,
          role: [
            "admin",
            "super_admin",
            "manager",
            "milkcollector",
            "mobilecollector",
          ],
        },
        {
          name: "Update Sells Rate",
          icon: <BsGridFill className="icon" />,
          index: 2.7,
          role: [
            "admin",
            "super_admin",
            "manager",
            "milkcollector",
            "mobilecollector",
          ],
        },
      ],
    },
    {
      name: "Accounts",
      icon: <GrNotes className="icon" />,
      index: 3,
      role: ["admin", "super_admin", "manager", "salesman"],
    },
    {
      name: "Masters",
      icon: <TbMilk className="icon" />,
      index: 4,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Main Ledger",
          icon: <BsGridFill className="icon" />,
          index: 4.1,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Sub Ledger",
          icon: <BsGridFill className="icon" />,
          index: 4.2,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Customer Master",
          icon: <BsGridFill className="icon" />,
          index: 4.3,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Employee Master",
          icon: <BsGridFill className="icon" />,
          index: 4.4,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Rate Master",
          icon: <BsGridFill className="icon" />,
          index: 4.5,
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Sales",
      icon: <TbMilk className="icon" />,
      index: 5,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Cattle Feed",
          icon: <BsGridFill className="icon" />,
          index: 5.1,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Medicines",
          icon: <BsGridFill className="icon" />,
          index: 5.2,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Grocery",
          icon: <BsGridFill className="icon" />,
          index: 5.3,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Others",
          icon: <BsGridFill className="icon" />,
          index: 5.4,
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Purchase ",
      icon: <TbMilk className="icon" />,
      index: 6,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Cattle Feed",
          icon: <BsGridFill className="icon" />,
          index: 6.1,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Medicines",
          icon: <BsGridFill className="icon" />,
          index: 6.2,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Grocery",
          icon: <BsGridFill className="icon" />,
          index: 6.3,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Others",
          icon: <BsGridFill className="icon" />,
          index: 6.4,
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Reports",
      icon: <TbMilk className="icon" />,
      index: 7,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Center Reports",
          icon: <FaFileLines className="icon" />,
          index: 7.1,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Reports",
          icon: <FaFileContract className="icon" />,
          index: 7.2,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Customer Reports",
          icon: <FaFileLines className="icon" />,
          index: 7.3,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Employee Reports",
          icon: <FaFileLines className="icon" />,
          index: 7.4,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Inventory Reports",
          icon: <FaFileInvoice className="icon" />,
          index: 7.5,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Sales Reports",
          icon: <FaFileInvoice className="icon" />,
          index: 7.6,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Payment Reports",
          icon: <FaFileInvoiceDollar className="icon" />,
          index: 7.7,
          role: ["admin", "super_admin", "manager"],
        },
        // {
        //   name: "Milk Rate Master",
        //   icon: <BsGridFill className="icon" />,
        //   index: 6.5,
        //   role: ["admin", "super_admin", "manager"],
        // },
      ],
    },
    {
      name: "Payments",
      icon: <TbMilk className="icon" />,
      index: 8,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Main Ledger",
          icon: <BsGridFill className="icon" />,
          index: 8.1,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Sub Ledger",
          icon: <BsGridFill className="icon" />,
          index: 8.2,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Customer Master",
          icon: <BsGridFill className="icon" />,
          index: 7.3,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Employee Master",
          icon: <BsGridFill className="icon" />,
          index: 8.4,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Rate Master",
          icon: <BsGridFill className="icon" />,
          index: 8.5,
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Dairy",
      icon: <BsCoin className="icon" />,
      index: 9,
      role: ["admin", "super_admin", "manager"],
      submenus: [
        {
          name: "Dairy Information",
          icon: <GrOrganization className="icon" />,
          index: 9.1,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Initial Information",
          icon: <BsGridFill className="icon" />,
          index: 9.2,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Create New Center",
          icon: <BsGridFill className="icon" />,
          index: 9.3,
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Settings",
      icon: <BsGearFill className="icon" />,
      index: 10,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Dairy Settings",
          icon: <BsBuildingFillGear className="icon" />,
          index: 10.1,
          role: ["super_admin", "admin", "manager"],
        },
        {
          name: "Inventory Settings",
          icon: <BsHouseGearFill className="icon" />,
          index: 10.2,
          role: ["super_admin", "admin", "manager"],
        },
        {
          name: "Machine Settings",
          icon: <FaGears className="icon" />,
          index: 10.3,
          role: ["super_admin", "admin", "manager"],
        },
      ],
    },
    {
      name: "My Profile",
      icon: <FaUserCircle className="icon" />,
      index: 11,
      role: ["admin", "milkcollector", "mobilecollector"],
    },
  ];

  const filterRoutesByRole = (routes, userRole) => {
    return routes
      .filter(
        (route) => route.role.includes(userRole) // Only return the routes for which the user's role is allowed
      )
      .map((route) => {
        if (route.submenus) {
          // If the route has submenus, filter them based on the user's role too
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

  const filteredNavButtons = filterRoutesByRole(mainnavbuttons, userRole);

  const handleMainClick = (button) => {
    if (button.submenus) {
      setActiveMenu(activeMenu === button.index ? null : button.index);
    } else {
      setselected(button.index);
      handleSidebar();
      setActiveMenu(null);
    }
  };

  const handleSubmenuClick = (submenu) => {
    setselected(submenu.index);
    handleSidebar();
    setActiveMenu(null);
  };

  return (
    <ul className="sidenav-btns">
      {filteredNavButtons.map((button) => (
        <li key={button.index} className="main-navs py5">
          <div
            className="nav-link w90 d-flex"
            onClick={() => handleMainClick(button)}
          >
            <div className="nav-main w70">
              {button.icon}
              <span className="main-nav-text px5 f-heading">{button.name}</span>
            </div>
            {button.submenus && (
              <span className="submenu-arrow w10">
                {activeMenu === button.index ? (
                  <BsCaretUpFill />
                ) : (
                  <BsCaretDownFill />
                )}
              </span>
            )}
          </div>
          {button.submenus && activeMenu === button.index && (
            <ul className="submenu w100 d-flex-col j-end">
              {button.submenus.map((submenu) => (
                <li
                  key={submenu.index}
                  className="submenu-item"
                  onClick={() => handleSubmenuClick(submenu)}
                >
                  {submenu.icon}{" "}
                  <span className="submenu-text px10">{submenu.name}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Mainappnavlinks;
