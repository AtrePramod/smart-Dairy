import React, { useRef, useEffect, useState, forwardRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
// import "../../MilkReportes/MilkReportcss/CertainMilkcollection.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import { getDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";
import { BsCalendar3 } from "react-icons/bs";
import Spinner from "../../../Home/Spinner/Spinner";
import { generateMaster } from "../../../../App/Features/Customers/Date/masterdateSlice";
import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import "../../../../Styles/Mainapp/Reports/MilkReports/MilkReports.css";

const MilkcollectionReports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const printRef = useRef();
  const date = useSelector((state) => state.date.toDate);
  const dairyinfo = useSelector((state) => state.dairy.dairyData);
  const data = useSelector((state) => state.milkCollection.allMilkColl);
  const status = useSelector((state) => state.milkCollection.allmilkstatus);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const [filteredData, setFilteredData] = useState([]);
  const [custfilterData, setCustFilteredData] = useState([]);
  const [noFilteredData, setNoFilteredData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(""); // Input for customer filtering
  const [selectedMilkType, setSelectedMilkType] = useState(""); // Added milk type filter
  const [customerName, setCustomerName] = useState(""); //.. State For customer name filter ...///
  const [selectedDay, setSelectedDay] = useState(""); //.......Days wise Milk Selection ....///
  const [isChecked, setIsChecked] = useState(false); // State to manage checkbox
  const [distinctDate, setdistinctDates] = useState("");
  const [selectedME, setSelectedME] = useState(null);
  const [sumreport, setSumreport] = useState(false); //...sum avravge sate

  useEffect(() => {
    setFilteredData(data);
    setNoFilteredData(data);
  }, [data]);

  // ---------------------------------------------------->
  // Generate master dates based on the initial date ------------------------>
  useEffect(() => {
    dispatch(generateMaster(date));
  }, [date, dispatch]);

  // ------------------------------------------>
  // Handle the report dates selection ------------------>
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

  // Handling fillter hide and show checkbox change ---------------------->
  const handleCheckboxChange = () => {
    setIsChecked((isChecked) => !isChecked);
  };

  // -------------------------------------------------->
  // Download pdf, excel and print functions------------------------->
  // >>>> PDF ----
  function exportToPDF() {
    if (filteredData.length > 0) {
      const doc = new jsPDF();
      const formatDate = (dateString) => dateString.split("T")[0];

      const fromDate =
        filteredData.length > 0
          ? formatDate(filteredData[0].ReceiptDate)
          : "N/A";
      const toDate =
        filteredData.length > 0
          ? formatDate(filteredData[filteredData.length - 1].ReceiptDate)
          : "N/A";

      const collectionCenter =
        filteredData.length > 0 ? filteredData[0].collectionCenter : "Unknown";

      // Add dairy name (centered and in red color)
      const dairyName = dairyinfo.SocietyName.toUpperCase(); // Replace with actual dairy name
      doc.setFontSize(16);
      doc.setFont("Work Sans", "bold");
      doc.setTextColor(0, 0, 0);
      const pageWidth = doc.internal.pageSize.getWidth();
      const dairyTextWidth = doc.getTextWidth(dairyName);
      const dairyXOffset = (pageWidth - dairyTextWidth) / 2; // Center align
      doc.text(dairyName, dairyXOffset, 10); // Adjusted Y-position

      // Add report name (below address)
      const reportName = "Milk Collection Report";
      doc.setFontSize(14);
      doc.setFont("Work Sans", "bold");
      const reportTextWidth = doc.getTextWidth(reportName);
      const reportXOffset = (pageWidth - reportTextWidth) / 2; // Center align
      doc.text(reportName, reportXOffset, 20); // Adjusted Y-position

      // Add detailsText (below report name)
      const detailsText = `From: ${fromDate}  To: ${toDate}`;
      doc.setFontSize(12);
      doc.setFont("Work Sans", "bold");
      doc.setTextColor(0, 0, 0); // Black color
      const detailsTextWidth = doc.getTextWidth(detailsText);
      const detailsXOffset = (pageWidth - detailsTextWidth) / 2;
      doc.text(detailsText, detailsXOffset, 30); // Adjusted Y-position

      // Add table (below details)
      const tableColumn = [
        "Code",
        "Customer",
        "Amount",
        "Liters",
        "Date",
        "Fat",
        "SNF",
        "Rate",
        "Session",
      ];

      const tableRows = filteredData.map((row) => [
        row.rno,
        row.cname,
        row.Amt,
        row.Litres,
        formatDate(row.ReceiptDate),
        row.fat,
        row.snf,
        row.rate,
        row.ME === 0 ? "Morning" : "Evening",
      ]);

      // AutoTable configuration with column-specific alignment
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40, // Table starts below the details text
        styles: {
          lineColor: [0, 0, 0], // Black border
          lineWidth: 0.1, // 0.5px border
          fontSize: 8, // Data font size
        },
        columnStyles: {
          2: { halign: "right" },
          3: { halign: "right" },
          5: { halign: "right" },
          6: { halign: "right" },
          7: { halign: "right" },
        },
      });

      // Save the PDF
      doc.save("Milkcollection.pdf");
    }
  }

  // >>>>> Excel ----
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((row, i) => ({
        Code: row.rno,
        Date: row.ReceiptDate,
        Time: row.ME,
        Animal: row.CB,
        Name: row.cname,
        Liters: row.Litres,
        Fat: row.fat,
        SNF: row.snf,
        "Rate/Liter (₹)": row.rate,
        "Amount (₹)": row.Amt,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Milk Collection");
    XLSX.writeFile(workbook, "milk-collection-report.xlsx");
  };

  // >>>> Print ----
  const PrintComponent = forwardRef((props, ref) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
    return (
      <div ref={componentRef}>
        <span className="sub-heading">Milk Collection Report</span>
        <table border="1" className="w100  d-flex-col ">
          <thead>
            <tr>
              <th className="w10 label-text">No</th>
              <th className="w10 label-text">Name</th>
              <th className="w10 label-text">Liters</th>
              <th className="w10 label-text">Fat </th>
              <th className="w10 label-text">SNF</th>
              <th className="w10 label-text">Rate/Liter</th>
              <th className="w10 label-text">Amount</th>
            </tr>
          </thead>
          <tbody className="w100 mh90 d-flex-col hidescrollbar   ">
            {props.data.map((row, index) => (
              <tr key={index}>
                <td className="w10 text">{index + 1}</td>
                <td className="w10 font">{row.cname}</td>
                <td className="w10 font">{row.Litres}</td>
                <td className="w10 font">{row.fat}</td>
                <td className="w10 font">{row.snf}</td>
                <td className="w10 font">{row.rate}</td>
                <td className="w10 font">{row.Amt.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });

  const handlePrint = () => {
    // Ensure dairyinfo and filteredData are properly populated
    const dairyName = dairyinfo?.SocietyName?.toUpperCase() || "";
    const reportName = "Milk Collection Report";

    const formatDate = (dateString) =>
      dateString ? dateString.split("T")[0] : "N/A";

    const fromDate =
      filteredData.length > 0 ? formatDate(filteredData[0].ReceiptDate) : "N/A";
    const toDate =
      filteredData.length > 0
        ? formatDate(filteredData[filteredData.length - 1].ReceiptDate)
        : "N/A";

    const detailsText = `From: ${fromDate}  To: ${toDate}`;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print</title></head><body>");

    // Add dairy name (centered and styled)
    printWindow.document.write(
      <h1 style="text-align: center; font-size: 20px; color: red;">
        ${dairyName}
      </h1>
    );

    // Add report name (centered and styled)
    printWindow.document.write(
      <h2 style="text-align: center; font-size: 14px;">${reportName}</h2>
    );

    // Add details text (centered and styled)
    printWindow.document.write(
      <p style="text-align: center; font-size: 12px; color: blue;">
        ${detailsText}
      </p>
    );

    // Add table header
    printWindow.document.write(
      "<table border='1' cellpadding='5' style='width: 100%; border-collapse: collapse;'>"
    );
    printWindow.document.write("<thead>");
    printWindow.document.write(
      "<tr style='background-color: #f2f2f2; text-align: left;'>><th>Code</th><th>Date</th>><th>Name</th><th>Liter</th><th>FAT</th><th>SNF</th><th>Rate</th><th>Amount</th></tr>"
    );
    printWindow.document.write("</thead>");
    printWindow.document.write("<tbody>");

    // Add table rows
    filteredData.forEach((row) => {
      printWindow.document.write(`<tr>
      <td>${row.rno}</td>
      <td> ${row.ReceiptDate.slice(0, 10)}</td>
      <td>${row.cname}</td>
      <td>${row.Litres}</td>
      <td>${row.fat}</td>
      <td>${row.snf}</td>
      <td>${row.rate}</td>
      <td>${row.Amt.toFixed(2)}</td>
    </tr>`);
    });

    // Close table and body
    printWindow.document.write("</tbody>");
    printWindow.document.write("</table>");
    printWindow.document.write("</body></html>");

    // Finalize and print
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  // ------------------------------------------------------------->
  // Generating Daswada Reports ---------------------------------->

  const handleSumAvgChange = () => {
    setSumreport((sumreport) => !sumreport);
  };

  const aggregateCustomerData = (data) => {
    // Group data by customer name
    const customerData = data.reduce((acc, row) => {
      if (!acc[row.cname]) {
        acc[row.cname] = {
          code: row.rno,
          cname: row.cname,
          CB: row.CB,
          totalLiters: 0,
          totalFat: 0,
          totalSNF: 0,
          totalRate: 0,
          totalAmount: 0,
          count: 0, // To calculate averages
        };
      }
      // Aggregate values for the customer
      acc[row.cname].totalLiters += row.Litres;
      acc[row.cname].totalFat += row.fat;
      acc[row.cname].totalSNF += row.snf;
      acc[row.cname].totalRate += row.rate;
      acc[row.cname].totalAmount += row.Amt;
      acc[row.cname].count += 1;
      return acc;
    }, {});

    console.log("sum data", customerData);

    // Convert the object to an array and calculate averages
    return Object.values(customerData).map((customer) => ({
      code: customer.code,
      cname: customer.cname,
      CB: customer.CB,
      Liters: customer.totalLiters.toFixed(2), // Format totalLiters for display
      fat: (customer.totalFat / customer.count).toFixed(2), // Calculate first, then format
      snf: (customer.totalSNF / customer.count).toFixed(2), // Calculate first, then format
      rate: (customer.totalRate / customer.count).toFixed(2), // Calculate first, then format
      Amt: customer.totalAmount.toFixed(2), // Format totalAmount for display
    }));
  };

  useEffect(() => {
    if (sumreport) {
      setFilteredData(aggregateCustomerData(data));
      console.log("sum avg", aggregateCustomerData(data));
    }
  }, [sumreport]);

  // --------------------------------------------->
  // fillters for data --------------------------------------------->
  // customer filter ----
  // >> Handling customer code change ----
  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };

  useEffect(() => {
    if (!selectedCustomer) {
      setFilteredData(noFilteredData);
    } else if (selectedCustomer !== "") {
      const tempData = filteredData.filter(
        (row) => row.rno.toString() === selectedCustomer
      );
      setFilteredData(tempData);
      setCustFilteredData(tempData);
    } else {
      setFilteredData(filteredData);
    }
  }, [selectedCustomer]);

  // >> Handling customer name change ----

  const handleCustomerNameChange = (e) => {
    setCustomerName(e.target.value);
  };

  useEffect(() => {
    if (!customerName) {
      setFilteredData(noFilteredData);
    } else if (customerName.trim()) {
      const updatedData = filteredData.filter((row) =>
        row.cname.toLowerCase().includes(customerName.toLowerCase())
      );
      setFilteredData(updatedData);
      setCustFilteredData(updatedData);
    }
  }, [customerName]);

  // >>>>>>>---------------------->
  // Day filter ----

  useEffect(() => {
    const distinctDates = [
      ...new Set(data.map((item) => item.ReceiptDate.slice(0, 10))),
    ];
    setdistinctDates(distinctDates);
  }, [data]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDay(selectedDate);
  };

  useEffect(() => {
    if (!selectedCustomer) {
      let updatedData = filteredData;
      if (!selectedDay) {
        setFilteredData(noFilteredData);
      } else {
        updatedData = updatedData.filter(
          (row) => row.ReceiptDate.slice(0, 10) === selectedDay
        );
        setFilteredData(updatedData);
      }
    } else {
      let updatedData = custfilterData;
      if (!selectedDay) {
        setFilteredData(noFilteredData);
      } else {
        updatedData = updatedData.filter(
          (row) => row.ReceiptDate.slice(0, 10) === selectedDay
        );
        setFilteredData(updatedData);
      }
    }
  }, [selectedDay]);

  // >>>>>>>---------------------->
  // Milk filter ----

  const handlemilktypechange = (e) => {
    setSelectedMilkType(e.target.value);
  };

  useEffect(() => {
    if (!selectedCustomer) {
      if (selectedMilkType === "0") {
        const tempData = filteredData.filter(
          (row) => row.CB.toString() === selectedMilkType
        );
        setFilteredData(tempData);
      } else if (selectedMilkType === "1") {
        const tempData = filteredData.filter(
          (row) => row.CB.toString() === selectedMilkType
        );
        setFilteredData(tempData);
      } else {
        setFilteredData(noFilteredData);
      }
    } else {
      if (selectedMilkType === "0") {
        const tempData = custfilterData.filter(
          (row) => row.CB.toString() === selectedMilkType
        );
        setFilteredData(tempData);
      } else if (selectedMilkType === "1") {
        const tempData = custfilterData.filter(
          (row) => row.CB.toString() === selectedMilkType
        );
        setFilteredData(tempData);
      } else {
        setFilteredData(custfilterData);
      }
    }
  }, [selectedMilkType]);

  // >>>>>>>---------------------->
  // Shift Filter ----

  const handleShiftChange = (e) => {
    setSelectedME(e.target.value);
  };

  useEffect(() => {
    if (!selectedCustomer) {
      if (selectedME === "0") {
        const filtered = filteredData.filter(
          (row) => row.ME.toString() === selectedME
        );
        setFilteredData(filtered);
      } else if (selectedME === "1") {
        const filtered = filteredData.filter(
          (row) => row.ME.toString() === selectedME
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(custfilterData);
      }
    } else {
      if (selectedME === "0") {
        const filtered = custfilterData.filter(
          (row) => row.ME.toString() === selectedME
        );
        setFilteredData(filtered);
      } else if (selectedME === "1") {
        const filtered = custfilterData.filter(
          (row) => row.ME.toString() === selectedME
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(custfilterData);
      }
    }
  }, [selectedME]);

  // >>>>>>>---------------------->

  return (
    <>
      <div className="Milkcollection-container w100 h1 d-flex-col sb">
        <span className="heading px10"> Milk Collection Report</span>
        <div className="fillter-data-container w100 h30 d-flex-col sb">
          <div className="master-and-buttons-div w100 d-flex px10 sb">
            <div className="custmize-report-div w30 h1 px10 d-flex a-center sb">
              <span className="cl-icon w20 h1 d-flex center info-text">
                <BsCalendar3 />
              </span>
              <select
                className="custom-select sub-heading w80 "
                onChange={handleSelectChange}>
                <option className="sub-heading w100 d-flex">
                  --{t("c-select-master")}--
                </option>
                {manualMaster.map((dates, index) => (
                  <option
                    className="sub-heading w100 d-flex  sa"
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
            <div className="fillter-checkbox-container w30 h1 d-flex a-center">
              <input
                type="checkbox"
                className="filter-check w20 h40"
                onClick={handleCheckboxChange}
              />
              <span className="info-text w70">Apply Filters</span>
            </div>
            <div className="download-option-btn-div w35 h1 d-flex j-center sa">
              <button className="w-btn text" onClick={handlePrint}>
                Print
              </button>
              <button className="w-btn text" onClick={exportToPDF}>
                PDF
              </button>
              <button className="w-btn text" onClick={exportToExcel}>
                Excel
              </button>
            </div>
          </div>
          <div className="fitter-hide-show-container w100 d-flex-col sa">
            {/* <div className="checkbox-customerwise-span w30 h10 d-flex a-center">
              <input
                type="checkbox"
                className="w20 h1"
                onClick={handleCheckboxChange}
              />
              <span className="info-text w70">Apply Filters :</span>
            </div> */}
            {isChecked && (
              <div className="heided-conatiner-div w100 h1 d-flex-col sa">
                <div className="fillter-conditions-div w100 h1 d-flex sb">
                  <div className="custmoer-number-no w45 h50 d-flex a-center px10 sb">
                    <label htmlFor="code" className="info-text w30">
                      Customer :
                    </label>
                    <div className="customer-name-customer-number-div w70 d-flex j-end sb">
                      <input
                        type="text"
                        className="w25 data"
                        name="code"
                        id="code"
                        onChange={handleCustomerChange}
                        placeholder="Code"
                      />
                      <input
                        type="text"
                        className="w70 data"
                        name="name"
                        id="name"
                        value={customerName}
                        onChange={handleCustomerNameChange}
                        placeholder=" Customer Name"
                      />
                    </div>
                  </div>
                  <div className="days-selection-div w45 h50 h1 d-flex center px10 sb">
                    <label htmlFor="daywise" className="info-text w30">
                      Day wise :
                    </label>
                    {/* <div className="days-selection-input-div w70 d-flex j-end px10"> */}
                    <select
                      name="daywise"
                      id="daywise"
                      className="w50 data"
                      value={selectedDay}
                      onChange={handleDateChange}>
                      <option value="">Select a Date</option>
                      {distinctDate.map((dates, index) => (
                        <option key={index} value={dates}>
                          {dates}
                        </option>
                      ))}
                    </select>
                    {/* </div> */}
                  </div>
                </div>
                <div className="fillter-conditions-div1 w100 h50 d-flex px10 sb">
                  <div className="filter-condition-divs w30  h1 d-flex center sb">
                    <label htmlFor="animal" className="info-text w40">
                      Milk Type :
                    </label>
                    {/* <div
                      className="select-div-shift-wise w70 h1 d-flex a-center j-end px10"> */}
                    <select
                      className="data w50"
                      name="animal"
                      id="animal"
                      onChange={handlemilktypechange}>
                      <option className="text " value="2">
                        Cow-bufflow
                      </option>
                      <option className="text" value="0">
                        Cow
                      </option>
                      <option className="text" value="1">
                        Bufflow
                      </option>
                    </select>
                    {/* </div> */}
                  </div>
                  <div className="filter-condition-divs w30 h1 d-flex center sb">
                    <label htmlFor="milktype" className="info-text w30">
                      Shift Wise :
                    </label>
                    {/* <div className="select-div-shift-wise w70 h1 d-flex j-end px10"> */}
                    {/* <div className="select-div-shift-wise w60 h1 d-flex a-center"> */}
                    <select
                      className="data w50"
                      name="milktype"
                      id="milktype"
                      onChange={handleShiftChange}>
                      <option className="text" value="2">
                        Morning-Evening
                      </option>
                      <option className="text" value="0">
                        Morning
                      </option>
                      <option className="text" value="1">
                        Evening
                      </option>
                    </select>
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                  <div className="filter-condition-divs w20 h1 d-flex center">
                    <div className="milk-type-div w100 h1 d-flex a-center sb">
                      <input
                        type="checkbox"
                        className="filter-check w20 h40"
                        onClick={handleSumAvgChange}
                      />
                      <span className="info-text w80">Daswada Report :</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="hided-conatiner-div w100 h60 d-flex-col sb">
            <div className="fillter-conditions-div w100 h50 d-flex sb">
              <div className="custmoer-number-no w50  h1 d-flex center sb">
                <div className="checkbox-customerwise-span w30 h1 d-flex a-center">
                  <input
                    type="checkbox"
                    className="w20 h30"
                    onClick={handleCheckcustomer}
                  />
                  <span className="info-text w70">Customer :</span>
                </div>
                {customer && (
                  <div className="customer-name-customer-number-div w70 d-flex j-end px10 sb">
                    <input
                      type="text"
                      className="w25 data"
                      name="code"
                      onChange={handleCustomerChange}
                      placeholder="Code"
                    />
                    <input
                      type="text"
                      className="w70  data"
                      name="code"
                      value={customerName}
                      onChange={handleCustomerNameChange}
                      placeholder=" Customer Name"
                    />
                  </div>
                )}
              </div>
              <div className="days-selection-div w50 h1 d-flex center px10 sb">
                <div className="day-seleaction-div w30 h1 d-flex a-center sb">
                  <input
                    type="checkbox"
                    className="w20 h30"
                    onClick={handleDatesChange}
                  />
                  <span className="info-text w70">Day wise :</span>
                </div>

                {dateChecked && (
                  <div className="days-selection-input-div w70 d-flex j-end px10">
                    <select
                      name="daywise"
                      id="daywise-select"
                      className="w60 data"
                      value={selectedDay}
                      onChange={handleDateChange}>
                      <option value="">Select a Date</option>
                      {distinctDate.map((dates, index) => (
                        <option key={index} value={dates}>
                          {dates}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="fillter-conditions-div1 w100 h50 d-flex px10 sb">
              <div className="filter-condition-divs w30 h1 d-flex center ">
                <div className="milk-type-div w40 h1 d-flex a-center">
                  <input
                    type="checkbox"
                    className="w20 h30"
                    onClick={handleCheckAnimal}
                  />
                  <span className="info-text w80">Animal Wise :</span>
                </div>
                <div
                  className="select-div-shift-wise w70 h1
                   d-flex a-center j-end px10">
                  {animal && (
                    <select
                      className="data w80"
                      name="milk"
                      id="001"
                      onChange={handlemilktypechange}>
                      <option className="text " value="all">
                        Cow-bufflow
                      </option>
                      <option className="text" value="0">
                        Cow
                      </option>
                      <option className="text" value="1">
                        Bufflow
                      </option>
                    </select>
                  )}
                </div>
              </div>
              <div className="filter-condition-divs w30 h1 d-flex center">
                <div className="checkbox-and-shiftwise-div w30 h1 d-flex a-center sb">
                  <input
                    type="checkbox"
                    className="w20 h30"
                    checked={time}
                    onClick={handleCheckTime}
                  />
                  <span className="info-text w70">Shift Wise:</span>
                </div>
                <div className="select-div-shift-wise w70 h1 d-flex j-end px10">
                  {time && (
                    <div className="select-div-shift-wise w60 h1 d-flex a-center">
                      <select
                        className="data w100"
                        name="milk"
                        id="001"
                        value={selectedME === null ? "all" : selectedME}
                        onChange={handleFilterChange}>
                        <option className="text" value="all">
                          Morning-Evening
                        </option>
                        <option className="text" value="0">
                          Morning
                        </option>
                        <option className="text" value="1">
                          Evening
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="filter-condition-divs w20 h1 d-flex center">
                <div className="milk-type-div w100 h1 d-flex a-center sb">
                  <input
                    type="checkbox"
                    className="w20 h30"
                    onClick={handleSumAvgChange}
                  />
                  <span className="info-text w80">Daswada Report:</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="Milk-collection-report-container w100 h70 d-flex-col bg">
          <span className="heading p10">Milk Collection</span>
          <div className="Milk-report-heading w100 h1 mh100 d-flex-col hidescrollbar">
            <div className="milkdata-headings-div w100 h10 py10 d-flex center t-center sa bg1">
              {sumreport ? (
                <>
                  <span className="w10 f-info-text">Code</span>
                  <span className="w25 f-info-text">Name</span>
                  <span className="w5 f-info-text">AVG Fat </span>
                  <span className="w5 f-info-text">AVG SNF</span>
                  <span className="w10 f-info-text">Liters</span>
                  <span className="w10 f-info-text">AVG Rate</span>
                  <span className="w10 f-info-text">Total Amount</span>
                  <span className="w10 f-info-text">C/B</span>
                </>
              ) : (
                <>
                  <span className="w10 f-label-text">Date</span>
                  <span className="w5 f-label-text">M/E</span>
                  <span className="w5 f-label-text">Code</span>
                  <span className="w25 f-label-text">Name</span>
                  <span className="w5 f-label-text">Liters</span>
                  <span className="w5 f-label-text">Fat</span>
                  <span className="w5 f-label-text">SNF</span>
                  <span className="w10 f-label-text">Rate/ltr</span>
                  <span className="w5 f-label-text">Amount</span>
                  <span className="w5 f-label-text">C/B</span>
                </>
              )}
            </div>
            {sumreport ? (
              <>
                {status === "loading" ? (
                  <Spinner />
                ) : filteredData.length > 0 ? (
                  filteredData.map((customer, index) => (
                    <div
                      key={index}
                      className={`milkdata-div w100 h10 d-flex center t-center sa ${
                        index % 2 === 0 ? "bg-light" : "bg-dark"
                      }`}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                      }}>
                      <span className="w10 text t-center">{customer.code}</span>
                      <span className="w25 text t-start">{customer.cname}</span>
                      <span className="w5 text t-center">{customer.fat}</span>
                      <span className="w5 text t-center">{customer.snf}</span>
                      <span className="w10 text t-end">{customer.Liters}</span>
                      <span className="w10 text t-center">{customer.rate}</span>
                      <span className="w10 text t-end">{customer.Amt}</span>
                      <span className="w10 text t-center">
                        {customer.CB === 0 ? "Cow" : "Buffalo"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w100 h1 d-flex center">Data not found!</div>
                )}
              </>
            ) : (
              <>
                {status === "loading" ? (
                  <Spinner />
                ) : filteredData.length > 0 ? (
                  filteredData.map((customer, index) => (
                    <div
                      key={index}
                      className={`milkdata-div w100 h10 d-flex center t-center sa ${
                        index % 2 === 0 ? "bg-light" : "bg-dark"
                      }`}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                      }}>
                      {/* <div className="milkdata-div w100 h10 d-flex center sa"> */}
                      <span className="w10 text t-center">
                        {customer.ReceiptDate.slice(0, 10)}
                      </span>
                      <span className="w5 text t-center">
                        {customer.ME === 0 ? "Mrg" : "Eve"}
                      </span>
                      <span className="w5 text t-center">{customer.rno}</span>
                      <span className="w25 text t-start">{customer.cname}</span>
                      <span className="w5 text t-end">{customer.Litres}</span>
                      <span className="w5 text t-center">{customer.fat}</span>
                      <span className="w5 text t-center">{customer.snf}</span>
                      <span className="w10 text t-center">{customer.rate}</span>
                      <span className="w5 text t-end">{customer.Amt}</span>
                      <span className="w5 text t-center">
                        {customer.CB === 0 ? "COW" : "Buffalo"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w100 h1 d-flex center">Data not found!</div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="download-option-btn-div-426 w100 h1 my10 d-flex j-center sa">
          <button className="w-btn text" onClick={handlePrint}>
            Print
          </button>
          <button className="w-btn text" onClick={exportToPDF}>
            PDF
          </button>
          <button className="w-btn text" onClick={exportToExcel}>
            Excel
          </button>
        </div>

        {/* <table
          border="1"
          className="perticuler-days-milk-collection-table-div w100 h70 d-flex-col bg">
          <thead>
            {sumreport ? (
              <tr className="perticuler-milk-collection-sub-div w100 d-flex a-center">
                <th className="w5 info-text">Code</th>
                <th className="w10 info-text">Liters</th>
                <th className="w5 info-text">AVG Fat </th>
                <th className="w5 info-text">AVG SNF</th>
                <th className="w30 info-text">Name</th>
                <th className="w10 info-text">AVG Rate</th>
                <th className="w15 info-text">Total Amount</th>
                <th className="w5 info-text">C/B</th>
              </tr>
            ) : (
              <tr className="perticuler-milk-collection-sub-div w100  d-flex ">
                <th className="w10 info-text">Date</th>
                <th className="w5 info-text">M/E</th>
                <th className="w5 info-text">Code</th>
                <th className="w30 info-text">Name</th>
                <th className="w5 info-text">Liters</th>
                <th className="w5 info-text">Fat</th>
                <th className="w5 info-text">SNF</th>
                <th className="w10 info-text">Rate/ltr</th>
                <th className="w15 info-text">Amount</th>
                <th className="w5 info-text">C/B</th>
              </tr>
            )}
          </thead>
          <tbody className="perticuler-milk-collection-div-table-data-div w100 mh90 hidescrollbar d-flex-col">
            {sumreport ? (
              <>
                {filteredData.map((customer, index) => (
                  <tr
                    key={index}
                    className="perticuler-milk-collection-sub-div w100 h10 d-flex">
                    <td className="w5 text">{customer.rno}</td>
                    <td className="w10 text">{customer.totalLiters}</td>
                    <td className="w5 text">{customer.averageFat}</td>
                    <td className="w5 text">{customer.averageSNF}</td>
                    <td className="w30 text t-center">{customer.cname}</td>
                    <td className="w10 text t-end">{customer.averageRate}</td>
                    <td className="w15 text t-end">{customer.totalAmount}</td>
                    <th className="w5 info-text">
                      {customer.CB === 0 ? "C" : "B"}
                    </th>
                  </tr>
                ))}
              </>
            ) : (
              <>
                {filteredData.map((customer, index) => (
                  <tr
                    key={index}
                    className="perticuler-milk-collection-sub-div w100 h10 d-flex">
                    <th className="w10 info-text">
                      {customer.ReceiptDate
                        ? customer.ReceiptDate.slice(0, 10)
                        : "NA"}
                    </th>
                    <th className="w5 info-text">
                      {customer.ME === 0 ? "M" : "E"}
                    </th>
                    <td className="w5 text">{customer.rno || "N/A"}</td>
                    <td className="w5 text">{customer.Litres || "0.00"}</td>
                    <td className="w5 text">{customer.fat || "0.00"}</td>
                    <td className="w5 text">{customer.snf || "0.00"}</td>
                    <td className="w30 text t-start">
                      {customer.cname || "Unknown"}
                    </td>
                    <td className="w10 text">{customer.rate || "0.00"}</td>
                    <td className="w15 text">
                      {customer.Amt ? customer.Amt.toFixed(2) : "0.00"}
                    </td>
                    <th className="w5 info-text">
                      {customer.CB === 0 ? "C" : "B"}
                    </th>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table> */}
      </div>
    </>
  );
};

export default MilkcollectionReports;
