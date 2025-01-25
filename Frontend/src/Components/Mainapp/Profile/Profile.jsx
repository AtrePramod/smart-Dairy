import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../../../App/Features/Mainapp/Profile/ProfileSlice";
import "../../../Styles/Mainapp/Profile/Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.userinfo.profile);
  useEffect(() => {
    dispatch(getProfileInfo());
  }, [dispatch]);
  return (
    <div className="user-profile-container w100 h1 d-flex-col center sb p10">
      <div className="user-details-container w50 d-flex-col a-center bg p10 m10">
        <span className="heading t-center w100 my10">My Profile</span>
        <div className="details-container w100 h10 d-flex a-center sb py10">
          <span className="info-text w30">Username :</span>
          <span className="label-text w70">{profile.emp_name}</span>
        </div>
        <div className="details-container w100 h10 d-flex a-center sb py10">
          <span className="info-text w30">Designation :</span>
          <span className="label-text w70">{profile.designation}</span>
        </div>
        <div className="details-container w100 h10 d-flex a-center sb py10">
          <span className="info-text w30">Mobile :</span>
          <span className="label-text w70">{profile.emp_mobile}</span>
        </div>
        <div className="details-container w100 h10 d-flex sb py10">
          <span className="info-text w30">Address :</span>
          <span className="label-text w70">{`${profile.emp_city}, tal: ${profile.emp_tal}, dist: ${profile.emp_dist}`}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
