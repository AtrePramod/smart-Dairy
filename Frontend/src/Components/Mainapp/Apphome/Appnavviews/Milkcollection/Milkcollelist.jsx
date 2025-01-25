import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const Milkcollelist = () => {
  const { t } = useTranslation(["milkcollection", "common"]);
  // Retrieve milk collection data and sort in descending order
  const milkColl = useSelector((state) => state.milkCollection.entries || [])
    .slice()
    .reverse();

  return (
    <div className="milk-collection-list w100 h1 d-flex-col bg">
      <div className="title-container w100 h10 p10">
        <h2 className="heading">{t("m-coll-list")}</h2>
      </div>
      <div className="collection-list-container w100 h90 d-flex-col hidescrollbar p10">
        {milkColl.length > 0 ? (
          milkColl.map((entry, i) => (
            <div key={i} className="collection-details w100 d-flex-col bg3 br6">
              <div className="col-user-info w100 h40 d-flex a-center sa p10">
                <span className="text w20">{entry.code}</span>
                <span className="text w70">{entry.cname}</span>
              </div>
              <div className="line"></div>
              <div className="col-milk-info w100 h60 d-flex-col">
                <div className="info-title w100 h50 d-flex sa">
                  <span className="text w15 d-flex center">
                    {t("common:c-fat")}
                  </span>
                  <span className="text w15 d-flex center">
                    {t("common:c-snf")}
                  </span>
                  <span className="text w15 d-flex center">
                    {t("common:c-deg")}
                  </span>
                  <span className="text w15 d-flex center">
                    {t("common:c-liters")}
                  </span>
                  <span className="text w20 d-flex center">
                    {t("common:c-rate")}
                  </span>
                  <span className="text w20 d-flex center">
                    {t("common:c-amt")}
                  </span>
                </div>
                <div className="info-value w100 h50 d-flex sa">
                  <span className="text w15 d-flex center">
                    {entry.fat || "00.0"}
                  </span>
                  <span className="text w15 d-flex center">
                    {entry.snf || "00.0"}
                  </span>
                  <span className="text w15 d-flex center">
                    {entry.degree || "00.0"}
                  </span>
                  <span className="text w15 d-flex center">
                    {entry.liters || "00.0"}
                  </span>
                  <span className="text w20 d-flex center">
                    {entry.rate || "00.0"}
                  </span>
                  <span className="text w20 d-flex center">
                    {entry.amt || "00.0"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-records w100 h1 d-flex center">
            <span className="label-text">{t("common:c-no-data-avai")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Milkcollelist;
