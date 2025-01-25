import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsCalendar3 } from "react-icons/bs";
import Spinner from "../../Home/Spinner/Spinner";
import { getMasterReports } from "../../../App/Features/Customers/Milk/milkMasterSlice";
import {
  getPaymentInfo,
  resetPayment,
} from "../../../App/Features/Payments/paymentSlice";
import "../../../Styles/Customer/CustNavViews/CustPurchase.css";
import { useTranslation } from "react-i18next";
import {
  getDeductionInfo,
  resetDeduction,
} from "../../../App/Features/Deduction/deductionSlice";

const CustPayment = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const records = useSelector((state) => state.mMilk.mrecords);
  const subdeduction = useSelector((state) => state.deduction.subdeductions);
  const payment = useSelector((state) => state.payment.payment);
  const status = useSelector((state) => state.mMilk.status);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  console.log(payment);

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      setSelectedPeriod(selectedDates);
      dispatch(
        getMasterReports({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );

      dispatch(resetDeduction());
      dispatch(
        getDeductionInfo({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
      dispatch(resetPayment());
      dispatch(
        getPaymentInfo({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  const safeToFixed = (value, decimals = 2) => {
    return value !== null && value !== undefined
      ? value.toFixed(decimals)
      : "0.00";
  };

  return (
    <div className="payment-container w100 h1 d-flex-col ">
      <div className="title-select-date w100 h20 d-flex-col p10">
        <div className="menu-title-div w70 h50 d-flex">
          <h2 className="f-heading">{t("c-page-title-pay")}</h2>
        </div>
        <div className="custmize-report-div w100 h50 d-flex a-center sb">
          <span className="cl-icon w10 h1 d-flex center">
            <BsCalendar3 />
          </span>
          <select
            className="custom-select w80 h1 p10"
            onChange={handleSelectChange}>
            <option className="label-text w100 d-flex">
              --{t("c-select-master")}--
            </option>
            {manualMaster.map((dates, index) => (
              <option
                className="label-text w100 d-flex sa"
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
      </div>
      <div className="payment-details-container w100 h80 mh80 d-flex-col">
        {selectedPeriod == null ? (
          <div className="w100 h1 d-flex center">
            <span className="heading">{t("c-no-data-avai")}</span>
          </div>
        ) : status === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : (
          // payment info
          <div className="payment-details-div w100 h90 d-flex-col hidescrollbar p10">
            <div className="milk-summary-container w100 d-flex-col bg py10 ">
              <span className="heading px10">{t("c-page-title-milk")} :</span>
              <div className="invoice-of-collection-div w100 d-flex-col">
                <div className="content-titles-div w100 d-flex center t-center sa p10">
                  <span className="text w15">{t("c-date")}</span>
                  <span className="text w5">{t("c-m/e")}</span>
                  <span className="text w10">{t("c-c/b")}</span>
                  <span className="text w10">{t("c-liters")}</span>
                  <span className="text w5">FAT</span>
                  <span className="text w5">SNF</span>
                  <span className="text w10">{t("c-rate")}</span>
                  <span className="text w15">{t("c-amt")}</span>
                </div>
                <div className="report-data-container w100 h90 d-flex-col hidescrollbar">
                  {Array.isArray(records) && records.length > 0 ? (
                    records.map((report, index) => (
                      <div
                        key={index}
                        className="content-values-div w100 h10 d-flex center t-center sb">
                        <span className="text w15">
                          {new Date(report.ReceiptDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
                        </span>
                        <span className="text w5">
                          {report.ME === 0 ? `${t("c-m")}` : `${t("c-e")}`}
                        </span>
                        <span className="text w10">
                          {report.CB === 0 ? `${t("c-c")}` : `${t("c-b")}`}
                        </span>
                        <span className="text w10">
                          {safeToFixed(report.Litres, 1)}
                        </span>
                        <span className="text w5">
                          {safeToFixed(report.fat, 1)}
                        </span>
                        <span className="text w5">
                          {safeToFixed(report.snf, 1)}
                        </span>
                        <span className="text w10">
                          {safeToFixed(report.Rate, 1)}
                        </span>
                        <span className="text w15">
                          {safeToFixed(report.Amt, 2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="box d-flex center subheading">
                      <span className="heading">{t("c-no-data-avai")}</span>
                    </div>
                  )}
                </div>
                {/* <hr />
              <div className="content-total-value-div w100 h50 d-flex-col sb p10 ">
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Total Liters :</span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.totalLiters, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Avrage FAT : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.avgFat, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Avrage SNF : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.avgSNF, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Avrage Rate : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.avgRate, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="text w30">Total Amount : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.totalAmount, 2)}
                  </span>
                </div>
              </div> */}
              </div>
            </div>
            {/* deduction info */}
            <div className="cattel-feeds-summary-div w100 h50 d-flex-col py10 bg my10">
              <span className="heading px10">{t("c-page-title-deduct")} :</span>
              <div className="purchase-detailsitable w100 h80 mh80 d-flex-col hidescrollbar px10">
                {subdeduction.length > 0 ? (
                  <div className="sub-deductions w100 h50 mh40 d-flex-col sb my10">
                    {subdeduction.map((deduction, index) => (
                      <div key={index} className="Amount w100 h30 d-flex sb">
                        <span className="text">{deduction.dname} :</span>
                        <span className="info-text">
                          {deduction.Amt || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="box d-flex center subheading">
                    <span className="heading">{t("c-no-data-avai")}</span>
                  </div>
                )}
              </div>
            </div>
            {/* deduction info */}
            <div className="deduction-summary-div w100 h60 d-flex-col py10 bg">
              <span className="heading px10">{t("c-pay-details")} : </span>
              {payment.length > 0 ? (
                <div className="deduction-info-details w100 h1 d-flex-col p10">
                  <div className="date-billno-div w100 h20 d-flex sb">
                    <div className="dates w50 h1 d-flex sb">
                      <span className="label-text">{t("c-date")} : </span>
                      <span className="info-text">
                        {payment[0]?.ToDate
                          ? new Date(payment[0].ToDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="bill-div w30 h1 d-flex sb">
                      <span className="label-text">{t("c-billno")} : </span>
                      <span className="info-text">
                        {payment[0]?.BillNo || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="rate-amount w100 h80 d-flex-col">
                    <div className="rate w100 h1 d-flex sb">
                      <span className="label-text">{t("c-t-liters")} :</span>
                      <span className="info-text">
                        {payment[0]?.tliters || "N/A"}
                      </span>
                    </div>
                    <div className="Amount w100 h1 d-flex sb">
                      <span className="label-text">{t("c-avg-rate")} :</span>
                      <span className="info-text">
                        {payment[0]?.arate || "N/A"}
                      </span>
                    </div>
                    <div className="rate w100 h1 d-flex sb">
                      <span className="label-text">{t("c-pay-amt")} :</span>
                      <span className="info-text">
                        {payment[0]?.pamt || "N/A"}
                      </span>
                    </div>
                    <div className="Amount w100 h1 d-flex sb">
                      <span className="label-text">{t("c-t-deduct")} :</span>
                      <span className="info-text">
                        {payment[0]?.damt || "N/A"}
                      </span>
                    </div>
                    <div className="rate w100 h1 d-flex sb">
                      <span className="label-text">{t("c-last-dedu")} :</span>
                      <span className="info-text">
                        {"0.0"}
                      </span>
                    </div>
                    <div className="rate w100 h1 d-flex sb">
                      <span className="label-text">
                        {t("c-remaining-dedu")} :
                      </span>
                      <span className="info-text">
                        {"0.0"}
                      </span>
                    </div>
                    <div className="rate w100 h1 d-flex sb">
                      <span className="label-text">{t("c-net-pay")} :</span>
                      <span className="info-text">
                        {payment[0]?.namt || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="box d-flex center subheading">
                  <span className="heading">{t("c-no-data-avai")}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustPayment;
