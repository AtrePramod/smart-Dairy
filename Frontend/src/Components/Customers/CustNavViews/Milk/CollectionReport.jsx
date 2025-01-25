// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getMasterReports } from "../../../../App/Features/Customers/Milk/milkMasterSlice";
// import Spinner from "../../../Home/Spinner/Spinner";
// import { BsCalendar3 } from "react-icons/bs";
// import { useTranslation } from "react-i18next";
// import "../../../../Styles/Customer/CustNavViews/Milk/Milk.css";
// // import { generateMaster } from "../../../../App/Features/Customers/Date/masterdateSlice";
// 
// const CollectionReport = () => {
//   const { t } = useTranslation("common");
//   const dispatch = useDispatch();
//   const records = useSelector((state) => state.mMilk.mrecords);
//   const summary = useSelector((state) => state.mMilk.msummary);
//   const status = useSelector((state) => state.mMilk.status);
//   const manualMaster = useSelector((state) => state.manualMasters.masterlist);
//   const fDate = useSelector((state) => state.date.formDate);
//   const tDate = useSelector((state) => state.date.toDate);
// 
//   const [setectedDate, setSelectedDate] = useState(null);
// 
//   const handleSelectChange = async (e) => {
//     const selectedIndex = e.target.value;
//     if (selectedIndex !== "") {
//       const selectedDates = manualMaster[selectedIndex];
// 
//       await setSelectedDate(selectedDates);
//       // Dispatch the action with the selected fromDate and toDate
//       await dispatch(
//         getMasterReports({
//           fromDate: selectedDates.start,
//           toDate: selectedDates.end,
//         })
//       );
//     }
//   };
// 
//   const safeToFixed = (value, decimals = 2) => {
//     return value !== null && value !== undefined
//       ? value.toFixed(decimals)
//       : "0.00";
//   };
//   return (
//     <div className="coll-report-container w100 h1 d-flex-col bg">
//       <div className="menu-title-div w100 h10 d-flex a-center sb p10">
//         <h2 className="heading"> {t("c-coll-report")}</h2>
//         {setectedDate !== null ? (
//           <h2 className="label-text px10">
//             <span className="info-text">
//               {new Date(setectedDate.start).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short", // Abbreviated month format
//                 year: "numeric",
//               })}
//             </span>
//             <span> To : </span>
//             <span className="info-text">
//               {new Date(setectedDate.end).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short", // Abbreviated month format
//                 year: "numeric",
//               })}
//             </span>
//           </h2>
//         ) : (
//           <span></span>
//         )}
//       </div>
//       <div className="custmize-report-div w100 h10 px10 d-flex a-center sb">
//         <span className="cl-icon w10 h1 d-flex center">
//           <BsCalendar3 />
//         </span>
//         <select
//           className="custom-select sub-heading w80 h1 p10"
//           onChange={handleSelectChange}>
//           <option className="sub-heading w100 d-flex">
//             --{t("c-select-master")}--
//           </option>
//           {manualMaster.map((dates, index) => (
//             <option
//               className="sub-heading w100 d-flex sa"
//               key={index}
//               value={index}>
//               {new Date(dates.start).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short", // Abbreviated month format
//                 year: "numeric",
//               })}
//               To :{" "}
//               {new Date(dates.end).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short", // Abbreviated month format
//                 year: "numeric",
//               })}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="invoice-of-collection-div w100 h80 d-flex-col">
//         <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
//           <span className="text w15">{t("c-date")}</span>
//           <span className="text w5">{t("c-m/e")}</span>
//           <span className="text w10">{t("c-c/b")}</span>
//           <span className="text w10">{t("c-liters")}</span>
//           <span className="text w5">FAT</span>
//           <span className="text w5">SNF</span>
//           <span className="text w10">{t("c-rate")}</span>
//           <span className="text w15">{t("c-amt")}</span>
//         </div>
// 
//         {status === "loading" ? (
//           <div className="w100 h80 d-flex center">
//             <Spinner />
//           </div>
//         ) : (
//           <div className="report-data-container w100 h90 d-flex-col hidescrollbar">
//             {Array.isArray(records) && records.length > 0 ? (
//               records.map((report, index) => (
//                 <div
//                   key={index}
//                   className="content-values-div w100 h10 d-flex center t-center sa px10">
//                   <span className="text w15">
//                     {new Date(report.ReceiptDate).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "2-digit",
//                     })}
//                   </span>
//                   <span className="text w5">
//                     {report.ME === 0 ? `${t("c-m")}` : `${t("c-e")}`}
//                   </span>
//                   <span className="text w5">
//                     {report.CB === 0 ? `${t("c-c")}` : `${t("c-b")}`}
//                   </span>
//                   <span className="text w10">
//                     {safeToFixed(report.Litres, 1)}
//                   </span>
//                   <span className="text w5">{safeToFixed(report.fat, 1)}</span>
//                   <span className="text w5">{safeToFixed(report.snf, 1)}</span>
//                   <span className="text w10">
//                     {safeToFixed(report.Rate, 1)}
//                   </span>
//                   <span className="text w15">{safeToFixed(report.Amt, 2)}</span>
//                 </div>
//               ))
//             ) : (
//               <div className="box d-flex center subheading">
//                 {t("c-no-data-avai")}
//               </div>
//             )}
//           </div>
//         )}
//         <div className="content-total-value-div w100 h10 d-flex center t-center sa px10">
//           <span className="label-text w15">{t("c-total")} : </span>
//           <span className="text w5"></span>
//           <span className="text w10"></span>
//           <span className="text w10">
//             {safeToFixed(summary.totalLiters, 1)}
//           </span>
//           <span className="text w5">{safeToFixed(summary.avgFat, 1)}</span>
//           <span className="text w5">{safeToFixed(summary.avgSNF, 1)}</span>
//           <span className="text w10">{safeToFixed(summary.avgRate, 1)}</span>
//           <span className="text w15">
//             {safeToFixed(summary.totalAmount, 2)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };
// 
// export default CollectionReport;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReports } from "../../../../App/Features/Customers/Milk/milkMasterSlice";
import Spinner from "../../../Home/Spinner/Spinner";
import { BsCalendar3 } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import "../../../../Styles/Customer/CustNavViews/Milk/Milk.css";
// import { generateMaster } from "../../../../App/Features/Customers/Date/masterdateSlice";

const CollectionReport = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const records = useSelector((state) => state.mMilk.mrecords);
  const summary = useSelector((state) => state.mMilk.msummary);
  const status = useSelector((state) => state.mMilk.status);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const fDate = useSelector((state) => state.date.formDate);
  const tDate = useSelector((state) => state.date.toDate);

  const [selectedDate, setSelectedDate] = useState(null);

  // useEffect to dispatch getMasterReports on initial render or when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      // If a date is selected from manualMaster, use it
      dispatch(
        getMasterReports({
          fromDate: selectedDate.start,
          toDate: selectedDate.end,
        })
      );
    } else if (fDate && tDate) {
      // If no date is selected, use fDate and tDate from Redux store
      dispatch(
        getMasterReports({
          fromDate: fDate,
          toDate: tDate,
        })
      );
    }
  }, [dispatch, selectedDate, fDate, tDate]);

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      setSelectedDate(selectedDates);
      // The dispatch is now handled by useEffect
    } else {
      // If the user selects the default option, reset selectedDate to null
      setSelectedDate(null);
    }
  };

  const safeToFixed = (value, decimals = 2) => {
    return value !== null && value !== undefined
      ? value.toFixed(decimals)
      : "0.00";
  };

  return (
    <div className="coll-report-container w100 h1 d-flex-col bg">
      <div className="menu-title-div w100 h10 d-flex a-center sb p10">
        <h2 className="heading"> {t("c-coll-report")}</h2>
        {selectedDate !== null ? (
          <h2 className="label-text px10">
            <span className="info-text">
              {new Date(selectedDate.start).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short", // Abbreviated month format
                year: "numeric",
              })}
            </span>
            <span> To : </span>
            <span className="info-text">
              {new Date(selectedDate.end).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short", // Abbreviated month format
                year: "numeric",
              })}
            </span>
          </h2>
        ) : fDate && tDate ? (
          <h2 className="label-text px10">
            <span className="info-text">
              {new Date(fDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span> To : </span>
            <span className="info-text">
              {new Date(tDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </h2>
        ) : (
          <span></span>
        )}
      </div>
      <div className="custmize-report-div w100 h10 px10 d-flex a-center sb">
        <span className="cl-icon w10 h1 d-flex center">
          <BsCalendar3 />
        </span>
        <select
          className="custom-select label-text w80 h1 p10"
          onChange={handleSelectChange}
          aria-label={t("c-select-master")}>
          <option className="label-text w100 d-flex" value="">
            --{t("c-select-master")}--
          </option>
          {Array.isArray(manualMaster) && manualMaster.length > 0 ? (
            manualMaster.map((dates, index) => (
              <option
                className="label-text w100 d-flex sa"
                key={`${dates.start}-${dates.end}-${index}`}
                value={index}>
                {new Date(dates.start).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short", // Abbreviated month format
                  year: "numeric",
                })}
                To :{" "}
                {new Date(dates.end).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short", // Abbreviated month format
                  year: "numeric",
                })}
              </option>
            ))
          ) : (
            <option className="sub-heading w100 d-flex sa" disabled>
              {t("c-no-master-data")}
            </option>
          )}
        </select>
      </div>
      <div className="invoice-of-collection-div w100 h80 d-flex-col">
        <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
          <span className="text w15">{t("c-date")}</span>
          <span className="text w5">{t("c-m/e")}</span>
          <span className="text w10">{t("c-c/b")}</span>
          <span className="text w10">{t("c-liters")}</span>
          <span className="text w5">FAT</span>
          <span className="text w5">SNF</span>
          <span className="text w10">{t("c-rate")}</span>
          <span className="text w15">{t("c-amt")}</span>
        </div>

        {status === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : (
          <div className="report-data-container w100 h90 d-flex-col hidescrollbar">
            {Array.isArray(records) && records.length > 0 ? (
              records.map((report, index) => (
                <div
                  key={`${report.id}-${index}`} // Assuming each report has a unique 'id'
                  className="content-values-div w100 h10 d-flex center t-center sa px10">
                  <span className="text w15">
                    {new Date(report.ReceiptDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="text w5">
                    {report.ME === 0 ? `${t("c-m")}` : `${t("c-e")}`}
                  </span>
                  <span className="text w5">
                    {report.CB === 0 ? `${t("c-c")}` : `${t("c-b")}`}
                  </span>
                  <span className="text w10">
                    {safeToFixed(report.Litres, 1)}
                  </span>
                  <span className="text w5">{safeToFixed(report.fat, 1)}</span>
                  <span className="text w5">{safeToFixed(report.snf, 1)}</span>
                  <span className="text w10">
                    {safeToFixed(report.Rate, 1)}
                  </span>
                  <span className="text w15">{safeToFixed(report.Amt, 2)}</span>
                </div>
              ))
            ) : (
              <div className="box d-flex center subheading">
                {t("c-no-data-avai")}
              </div>
            )}
          </div>
        )}
        <div className="content-total-value-div w100 h10 d-flex center t-center sa px10">
          <span className="label-text w15">{t("c-total")} : </span>
          <span className="text w5"></span>
          <span className="text w10"></span>
          <span className="text w10">
            {safeToFixed(summary.totalLiters, 1)}
          </span>
          <span className="text w5">{safeToFixed(summary.avgFat, 1)}</span>
          <span className="text w5">{safeToFixed(summary.avgSNF, 1)}</span>
          <span className="text w10">{safeToFixed(summary.avgRate, 1)}</span>
          <span className="text w15">
            {safeToFixed(summary.totalAmount, 2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionReport;
