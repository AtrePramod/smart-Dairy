import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BsCalendar3 } from "react-icons/bs";
import { generateMaster } from "../../../../../App/Features/Customers/Date/masterdateSlice";
import { getDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";

const UpdateCollection = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);

  // Generate master dates based on the initial date
  useEffect(() => {
    dispatch(generateMaster(date));
  }, []);

  // Handle the date selection
  const handleSelectChange = async (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      dispatch(
        getDeductionInfo({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  return (
    <div className="update-milk-collection-form-div w100 h1 d-flex-col sb">
      <span className="heading h10">Update Collection</span>
      <div className="custmize-report-div w30 h10 px10 d-flex a-center sb">
        <span className="cl-icon w10 h1 d-flex center">
          <BsCalendar3 />
        </span>
        <select
          className="custom-select sub-heading w80 h1 p10"
          onChange={handleSelectChange}>
          <option className="sub-heading w100 d-flex">
            --{t("c-select-master")}--
          </option>
          {manualMaster.map((dates, index) => (
            <option
              className="sub-heading w100 d-flex sa"
              key={index}
              value={index}>
              {new Date(dates.start).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short", // Abbreviated month format
                year: "numeric",
              })}
              To :
              {new Date(dates.end).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short", // Abbreviated month format
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="update-milk-main-container w100 h90 d-flex sb ">
        <div className="update-milk-container w80 h1 d-flex sa">
          <div className="perticuler-days-milk-collection-table-div w45 h1 d-flex-col bg">
            <span className="heading p10">Morning Collection</span>
            <div className="perticuler-milk-collection-sub-div w100 h10 d-flex a-center bg1 sa">
              <th className="w10 info-text">Edit</th>
              <th className="w20 info-text">Date</th>
              <th className="w10 info-text">Liters</th>
              <th className="w10 info-text">Fat </th>
              <th className="w10 info-text">SNF</th>
              <th className="w15 info-text">Rate/Liter</th>
              <th className="w15 info-text">Amount</th>
            </div>
            <div className="perticuler-milk-collection-div-table-data-div w100 h90 mh90 hidescrollbar d-flex-col">
              <div className="perticuler-milk-collection-sub-div w100 h10 d-flex sa">
                <td className="w10 text">0</td>
                <td className="w20 text">name</td>
                <td className="w10 text">10</td>
                <td className="w10 text">3.5</td>
                <td className="w10 text">8.5</td>
                <td className="w15 text">30</td>
                <td className="w15 text">300</td>
              </div>
            </div>
          </div>
          <div className="perticuler-days-milk-collection-table-div w45 h1 d-flex-col bg">
            <span className="heading p10">Eveing Collection</span>
            <div className="perticuler-milk-collection-sub-div w100 h10 d-flex a-center bg1 sa">
              <th className="w10 info-text">Edit</th>
              <th className="w20 info-text">Date</th>
              <th className="w10 info-text">Liters</th>
              <th className="w10 info-text">Fat </th>
              <th className="w10 info-text">SNF</th>
              <th className="w15 info-text">Rate/Liter</th>
              <th className="w15 info-text">Amount</th>
            </div>
            <div className="perticuler-milk-collection-div-table-data-div w100 h90 mh90 hidescrollbar d-flex-col">
              <div className="perticuler-milk-collection-sub-div w100 h10 d-flex sa">
                <td className="w10 text">0</td>
                <td className="w20 text">name</td>
                <td className="w10 text">10</td>
                <td className="w10 text">3.5</td>
                <td className="w10 text">8.5</td>
                <td className="w15 text">30</td>
                <td className="w15 text">300</td>
              </div>
            </div>
          </div>
          {/* <div className="perticuler-days-milk-collection-table-div w50 h1 d-flex-col br">
            <div className="perticuler-milk-collection-sub-div w100 h10 d-flex sa">
              <th className="w10 info-text">No</th>
              <th className="w40 info-text">Name</th>
              <th className="w10 info-text">Liters</th>
              <th className="w5 info-text">Fat </th>
              <th className="w5 info-text">SNF</th>
              <th className="w10 info-text">Rate/Liter</th>
              <th className="w15 info-text">Amount</th>
            </div>
            <div className="perticuler-milk-collection-div-table-data-div w100 h90 mh90 hidescrollbar d-flex-col">
              <div className="perticuler-milk-collection-sub-div w100 h10 d-flex sa">
                <td className="w10 text">0</td>
                <td className="w40 text">name</td>
                <td className="w10 text">10</td>
                <td className="w5 text">3.5</td>
                <td className="w5 text">8.5</td>
                <td className="w10 text">30</td>
                <td className="w15 text">300</td>
              </div>
            </div>
          </div> */}
        </div>
        <div className="update-options-container w20 h1 d-flex-col a-center bg4">
          <button className="btn my10">Transfer To Morning</button>
          <button className="btn my10">Transfer To Evening</button>
          <button className="btn my10">Delete To Morning</button>
          <button className="btn my10">Delete To Evening</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCollection;
