import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchaseBill } from "../../../App/Features/Purchase/purchaseSlice";
import { generateMaster } from "../../../App/Features/Customers/Date/masterdateSlice";
import { BsCalendar3 } from "react-icons/bs";
import Spinner from "../../Home/Spinner/Spinner";
import "../../../Styles/Customer/CustNavViews/CustPurchase.css";
import { useTranslation } from "react-i18next";

const CustPurchase = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const master = useSelector((state) => state.masterdates.masterlist);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const purchaseBill = useSelector((state) => state.purchase.purchaseBill);
  const status = useSelector((state) => state.purchase.status);
  const psummary = useSelector((state) => state.purchase.psummary);

  // Generate master dates based on the initial date
  useEffect(() => {
    dispatch(generateMaster(date));
  }, [dispatch]);

  // Handle the date selection
  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
     
      // Dispatch the action with the selected fromDate and toDate
      dispatch(
        getPurchaseBill({
          formDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  return (
    <div className="purchase-info-div w100 h1 d-flex-col">
      <div className="title-select-date w100 h20 d-flex-col p10">
        <div className="menu-title-div w100 h50 d-flex p10">
          <h2 className="f-heading">{t("c-page-title-feeds")}</h2>
        </div>
        <div className="custmize-report-div w100 h50 d-flex a-center sb">
          <span className="cl-icon w10 h1 d-flex center">
            <BsCalendar3 />
          </span>
          <select
            className="custom-select label-text w80 h1 p10"
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
      <div className="purchase-details-container w100 h1 d-flex-col p10">
        <div className="purchase-details-div w100 h80 d-flex-col bg">
          <div className="menu-title-div w100 h10 d-flex p10">
            <h2 className="heading">{t("c-sales-details")} : </h2>
          </div>

          <div className="purchase-table-titles w100 h10 t-center a-center d-flex sa bg4">
            <span className="text w15">{t("c-billno")}</span>
            <span className="text w15">{t("c-date")}</span>
            <span className="text w20">{t("c-prod")}</span>
            <span className="text w15">{t("c-qty")}</span>
            <span className="text w15">{t("c-rate")}</span>
            <span className="text w15">{t("c-amt")}</span>
          </div>

          {status === "loading" ? (
            <div className="w100 h80 d-flex center">
              <Spinner />
            </div>
          ) : (
            <div className="purchase-detailsitable w100 h80 mh80 d-flex-col hidescrollbar p10">
              {purchaseBill.length > 0 ? (
                purchaseBill.map((bill, index) => (
                  <div
                    key={index}
                    className="purchase-table-values w100 h10 t-center a-center d-flex sa my5">
                    <span className="text w15">{bill.BillNo}</span>
                    <span className="text w15">
                      {new Date(bill.BillDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                    <span className="text w20">{bill.ItemName}</span>
                    <span className="text w15">{bill.Qty}</span>
                    <span className="text w15">{bill.Rate}</span>
                    <span className="text w15">{bill.Amount}</span>
                  </div>
                ))
              ) : (
                <div className="box d-flex center subheading">
                  <span className="heading">{t("c-no-data-avai")}</span>
                </div>
              )}
            </div>
          )}

          <div className="purchase-table-total w100 h10 t-center a-center d-flex sa bg4">
            <span className="text w15">{t("c-total")} :</span>
            <span className="text w15"></span>
            <span className="text w20"></span>
            <span className="text w15">{psummary.totalQty}</span>
            <span className="text w15"></span>
            <span className="text w15">{psummary.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustPurchase;
