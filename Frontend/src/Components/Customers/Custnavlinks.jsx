import React, { useEffect } from "react";
import {
  BsCurrencyRupee,
  BsGridFill,
  BsPersonCircle,
  BsBriefcaseFill,
} from "react-icons/bs";
import { FaFillDrip } from "react-icons/fa";
import { BiCut } from "react-icons/bi";
import { GiFertilizerBag, GiCow } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";
import { generateMaster } from "../../App/Features/Customers/Date/masterdateSlice";
import { getMasterDates } from "../../App/Features/Customers/Date/masterSlice";
import { useTranslation } from "react-i18next";
import "../../Styles/Customer/Customer.css";
import { getProfileInfo } from "../../App/Features/Customers/Profile/profileSlice";

const Custnavlinks = ({ setselected }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.profile.profileInfo.cname);
  const dairyname = useSelector((state) => state.dairy.dairyData.SocietyName);
  const date = useSelector((state) => state.date.toDate);
  const yearStart = useSelector((state) => state.date.yearStart);
  const yearEnd = useSelector((state) => state.date.yearEnd);

  useEffect(() => {
    dispatch(getProfileInfo());
    dispatch(fetchDairyInfo());
    dispatch(generateMaster(date));
    if (yearStart && yearEnd) {
      dispatch(getMasterDates({ yearStart, yearEnd }));
    }
  }, [dispatch]);

  const mainnavbuttons = [
    { name: "navbar", icon: <BsGridFill className="icon" /> },
    { name: `${t("nv-milk-coll")}`, icon: <FaFillDrip className="icon" /> },
    { name: `${t("nv-pay")}`, icon: <BsCurrencyRupee className="icon" /> },
    {
      name: `${t("nv-cattel-feed")}`,
      icon: <GiFertilizerBag className="icon" />,
    },
    { name: `${t("nv-deduction")}`, icon: <BiCut className="icon" /> },
    { name: `${t("nv-animal")}`, icon: <GiCow className="icon" /> },
    { name: `${t("nv-profile")}`, icon: <BsPersonCircle className="icon" /> },
    { name: `${t("nv-dash")}`, icon: <BsGridFill className="icon" /> },
  ];

  return (
    <div className="main-menu-container w100 h1 d-flex-col">
      <div className="center-selection-div w100 h20 d-flex-col p10">
        <span className="dairyname w100 h40">{username}</span>
        <div className="select-div w100 h40 d-flex a-center sb">
          <span className="icons w10 px10">
            <BsBriefcaseFill />
          </span>
          <select disabled className="centers w80 h1 d-flex center">
            <option value="">{dairyname}</option>
          </select>
        </div>
      </div>
      <div className="nav-menu-container w100 h50 d-flex center f-wrap">
        {mainnavbuttons.map(
          (button, index) =>
            index !== 0 && (
              <div
                key={index}
                className="menu-icon-btn w25 h30 d-flex-col center mx10"
                onClick={() => {
                  setselected(index);
                }}>
                <div className="icon-div w100 h70 d-flex center">
                  {button.icon}
                </div>
                <div className="menu-text-div w100 h30 d-flex center">
                  <span className="sub-heading">{button.name}</span>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Custnavlinks;
