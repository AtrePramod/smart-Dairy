import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BsCalendar3 } from "react-icons/bs";
import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";

const MilkReports = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const collection = useSelector((state) => state.milkCollection.allMilkColl);
  // const [date, setDate] = useState("2023-10-11");
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  console.log(collection);

  const [filters, setFilters] = useState({
    center: false, // "By Center"
    customer: false, // By Customer
    animal: false, // By Animal Type (cb)
    time: false, // By Time (ME)
  });

  const filterAndGroupData = (currentFilters) => {
    let filteredData = collection;

    // Filter by Customer
    if (currentFilters.customer) {
      filteredData = filteredData.filter((record) => record.rno);
      // Group by rno (customer) and sort in ascending order
      const groupedByCustomer = filteredData.reduce((groups, record) => {
        if (!groups[record.rno]) {
          groups[record.rno] = [];
        }
        groups[record.rno].push(record);
        return groups;
      }, {});

      // Sort each group in ascending order of rno
      const sortedGroupedByCustomer = Object.keys(groupedByCustomer)
        .sort((a, b) => a.localeCompare(b)) // Sort keys (rno) alphabetically
        .reduce((sortedGroups, rno) => {
          sortedGroups[rno] = groupedByCustomer[rno];
          return sortedGroups;
        }, {});

      setGroupedData(sortedGroupedByCustomer);
      return;
    }

    // Group by Animal Type (cb)
    if (currentFilters.animal) {
      const groupedByCB = filteredData.reduce(
        (groups, record) => {
          groups[record.cb].push(record);
          return groups;
        },
        { 0: [], 1: [] }
      );
      setGroupedData(groupedByCB);
      return;
    }

    // Filter by Time (ME)
    if (currentFilters.time) {
      const groupedByTime = filteredData.reduce(
        (groups, record) => {
          const timeSlot = record.ME === 0 ? "Morning" : "Evening";
          if (!groups[timeSlot]) {
            groups[timeSlot] = [];
          }
          groups[timeSlot].push(record);
          return groups;
        },
        { Morning: [], Evening: [] }
      );
      setGroupedData(groupedByTime);
      return;
    }

    setGroupedData({ all: filteredData });
  };

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

// ..................................................................................

const renderGroupedData = () => {
  if (filters.customer) {
    return Object.keys(groupedData).map((key) => (
      <div key={key}>
        <div className="w100 d-flex-col h1">
          <div className="custome-info-div w100 h10 d-flex p10 bg3">
            <span className="label-text w20">
              Code : {groupedData[key][0].rno}
            </span>
            <span className="label-text w50">
              Name : {groupedData[key][0].cname}
            </span>
          </div>
          <div className="collection-data-container w100 mh100 hidescrollbar d-flex-col sa">
            <div className="colldata-headings-div w100 h10 d-flex t-center bg2 p10 sa">
              <span className="label-text w10">Date</span>
              <span className="label-text w10">Time</span>
              <span className="label-text w10">FAT</span>
              <span className="label-text w10">SNF</span>
              <span className="label-text w15">Liters</span>
              <span className="label-text w10">Rate</span>
              <span className="label-text w20">Amount</span>
              <span className="label-text w10">Animal</span>
            </div>
            {groupedData[key].map((milk) => (
              <div className="colldata-headings-div w100 h10 d-flex t-center sa bg4">
                <span className="labeltext w10">
                  {milk.ReceiptDate.slice(0, 10)}
                </span>
                <span className="labeltext w10">
                  {milk.ME === 0 ? "Morning" : "Evening"}
                </span>
                <span className="labeltext w10">{milk.fat}</span>
                <span className="labeltext w10">{milk.snf}</span>
                <span className="labeltext w15">{milk.Litres}</span>
                <span className="labeltext w10">{milk.rate}</span>
                <span className="labeltext w20">{milk.Amt}</span>
                <span className="labeltext w10">
                  {milk.CB === 0 ? "cow" : "buffalo"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="py10"></div>
      </div>
    ));
  }

  if (filters.animal) {
    return Object.keys(groupedData).map((key) => (
      <div key={key}>
        <h3>Animal: {key === "0" ? "Cow" : "Buffalo"}</h3>
        {groupedData[key].map((record) => (
          <div key={record.id}>{/* Render record details */}</div>
        ))}
      </div>
    ));
  }

  if (filters.time) {
    return Object.keys(groupedData).map((key) => (
      <div key={key}>
        <h3>{key}</h3>
        {groupedData[key].map((record) => (
          <div key={record.id}>{/* Render record details */}</div>
        ))}
      </div>
    ));
  }

  return <p>No filters applied.</p>;
};



// ..................................................................................
const handleRadioChange = (e) => {
  const { value } = e.target;
  setFilters(() => ({
    center: false,
    customer: false,
    animal: false,
    time: false,
    [value]: true,
  }));

  // Filter and group data based on the selected filter
  filterAndGroupData({
    center: false,
    customer: false,
    animal: false,
    time: false,
    [value]: true,
  });
};

  return (
    <div className="milk-collection-Report-container w100 h1 d-flex">
      <div className="fillter-menu-div w80 h1 d-flex-col ">
        <span className="subtitle t-center">Milk Collection Reports</span>
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
            {/* {filters.customer ? (
              <>
                {Object.keys(groupedData).map((key) => (
                  
                  <div className="fillter-data-headings-customers-div">
                    <div className="center-info-div w100 h10 d-flex px10">
                      <span className="label-text w50">centername</span>
                    </div>
                    {groupedData[key].map((record) => (
                      <div className="custome-info-div w100 h10 d-flex px10">
                        <span className="labeltext w20">
                          Code: {record.rno}
                        </span>
                        <span className="labeltext w50">
                          Name: {record.cname}{" "}
                        </span>
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
                      {groupedData[key].map((milk, index) => (
                        <div className="colldata-headings-div w100 h10 d-flex t-center sa">
                          <span className="labeltext w10">
                            {milk.ReceiptDate.slice(0, 10)}
                          </span>
                          <span className="labeltext w10">
                            {milk.ME === 0 ? "Morning" : "Evening"}
                          </span>
                          <span className="labeltext w10">{milk.fat}</span>
                          <span className="labeltext w10">{milk.snf}</span>
                          <span className="labeltext w15">{milk.Litres}</span>
                          <span className="labeltext w10">{milk.rate}</span>
                          <span className="labeltext w20">{milk.Amt}</span>
                          <span className="labeltext w10">
                            {milk.CB === 0 ? "cow" : "buffalo"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : filters.animal ? (
              <>
                <h3>Grouped by Animal Type</h3>
                {Object.keys(groupedData).map((key) => (
                  <div className="fillter-data-headings-customers-div">
                    <div className="center-info-div w100 h10 d-flex px10">
                      <span className="label-text w50">centername</span>
                    </div>
                    {groupedData[key].map((record) => (
                      <div className="custome-info-div w100 h10 d-flex px10">
                        <span className="labeltext w20">
                          Code: {record.rno}
                        </span>
                        <span className="labeltext w50">
                          Name: {record.cname}{" "}
                        </span>
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
                      {groupedData[key].map((milk, index) => (
                        <div className="colldata-headings-div w100 h10 d-flex t-center sa">
                          <span className="labeltext w10">
                            {milk.ReceiptDate.slice(0, 10)}
                          </span>
                          <span className="labeltext w10">
                            {milk.ME === 0 ? "Morning" : "Evening"}
                          </span>
                          <span className="labeltext w10">{milk.fat}</span>
                          <span className="labeltext w10">{milk.snf}</span>
                          <span className="labeltext w15">{milk.Litres}</span>
                          <span className="labeltext w10">{milk.rate}</span>
                          <span className="labeltext w20">{milk.Amt}</span>
                          <span className="labeltext w10">
                            {milk.CB === 0 ? "cow" : "buffalo"}
                          </span>
                        </div>
                      ))}
                    </div>
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
            {/* below structure to show fillter without center name */}
            {/* <div className="fillter-data-headings-customers-div">
              <div className="custome-info-div w100 h10 d-flex px10">
                <span className="labeltext w20">Code: rno</span>
                <span className="labeltext w50">Name: cname</span>
              </div>
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
                <div className="colldata-headings-div w100 h10 d-flex t-center sa">
                  <span className="labeltext w10">ReceiptDat</span>
                  <span className="labeltext w10">ME</span>
                  <span className="labeltext w10">fat</span>
                  <span className="labeltext w10">snf</span>
                  <span className="labeltext w15">Litres</span>
                  <span className="labeltext w10">rate</span>
                  <span className="labeltext w20">Amt</span>
                  <span className="labeltext w10">CB</span>
                </div>
              </div>
            </div> */}

            {renderGroupedData()}
          </div>
        </div>
        {/* ................................................... */}
        <div className="report-results w100 d-flex-col mt20">
          {filters.animal ? (
            <>
              <h3>Grouped by Animal Type</h3>
              {Object.keys(groupedData).map((key) => (
                <div key={key}>
                  {/* <h4>Group CB {key}</h4> */}
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
        </div>
      </div>

      <div className="filter-menu-div w20 h1 d-flex-col bg5">
        <span className="heading t-center">Filter Report</span>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            type="radio"
            name="filter"
            value="center"
            checked={filters.center}
            onChange={handleRadioChange}
          />
          <span className="labeltext w70 t-end">By Center</span>
        </div>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            type="radio"
            name="filter"
            value="customer"
            checked={filters.customer}
            onChange={handleRadioChange}
          />
          <span className="labeltext w80 t-end">By Customer</span>
        </div>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            type="radio"
            name="filter"
            value="animal"
            checked={filters.animal}
            onChange={handleRadioChange}
          />
          <span className="labeltext w80 t-end">By Animal Type</span>
        </div>
        <div className="center-report w100 h10 d-flex a-center j-start sb px10">
          <input
            type="radio"
            name="filter"
            value="time"
            checked={filters.time}
            onChange={handleRadioChange}
          />
          <span className="labeltext w80 t-end">By Time</span>
        </div>
      </div>
    </div>
  );
};

export default MilkReports;
