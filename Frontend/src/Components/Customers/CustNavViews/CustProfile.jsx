import React, { useEffect } from "react";
import "../../../Styles/Customer/CustNavViews/CustProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../../../App/Features/Customers/Profile/profileSlice";
import {
  selectProfileError,
  selectProfileInfo,
  selectProfileStatus,
} from "../../../App/Features/Customers/Profile/ProfileSelector";
import applogo  from "../../../assets/samrtdairylogo.png";
import Spinner from "../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";

const CustProfile = () => {
  const { t } = useTranslation();

  const profile = useSelector((state) => state.profile.profileInfo);
  const status = useSelector(selectProfileStatus);
  const error = useSelector(selectProfileError);


  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cust-profile-container w100 h1 d-flex-col">
      <div className="profile-title-div w100 h10 d-flex p10">
        <h2 className="f-heading mx10">{t("pp-title")}</h2>
      </div>
      {/* <div className="user-info-container w70 mx-15 h90 d-flex-col p10">
        <div className="user-details p10">
          <h2 className="label-text">
            <span className="label-text">{t("p-code")} :</span>
            <span className="heading px10">{profile.srno || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            <span className="label-text">{t("p-name")} :</span>
            <span className="heading px10">{profile.cname || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            <span className="label-text">{t("p-backname")} :</span>
            <span className="heading px10">
              {profile.cust_bankname || "N/A"}
            </span>
          </h2>
          <h2 className="label-text">
            <span className="label-text"> {t("p-bank-acno")} :</span>
            <span className="heading px10">{profile.cust_accno || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            <span className="label-text">{t("p-bank-ifsc")} :</span>
            <span className="heading px10">{profile.cust_ifsc || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            <span className="label-text"> {t("p-farmer-id")} :</span>
            <span className="heading px10">
              {profile.cust_farmerid || "N/A"}
            </span>
          </h2>
          <h2 className="label-text">
            <span className="label-text">{t("p-mobile")} :</span>
            <span className="heading px10">{profile.mobile || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            <span className="label-text">{t("p-adhhar-no")} :</span>
            <span className="heading px10">{profile.cust_addhar || "N/A"}</span>
          </h2>
        </div>
      </div> */}
      <div className="user-profile-page w100 h1 d-flex-col p10">
        <div className="profile-details w100 h80 d-flex-col t-center bg">
          <div className="profile-img-conatiner w100 h25 my10 d-flex center">
            <div className="profile-bg">
              <div className="profile-bg1">
                <img src={applogo} alt="profile img" width={"100px"} />
              </div>
            </div>
          </div>
          <span className="heading py10">{profile.srno || "N/A"}</span>
          <span className="subtitle">
            {profile.cname.toUpperCase() || "N/A"}
          </span>
       
          <div className="other-details-div w100 h80 d-flex-col t-start p10">
            <h2 className="label-text">
              <span className="label-text">{t("p-backname")} :</span>
              <span className="heading px10">
                {profile.cust_bankname || "N/A"}
              </span>
            </h2>
            <h2 className="label-text">
              <span className="label-text"> {t("p-bank-acno")} :</span>
              <span className="heading px10">
                {profile.cust_accno || "N/A"}
              </span>
            </h2>
            <h2 className="label-text">
              <span className="label-text">{t("p-bank-ifsc")} :</span>
              <span className="heading px10">{profile.cust_ifsc || "N/A"}</span>
            </h2>
            <h2 className="label-text">
              <span className="label-text"> {t("p-farmer-id")} :</span>
              <span className="heading px10">
                {profile.cust_farmerid || "N/A"}
              </span>
            </h2>
            <h2 className="label-text">
              <span className="label-text">{t("p-mobile")} :</span>
              <span className="heading px10">{profile.mobile || "N/A"}</span>
            </h2>
            <h2 className="label-text">
              <span className="label-text">{t("p-adhhar-no")} :</span>
              <span className="heading px10">
                {profile.cust_addhar || "N/A"}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustProfile;
