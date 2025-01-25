import { useState } from "react";
import { Link } from "react-router-dom";
import { BsList, BsXLg, BsEscape } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import "../../Styles/Home/Navigation.css";

const Navigation = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng); // Save selected language in localStorage
  };

  const [openNavbar, setOpenNavbar] = useState(false);

  const showNavbar = () => {
    setOpenNavbar(!openNavbar);
  };

  return (
    <nav className="navbar w100 d-flex sb p10">
      <div className="logo w20">
        <span className="logo-text">SMARTDAIRY</span>
      </div>
      <div className={`${openNavbar ? "open" : "close"}`}>
        <div className={`navlinks w80 d-flex`}>
          <BsXLg className="menu-btn close-btn" onClick={showNavbar} />
          <Link onClick={showNavbar} to={"#"}>
            Home
          </Link>
          <Link onClick={showNavbar} to={"#"}>
            About
          </Link>
          <Link onClick={showNavbar} to={"#"}>
            Pricing
          </Link>
          <Link onClick={showNavbar} to={"#"}>
            Contact
          </Link>
        </div>
      </div>
      <div className="logout-btn w40 d-flex sb">
        <select
          className="lang-selector-btn"
          onChange={(e) => handleLanguageChange(e.target.value)}>
          <option className="opts" value="mr">
            मराठी
          </option>
          <option className="opts" value="en">
            English
          </option>
        </select>
      </div>
      <BsList className="menu-btn open-btn" onClick={showNavbar} />
    </nav>
  );
};

export default Navigation;
