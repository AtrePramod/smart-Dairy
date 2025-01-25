import { useState } from "react";
import { BsArrowLeft, BsEscape } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetPurchase } from "../../App/Features/Purchase/purchaseSlice"; // Import resetPurchase action
import { useTranslation } from "react-i18next";
import app_text_logo from "../../assets/sm_logo.png";
import "../../Styles/Customer/Customer.css";

const CustNavbar = ({ handleBackButton }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng); // Save selected language in localStorage
  };

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get dispatch function
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  const confirmLogout = async () => {
    try {
      await axios.post("/logout");
      localStorage.removeItem("token");

      // Dispatch the resetPurchase action to clear the purchase data
      dispatch(resetPurchase());

      // Navigate to login or home page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setShowConfirmLogout(false);
    }
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  return (
    <nav className="cust-navbar w100 d-flex a-center sb p10">
      <div className="logo w20 d-flex a-center sb">
        <BsArrowLeft className="back-icon" onClick={handleBackButton} />
        {/* <span className="label-text w20 ">Back</span> */}
      </div>
      <div className="logo-img-div w60 d-flex center">
        <img
          className="w60"
          src={app_text_logo}
          alt="smartdairy"
          width={"120px"}
          height={"30px"}
        />
      </div>

      <div className="logout-btn w20 d-flex j-end mx10">
        <BsEscape className="icon" onClick={handleLogout} />
      </div>

      {/* Conditional rendering of the logout confirmation */}
      {showConfirmLogout && (
        <div className="logout-confirmation">
          <p>Are you sure you want to logout?</p>
          <div className="lc-btn-div w100 d-flex sa">
            <button className="lc-btns btn-y" onClick={confirmLogout}>
              Yes
            </button>
            <button className="lc-btns btn-n" onClick={cancelLogout}>
              No
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustNavbar;
