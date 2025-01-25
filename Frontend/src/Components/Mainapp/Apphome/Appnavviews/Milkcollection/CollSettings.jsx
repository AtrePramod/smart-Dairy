import { useState } from "react";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/collsetting.css";
import { saveMilkCollSetting } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const CollSettings = ({ switchToColl }) => {
  const dispatch = useDispatch();

  const { status, error } = useSelector((state) => state.milkCollection);

  // Initialize state for form inputs
  const [formData, setFormData] = useState({
    milkType: 0,
    prevFat: 0,
    prevSnf: 0,
    prevDeg: 0,
    manLiters: 0,
    manFat: 0,
    manSnf: 0,
    manDeg: 0,
    sms: 0,
    print: 0,
  });

  // Handle change in radio/checkbox inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Update the state based on input type
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSettings = async (e) => {
    e.preventDefault();
    await dispatch(saveMilkCollSetting(formData));
    toast.success("Milk Collection setting Saved Successfully!");
    switchToColl();
  };

  return (
    <div className="milk-col-form w100 h1 d-flex-col bg p10">
      <div className="setting-btn-switch w100 h10 d-flex a-center sb">
        <span className="heading">Milk Collection Settings:</span>
      </div>
      <form
        onSubmit={handleSettings}
        className="collection-settings-form-div w100 h90 d-flex-col sa">
        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading h50">Select Milk Collection Period</span>
          <div className="col-inputs-div w50 h50 d-flex sb">
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input
                className="w20"
                type="radio"
                name="milkType"
                value="0"
                // checked={formData.milkType === "0"}
                onChange={handleInputChange}
              />
              <span className="info-text w70">Cow</span>
            </div>
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input
                className="w20"
                type="radio"
                name="milkType"
                value="1"
                // checked={formData.milkType === "1"}
                onChange={handleInputChange}
              />
              <span className="info-text w70">Buffalo</span>
            </div>
          </div>
        </div>

        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading">Use Previous Information</span>
          <div className="col-inputs-div w60 h50 d-flex sb">
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="prevFat"
                checked={formData.prevFat === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70 a-center">FAT</span>
            </div>
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="prevSnf"
                checked={formData.prevSnf === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70 a-center">SNF</span>
            </div>
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="prevDeg"
                checked={formData.prevDeg === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70 a-center">Degree</span>
            </div>
          </div>
        </div>

        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading">Fill Information Manually</span>
          <div className="col-inputs-div w60 h50 d-flex sb">
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="manLiters"
                checked={formData.manLiters === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70">Liters</span>
            </div>
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="manFat"
                checked={formData.manFat === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70">FAT</span>
            </div>
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="manSnf"
                checked={formData.manSnf === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70">SNF</span>
            </div>
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="manDeg"
                checked={formData.manDeg === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70">Degree</span>
            </div>
          </div>
        </div>

        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading h50">SMS and Print Setting:</span>
          <div className="col-inputs-div w50 h50 d-flex sb">
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="sms"
                checked={formData.sms === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70">SMS</span>
            </div>
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="print"
                checked={formData.print === 1}
                onChange={handleInputChange}
              />
              <span className="info-text w70">Print</span>
            </div>
          </div>
        </div>

        <div className="button-container w100 h20 d-flex j-end">
          <button type="submit" className="btn f-btn info-text mx10">
            Save & Start Collection
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollSettings;
