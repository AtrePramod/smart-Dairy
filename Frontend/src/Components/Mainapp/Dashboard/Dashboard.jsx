import React, { PureComponent, useEffect, Suspense, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BsDatabaseAdd, BsPersonFill } from "react-icons/bs";
import { TfiStatsUp } from "react-icons/tfi";
import { BsCalendar3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAllMilkCollReport } from "../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { generateMaster } from "../../../App/Features/Customers/Date/masterdateSlice";
import { listCustomer } from "../../../App/Features/Customers/customerSlice";
import Spinner from "../../Home/Spinner/Spinner";
import "../../../Styles/Mainapp/Dashbaord/Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const mastermilk = useSelector((state) => state.milkCollection.allMilkColl);
  const status = useSelector((state) => state.milkCollection.allmilkstatus);
  const customerslist = useSelector((state) => state.customer.customerlist); //save customer list

  // Generate master dates based on the initial date
  useEffect(() => {
    dispatch(generateMaster(date));
    dispatch(listCustomer());
  }, []);

  const customerCount = customerslist.length;

  const totalLitres = mastermilk.reduce((acc, item) => acc + item.Litres, 0);
  const totalAmt = mastermilk.reduce((acc, item) => acc + item.Amt, 0);

  const aggregatedData = mastermilk.reduce((acc, curr) => {
    const date = new Date(curr.ReceiptDate).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { totalLitres: 0, totalAmt: 0 };
    }
    acc[date].totalLitres += curr.Litres;
    acc[date].totalAmt += curr.Amt;
    return acc;
  }, {});

  const chartData = Object.keys(aggregatedData).map((date) => ({
    date,
    totalLitres: aggregatedData[date].totalLitres.toFixed(1),
    totalAmt: aggregatedData[date].totalAmt.toFixed(1),
  }));

  const saveCustomerList = () => {
    localStorage.setItem("customerlist", JSON.stringify(customerslist));
  };

  // Store customerlist in localStorage whenever it updates
  useEffect(() => {
    saveCustomerList();
  }, [customerslist]);

  // Handle the date selection
  const handleSelectChange = async (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      dispatch(
        getAllMilkCollReport({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  return (
    <div className="main-dashboard-container w100 h1 d-flex-col">
      <div className="dashboard-title w100 d-flex p10">
        <h3 className="subtitle">Dashbord</h3>
      </div>
      <div className="dashboard-scrll-container w100">
        <form className="selection-container w100 h20 d-flex sa">
          <div className="select-data-text w20 h50 d-flex-col p10">
            <span className="text">Select Data Period</span>
          </div>
          <div className="custmize-report-div w30 h50 px10 d-flex a-center sb">
            <span className="cl-icon w10 h1 d-flex center">
              <BsCalendar3 />
            </span>
            <select
              className="custom-select label-text w90 h1 p10"
              onChange={handleSelectChange}>
              <option className="label-text w100 d-flex">
                --Select Master--
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
        </form>
        <div className="dashboard-cards w100 h20 d-flex j-start">
          <div className="card mx10">
            <BsDatabaseAdd className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Milk Collection</h3>
              <h3 className="heading">
                {totalLitres.toFixed(1)}
                <span>ltr</span>
              </h3>
            </div>
          </div>
          <div className="card mx10">
            <BsPersonFill className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Customers</h3>
              <h3 className="heading">{customerCount}</h3>
            </div>
          </div>
          <div className="card mx10">
            <TfiStatsUp className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Sales</h3>
              <h3 className="heading">
                {totalAmt.toFixed(1) || 0} <span>Rs</span>
              </h3>
            </div>
          </div>
          {/* <div className="card">
            <BsCurrencyRupee className="card-icon" />
            <div className="card-inner">
              <h3 className="text">Revenue</h3>
              <h3 className="heading">
                100 <span>Rs</span>
              </h3>
            </div>
          </div> */}
        </div>
        <div className="dashboard-data-charts w100 h50 d-flex a-center sa">
          <div className="milk-collection-chart w40 h1 d-flex-col p10 bg">
            <div className="chart-title w100">
              <span className="label-text">Liters</span>
            </div>
            {/* {status === "loading" ? (
              <div className="w100 h80 d-flex center">
                <Spinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={100} height={40} data={chartData} barSize={20}>
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
                  <Bar dataKey="totalLitres" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )} */}
            <Suspense
              fallback={
                <div className="w100 h80 d-flex center">
                  <Spinner />
                </div>
              }>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={100} height={40} data={chartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} domain={[0, "dataMax + 10"]} />
                  <Tooltip />
                  <Bar dataKey="totalLitres" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
          <div className="milk-collection-chart w40 h1 d-flex-col p10 bg">
            <div className="chart-title w100">
              <span className="label-text">Amount</span>
            </div>
            {/* {status === "loading" ? (
              <div className="w100 h80 d-flex center">
                <Spinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={100} height={40} data={chartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 5" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 8 }} // Set font size for X-axis
                  />
                  <YAxis
                    tick={{ fontSize: 8 }} // Set font size for Y-axis
                    domain={[0, "dataMax + 10"]} // Adjust the Y-axis domain as needed
                  />
                  <Tooltip />
                  <Bar dataKey="totalAmt" fill="#ffcc99" />
                </BarChart>
              </ResponsiveContainer>
            )} */}
            <Suspense
              fallback={
                <div className="w100 h80 d-flex center">
                  <Spinner />
                </div>
              }>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={100} height={40} data={chartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 5" />
                  <XAxis dataKey="date" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} domain={[0, "dataMax + 10"]} />
                  <Tooltip />
                  <Bar dataKey="totalAmt" fill="#ffcc99" />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
