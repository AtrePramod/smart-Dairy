import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getMilkReports } from "../../../App/Features/Customers/Milk/milkSlice";
import "../../../Styles/Customer/CustNavViews/Custdashboard.css";
import { useTranslation } from "react-i18next";
import { getDashboardInfo } from "../../../App/Features/Customers/Dashboard/dashboardSlice";
import Spinner from "../../Home/Spinner/Spinner";

const Custdashboard = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();

  const dashboard = useSelector((state) => state.dashboard.dashboardInfo);
  const status = useSelector((state) => state.dashboard.status);
  const summary = useSelector((state) => state.milk.summary);
  const dairyname = useSelector((state) => state.dairy.dairyData.SocietyName);
  const fDate = useSelector((state) => state.date.formDate);
  const tDate = useSelector((state) => state.date.toDate);

  const fromDate = `${fDate}`;
  const toDate = `${tDate}`;

  // Initialize totals
  let totalLiters = 0;
  let totalFat = 0;
  let totalSNF = 0;
  let totalRate = 0;
  let totalAmt = 0;

  const getTotals = () => {
    if (summary && summary.length > 0) {
      summary.forEach((item) => {
        totalLiters += item.Litres || 0;
        totalFat += (item.fat || 0) * (item.Litres || 0); // Weighted sum for fat
        totalSNF += (item.snf || 0) * (item.Litres || 0); // Weighted sum for SNF
        totalRate += (item.Rate || 0) * (item.Litres || 0); // Weighted sum for Rate
        totalAmt += item.Amt || 0;
      });
    }
  };

  const avgFat = totalLiters > 0 ? totalFat / totalLiters : 0;
  const avgSNF = totalLiters > 0 ? totalSNF / totalLiters : 0;
  const avgRate = totalLiters > 0 ? totalRate / totalLiters : 0;

  useEffect(() => {
    getTotals();
  }, [summary]);

  useEffect(() => {
    dispatch(getDashboardInfo({ fromDate, toDate }));
    dispatch(getMilkReports({ fromDate, toDate }));
  }, [dispatch]);

  const transformedData = dashboard
    .slice(0, -1) // Exclude the last record
    .map((item) => ({
      name: new Date(item.ReceiptDate).toLocaleDateString(),
      liters: item.dailyLiters,
      amount: item.dailyAmount,
    }));

  // const safeToFixed = (value, decimals = 2) => {
  //   return value !== null && value !== undefined
  //     ? value.toFixed(decimals)
  //     : "0.00";
  // };

  return (
    <div className="cust-dashboard-information w100 h1 d-flex-col">
      <div className="menu-title-div w70 mx-15 h10 d-flex-col p10">
        <h2 className="heading">
          {t("nv-dash")} <span className="text">( {t("d-sun-info")} )</span>
        </h2>
        <h2 className="heading">{dairyname}</h2>
      </div>
      <div className="cust-dashboard-data w70 mx-15 h15 d-flex sa p10">
        <div className="data-conatiner w20 h1 t-center bg">
          <span className="sub-heading"> {t("c-t-liters")}</span>
          <span className="info-text">{totalLiters.toFixed(2)}</span>
        </div>
        <div className="data-conatiner w15 h1 t-center bg">
          <span className="sub-heading">{t("c-avg-fat")}</span>
          <span className="info-text">{avgFat.toFixed(2)}</span>
        </div>
        <div className="data-conatiner w15 h1 t-center bg">
          <span className="sub-heading">{t("c-avg-snf")}</span>
          <span className="info-text">{avgSNF.toFixed(2)}</span>
        </div>
        <div className="data-conatiner w15 h1 t-center bg">
          <span className="sub-heading">{t("c-avg-rate")}</span>
          <span className="info-text">{avgRate.toFixed(2)}</span>
        </div>
        <div className="data-conatiner w20 h1 t-center bg">
          <span className="sub-heading">{t("c-t-amt")}</span>
          <span className="info-text">{totalAmt.toFixed(2)}</span>
        </div>
      </div>
      <div className="cust-dashboard-charts w70 h70 mh70 mx-15 d-flex-col hidescrollbar">
        <div className="milk-collection-chart w50 h1 d-flex-col p10 bg">
          <div className="chart-title w100 h10">
            <span className="text">{t("c-liters")} : </span>
          </div>
          <div className="chart-div w100 h90">
            {status === "loading" ? (
              <div className="w100 h80 d-flex center">
                <Spinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={100}
                  height={40}
                  data={transformedData}
                  barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 8 }} // Set font size for X-axis
                  />
                  <YAxis
                    tick={{ fontSize: 8 }} // Set font size for Y-axis
                    domain={[0, "dataMax + 10"]} // Adjust the Y-axis domain as needed
                  />
                  <Tooltip />
                  <Bar dataKey="liters" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="milk-collection-chart w50 h1 d-flex-col p10 bg">
          <div className="chart-title w100 h10">
            <span className="text">{t("c-amt")} : </span>
          </div>
          <div className="chart-div w100 h90">
            {status === "loading" ? (
              <div className="w100 h80 d-flex center">
                <Spinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={100}
                  height={40}
                  data={transformedData}
                  barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 8 }} // Set font size for X-axis
                  />
                  <YAxis
                    tick={{ fontSize: 8 }} // Set font size for Y-axis
                    domain={[0, "dataMax + 10"]} // Adjust the Y-axis domain as needed
                  />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#ffcc99" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custdashboard;
