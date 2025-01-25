import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsCalendar3 } from "react-icons/bs";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Reports.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";

const MilkReports = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const collection = useSelector((state) => state.milkCollection.allMilkColl);
  const [groupedData, setGroupedData] = useState({});

  const [filters, setFilters] = useState({
    center: false, // "By Center"
    customer: false, // By Customer
    animal: false, // By Animal Type (cb)
    time: false, // By Time (ME)
  });

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [morningData, setMorningData] = useState([]);
  const [eveningData, setEveningData] = useState([]);
  const [totalMilk, setTotalMilk] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [date, setDate] = useState("2023-10-11");

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (date) {
      axios
        .get(`/milk/report?date=${date}`)
        .then((res) => {
          setMorningData(res.data.morningData || []);
          setEveningData(res.data.eveningData || []);
          setTotalMilk(res.data.totalMilk || 0);
          setTotalCustomers(res.data.totalCustomers || 0);
          setTotalAmount(res.data.totalAmount || 0);
        })
        .catch((err) => {
          console.log(err);
          setMorningData([]);
          setEveningData([]);
          setTotalMilk(0);
          setTotalCustomers(0);
          setTotalAmount(0);
        });
    }
  }, [date]);

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      setSelectedPeriod(selectedDates);
      dispatch(
        getAllMilkCollReport({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Filter and group data based on the active filters
    filterAndGroupData({ ...filters, [name]: checked });
  };

  //   const filterAndGroupData = (currentFilters) => {
  //     let filteredData = collection;
  //
  //     // Filter by Customer
  //     if (currentFilters.customer) {
  //       filteredData = filteredData.filter((record) => record.rno);
  //       // Group by rno (customer) and sort in ascending order
  //       const groupedByCustomer = filteredData.reduce((groups, record) => {
  //         if (!groups[record.rno]) {
  //           groups[record.rno] = [];
  //         }
  //         groups[record.rno].push(record);
  //         return groups;
  //       }, {});
  //
  //       // Sort each group in ascending order of rno
  //       const sortedGroupedByCustomer = Object.keys(groupedByCustomer)
  //         .sort((a, b) => a.localeCompare(b)) // Sort keys (rno) alphabetically
  //         .reduce((sortedGroups, rno) => {
  //           sortedGroups[rno] = groupedByCustomer[rno];
  //           return sortedGroups;
  //         }, {});
  //
  //       setGroupedData(sortedGroupedByCustomer);
  //       return;
  //     }
  //
  //     // Group by Animal Type (cb)
  //     if (currentFilters.animal) {
  //       const groupedByCB = filteredData.reduce(
  //         (groups, record) => {
  //           groups[record.cb].push(record);
  //           return groups;
  //         },
  //         { 0: [], 1: [] }
  //       );
  //       setGroupedData(groupedByCB);
  //       return;
  //     }
  //
  //     // Filter by Time (ME)
  //     if (currentFilters.time) {
  //       const groupedByTime = filteredData.reduce(
  //         (groups, record) => {
  //           const timeSlot = record.ME === 0 ? "Morning" : "Evening";
  //           if (!groups[timeSlot]) {
  //             groups[timeSlot] = [];
  //           }
  //           groups[timeSlot].push(record);
  //           return groups;
  //         },
  //         { Morning: [], Evening: [] }
  //       );
  //       setGroupedData(groupedByTime);
  //       return;
  //     }
  //
  //     setGroupedData({ all: filteredData });
  //   };

  const filterAndGroupData = (currentFilters) => {
    let filteredData = collection;

    // By Customer
    if (currentFilters.customer) {
      const grouped = filteredData.reduce((groups, record) => {
        if (!groups[record.rno]) {
          groups[record.rno] = {
            cname: record.cname,
            rno: record.rno,
            records: {}, // Group by ReceiptDate
          };
        }

        // Group by ReceiptDate
        const receiptDate = record.ReceiptDate;
        if (!groups[record.rno].records[receiptDate]) {
          groups[record.rno].records[receiptDate] = [];
        }
        groups[record.rno].records[receiptDate].push(record);

        return groups;
      }, {});

      setGroupedData(grouped);

      // setGroupedData(
      //   Object.keys(grouped)
      //     .sort()
      //     .reduce((obj, key) => {
      //       obj[key] = grouped[key];
      //       return obj;
      //     }, {})
      // );
      console.log("customer", grouped);
      return;
    }

    // By Animal Type (cb)
    if (currentFilters.animal) {
      const grouped = filteredData.reduce((groups, record) => {
        groups[record.CB] = [...(groups[record.CB] || []), record];
        return groups;
      }, {});

      setGroupedData(grouped);
      console.log("animal", grouped);
      return;
    }
    // By Time (ME)
    if (currentFilters.time) {
      const grouped = filteredData.reduce(
        (groups, record) => {
          const slot = record.ME === 0 ? "Morning" : "Evening";
          groups[slot] = [...(groups[slot] || []), record];
          return groups;
        },
        { Morning: [], Evening: [] }
      );
      setGroupedData(grouped);
      return;
    }
    console.log("animal", filteredData);
    // Default (all data)
    setGroupedData({ all: filteredData });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
  };

  return (
    <div className="milk-collection-details-container w100 h1 d-flex">
      {/* <div className="title-container w100 h10 p10">
        <h2 className="subtitle">Today's Milk Collection Report</h2>
      </div> */}
      {/* <div className="milk-main-details w100 h10 d-flex sa my10">
        <div className="details-container w20 h1 d-flex-col a-center bg">
          <span className="sub-heading">Total Collection</span>
          <span className="text">{totalMilk} ltr</span>
        </div>
        <div className="details-container w20 h1 d-flex-col a-center bg">
          <span className="sub-heading">Total Customers</span>
          <span className="text">{totalCustomers}</span>
        </div>
        <div className="details-container w20 h1 d-flex-col a-center bg">
          <span className="sub-heading">Total Amount</span>
          <span className="text">{totalAmount} Rs.</span>
        </div>
      </div> */}

      {/* <div className="milk-collection-time-wise w100 h80 d-flex-col">
        <div className="div title w100 h10 d-flex">
          <span className="heading h10">Milk Collection Details </span>
        </div>
        <div className="time-wise-milk-collection w100 h90 d-flex sa p10">
          <div className="morning-milk-collection w45 h1 d-flex-col bg">
            <span className="heading p10">Morning Collection</span>
            <div className="details-info-div w100 h10 d-flex a-center sa bg6 p10">
              <span className="w15 heading d-flex center">FAT</span>
              <span className="w15 heading d-flex center">SNF</span>
              <span className="w15 heading d-flex center">Litre</span>
              <span className="w15 heading d-flex center">Rate</span>
              <span className="w15 heading d-flex center">Amount</span>
              <span className="w15 heading d-flex center">Edit</span>
              <span className="w15 heading d-flex center">Delete</span>
            </div>
            <div className="amt-info-details-div w100 mh100 hidescrollbar d-flex-col">
              <div className="amt-info-div w100 h10 d-flex a-center sa">
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
              </div>
            </div>
          </div>
          <div className="evening-milk-collection w45 h1 d-flex-col bg">
            <span className="heading p10">Evening Collection</span>
            <div className="details-info-div w100 h10 d-flex a-center sa bg6 p10">
              <span className="w15 heading d-flex center">FAT</span>
              <span className="w15 heading d-flex center">SNF</span>
              <span className="w15 heading d-flex center">Litre</span>
              <span className="w15 heading d-flex center">Rate</span>
              <span className="w15 heading d-flex center">Amount</span>
              <span className="w15 heading d-flex center">Edit</span>
              <span className="w15 heading d-flex center">Delete</span>
            </div>
            <div className="amt-info-details-div w100  mh100 hidescrollbar d-flex-col">
              <div className="amt-info-div w100 h10 d-flex a-center sa">
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="fillter-menu-div w80 h1 d-flex-col ">
        <span className="subtitle t-center">Reports</span>
        <div className="fillter-report-display-container w100 h1 d-flex-col mh90 hidescrollbar">
          <div className="custmize-report-div w40 h10 d-flex a-center sb px10">
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
          <div className="fillter-results-container w100 h90 d-flex-c0l mh90 hidescrollbar sa">
            
            {Object.keys(groupedData).map((key) => (
              <div key={key} className="fillter-data-headings-customers-div">
                {groupedData[key].map((record) => (
                  <div className="custome-info-div w100 h10 d-flex px10">
                    <span className="labeltext w20">Code: {record.rno}</span>
                    <span className="labeltext w50">Name: {record.cname}</span>
                  </div>
                ))}
                <div className="collection-data-container w100 mh100 hidescrollbar d-flex-col sa bg">
                  <div className="colldata-headings-div w100 h10 d-flex t-center sa">
                    <span className="labeltext w10">Date</span>
                    <span className="labeltext w10">Time</span>
                    <span className="labeltext w10">FAT</span>
                    <span className="labeltext w10">SNF</span>
                    <span className="labeltext w15">Liters</span>
                    <span className="labeltext w10">Rate</span>
                    <span className="labeltext w20">Amount</span>
                    <span className="labeltext w10">Animal</span>
                  </div>
                  {groupedData[key].map((record, index) => (
                    <div
                      key={index}
                      className="colldata-headings-div w100 h10 d-flex t-center sa">
                      <span className="labeltext w10">
                        {record.ReceiptDate}
                      </span>
                      <span className="labeltext w10">{record.ME}</span>
                      <span className="labeltext w10">{record.fat}</span>
                      <span className="labeltext w10">{record.snf}</span>
                      <span className="labeltext w15">{record.Litres}</span>
                      <span className="labeltext w10">{record.rate}</span>
                      <span className="labeltext w20">{record.Amt}</span>
                      <span className="labeltext w10">{record.CB}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
           
          </div>
        </div>

        {/* <div className="report-results w100 d-flex-col mt20">
          {filters.animal ? (
            <>
              <h3>Grouped by Animal Type</h3>
              {Object.keys(groupedData).map((key) => (
                <div key={key}>
                  <h4>Group CB {key}</h4>
                  <ul>
                    {groupedData[key].map((record, index) => (
                      <li key={index}>
                        animal-- {record.CB}-rno - {record.rno}-date-
                        {record.ReceiptDate} - Litres: {record.Litres} - Amt:{" "}
                        {record.Amt} - {record.ME} - {record.CB}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : (
            <div>
              <h3>Filtered Results</h3>
              {groupedData.all?.map((record, index) => (
                <div key={index}>
                  time- {record.ME}-{record.ReceiptDate} - Litres:{" "}
                  {record.Litres} - Amt: {record.Amt} - {record.CB}
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>

      <div className="fillter-menu-div w20 h1 d-flex-col  bg5">
        <span className="heading t-center">Fillter Report</span>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            disabled
            type="checkbox"
            name="center"
            checked={filters.center}
            onChange={handleCheckboxChange}
          />
          <span className="labeltext w70 t-end">By Center</span>
        </div>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            type="checkbox"
            name="customer"
            checked={filters.customer}
            onChange={handleCheckboxChange}
          />
          <span className="labeltext w80 t-end">By Customer</span>
        </div>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            type="checkbox"
            name="animal"
            checked={filters.animal}
            onChange={handleCheckboxChange}
          />
          <span className="labeltext w80 t-end">By Animal Type</span>
        </div>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            type="checkbox"
            name="time"
            checked={filters.time}
            onChange={handleCheckboxChange}
          />
          <span className="labeltext w80 t-end">By Time</span>
        </div>
      </div>
    </div>
  );
};

export default MilkReports;
