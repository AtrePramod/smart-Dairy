import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../../../Styles/Mainapp/Dairy/Center.css";
import {
  createCenter,
  maxCenterId,
} from "../../../../App/Features/Dairy/Center/centerSlice";
import { toast } from "react-toastify";

const CreateCenter = ({ selectedCenter }) => {
  const dispatch = useDispatch();
  const dairy_id = useSelector((state) => state.dairy.dairyData.SocietyCode);
  const centerId = useSelector((state) => state.center.maxId.centerId);

  // Fetch max center ID when component mounts
  useEffect(() => {
    dispatch(maxCenterId(dairy_id));
  }, [dairy_id, dispatch]);


  // Local state to manage form input and mode (create/update)
  const [formData, setFormData] = useState({
    marathi_name: "",
    center_name: "",
    reg_no: "",
    reg_date: "",
    center_id: centerId,
    auditclass: "",
    mobile: "",
    email: "",
    city: "",
    tehsil: "",
    district: "",
    pincode: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Populate form with selected center data when in edit mode
  useEffect(() => {
    if (selectedCenter) {
      setFormData(selectedCenter);
      setIsEditMode(true);
    } else {
      resetForm();
    }
  }, [selectedCenter]);

  // Update center_id when fetched from Redux during create mode
  useEffect(() => {
    if (!isEditMode) {
      setFormData((prevData) => ({
        ...prevData,
        center_id: centerId || "",
      }));
    }
  }, [centerId, isEditMode]);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      marathi_name: "",
      center_name: "",
      reg_no: "",
      reg_date: "",
      center_id: centerId || "",
      auditclass: "",
      mobile: "",
      email: "",
      city: "",
      tehsil: "",
      district: "",
      pincode: "",
    });
    setIsEditMode(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for both create and update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // dispatch(updateCenterDetails(formData)); // Uncomment when updating functionality is implemented
    } else {
      dispatch(createCenter(formData)).then(() => {
        // After successfully creating the center, fetch the new maxCenterId
        dispatch(maxCenterId(dairy_id));
        toast.success("Center created successfully!");
      });
    }
    resetForm();
  };

  return (
    <div className="center-main-container w100 h1 d-flex center">
      <form
        className="center-information-div w50 h80 d-flex-col sa bg p10"
        onSubmit={handleSubmit}>
        <span className="heading h10">
          {isEditMode ? "Update Dairy Center" : "Create New Dairy Center"}
        </span>
        <div className="center-name-div w100 h15 d-flex-col sa">
          <span className="label-text w100 ">Marathi Name</span>
          <input
            className="data w100 "
            type="text"
            name="marathi_name"
            placeholder="सेंटरचे नाव"
            value={formData.marathi_name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="center-name-div w100 h15 d-flex-col sa">
          <span className="label-text w100 ">English Name</span>
          <input
            className="data w100 "
            type="text"
            name="center_name"
            placeholder="Center Name"
            value={formData.center_name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="center-add-data-div w100 h15 d-flex a-center sb">
          <div className="center-details-div w20 d-flex-col sa">
            <span className="label-text w100 ">Center Number</span>
            <input
              className="data w100"
              type="number"
              name="center_id"
              value={formData.center_id}
              onChange={handleChange}
              disabled
              required
            />
          </div>
          <div className="center-details-div w20 d-flex-col sa">
            <span className="label-text w100 ">Audit Class</span>
            <input
              className="data w100"
              type="text"
              name="auditclass"
              value={formData.auditclass || ""}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div w20 d-flex-col sa">
            <span className="label-text w100 ">Register Number</span>
            <input
              className="data w100"
              type="number"
              name="reg_no"
              value={formData.reg_no || ""}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div w30 d-flex-col sa">
            <span className="label-text w100 ">Register Date</span>
            <input
              className="data w100"
              type="date"
              name="reg_date"
              value={formData.reg_date || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="center-data-div w100 h15 d-flex a-center sb">
          <div className="center-div w20 d-flex-col">
            <span className="label-text w100 ">Mobile</span>
            <input
              className="data w100 "
              type="tel"
              name="mobile"
              value={formData.mobile || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="center-div w50 d-flex-col">
            <span className="label-text w100 ">Email</span>
            <input
              className="data w100 "
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="center-div w25 d-flex-col">
            <span className="label-text w100 ">City</span>
            <input
              className="data w100"
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="center-data-div w100 h15 d-flex sb">
          <div className="center-div w30 d-flex-col">
            <span className="label-text w100 ">Tehsil</span>
            <input
              className="data w100 "
              type="text"
              name="tehsil"
              value={formData.tehsil || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="center-div w30 d-flex-col">
            <span className="label-text w100 ">District</span>
            <input
              className="data w100"
              type="text"
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="center-div w30 d-flex-col">
            <span className="label-text w100 ">Pincode</span>
            <input
              className="data w100 "
              type="text"
              name="pincode"
              value={formData.pincode || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="btn-div w100 h10 d-flex j-end px10 my5">
          <button type="button" className="w-btn mx10" onClick={resetForm}>
            Reset
          </button>
          {isEditMode ? (
            <button type="submit" className="w-btn" disabled>
              Update
            </button>
          ) : (
            <button type="submit" className="w-btn">
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCenter;
