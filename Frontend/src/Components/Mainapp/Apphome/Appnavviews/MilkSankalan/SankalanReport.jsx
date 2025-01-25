import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDownload, FaFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { mobileMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { RiFileExcel2Fill } from "react-icons/ri";
import Spinner from "../../../../Home/Spinner/Spinner";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import { getProfileInfo } from "../../../../../App/Features/Mainapp/Profile/ProfileSlice";

const SankalanReport = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  //redux states
  const collectorname = useSelector((state) => state.userinfo.profile.emp_name);
  const tDate = useSelector((state) => state.date.toDate);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  // const tDate = useSelector((state) => state.date.toDate);
  const mobileMilkReport = useSelector(
    (state) => state.milkCollection.mobileColl
  );
  const status = useSelector((state) => state.milkCollection.milkstatus);

  //local states
  const [period, setPeriod] = useState("2");
  const [filteredData, setFilteredData] = useState([]);

  const initialValues = {
    date: localStorage.getItem("today") || tDate,
  };

  const [values, setValues] = useState(initialValues);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // // Validate field and update errors state
    // const fieldError = validateField(name, value);
    // setErrors((prevErrors) => ({
    //   ...prevErrors,
    //   ...fieldError,
    // }));
  };

  useEffect(() => {
    setFilteredData(mobileMilkReport);
  }, []);

  const calculateTotalLiters = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.Litres), 0);
  };

  const records = filteredData.length;
  const totalLiters = calculateTotalLiters(filteredData);
  console.log(filteredData);

  // Function to download Excel file
  const downloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel (excluding automatic headers)
    const excelData = filteredData.map((collection) => [
      collection.rno,
      collection.cname,
      collection.Litres,
      collection.SampleNo,
    ]);

    // Add headings manually
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Code", "Customer Name", "Liters", "Sample No.", "FAT", "SNF"],
      ...excelData,
      [],
      ["Total Liters", "=", totalLiters.toFixed(2)],
    ]);

    // Get current date and time for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Mobile_Milk_Collection_${formattedDate}.xlsx`;

    // Create a workbook and export it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, fileName);
  };

  const downloadPDF = () => {
    if (filteredData.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    // Create a new PDF instance
    const doc = new jsPDF();

    // Define page width for horizontal centering
    const pageWidth = doc.internal.pageSize.getWidth();

    // Dairy name, report name, date, and shift
    const dairyName = dairyname; // Replace with your actual dairy name
    const reportName = "Mobile Milk Collection Report";
    const Dates = values.date;
    const milkcollector = collectorname;

    // Shift based on period (0: morning, 1: evening, 2: all day)
    const shift =
      period === 0 ? "Morning" : period === 1 ? "Evening" : "All Day";

    // Add title and metadata to the PDF
    doc.setFontSize(14);
    doc.text(reportName, pageWidth / 2, 10, { align: "center" }); // Dairy name

    doc.setFontSize(12);

    doc.text(dairyName, pageWidth / 2, 16, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text(milkcollector, pageWidth / 2, 24, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text(Dates, 15, 24, {
      align: "left",
    });

    // Prepare data for the table
    const tableData = filteredData.map((collection) => [
      collection.rno,
      collection.ME === 0 ? "M" : "E",
      collection.cname,
      collection.Litres.toFixed(2),
      collection.SampleNo,
    ]);

    // Table headers
    const tableHeaders = [
      "Code",
      "ME",
      "Customer Name",
      "Liters",
      "Sample No.",
      "Update Liters",
      "FAT",
      "SNF",
    ];

    // Add table to the PDF
    doc.setFontSize(10);
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 28, // Table starts after the header
      styles: { fontSize: 10 }, // Font size for table
    });

    // Calculate totals and add a summary row
    const totalLiters = filteredData.reduce(
      (sum, item) => sum + item.Litres,
      0
    );
    doc.text(
      `Total Sample: ${records}, Total Liters: ${totalLiters.toFixed(2)}`,
      pageWidth / 2,
      doc.lastAutoTable.finalY + 10,
      { align: "center" }
    );

    // Get current date for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Mobile_Milk_Collection_${formattedDate}.pdf`;

    // Save the PDF
    doc.save(fileName);
  };

  const handleMilkColletorData = (e) => {
    e.preventDefault();
    dispatch(mobileMilkCollReport({ date: values.date }));
  };

  useEffect(() => {
    dispatch(mobileMilkCollReport({ date: values.date }));
  }, [dispatch, values.date]);

  useEffect(() => {
    if (period === "0") {
      setFilteredData(mobileMilkReport.filter((item) => item.ME === 0));
    } else if (period === "1") {
      setFilteredData(mobileMilkReport.filter((item) => item.ME === 1));
    } else {
      setFilteredData(mobileMilkReport);
    }
  }, [period, mobileMilkReport]);

  return (
    <div className="mobile-milk-collection-report w100 h1 d-flex-col center sa">
      <div className="page-title-button-div w70 h10 d-flex a-center sb">
        <label className="heading w60">
          {t("milkcollection:m-milk-coll-report")}
        </label>
        <button className="btn" onClick={downloadPDF}>
          <span className="f-heading px10">PDF</span>
          <FaFilePdf className="d-icons" />
        </button>
        <button className="btn" onClick={downloadExcel}>
          <span className="f-heading px10">
            {t("milkcollection:m-d-excel")}
          </span>
          <RiFileExcel2Fill className="d-icons" />
        </button>
      </div>
      <form
        onSubmit={handleMilkColletorData}
        className="fetch-sankalan-div w70 h10 d-flex a-center sb">
        <div className="input-date-div w65 d-flex a-center sb">
          <label htmlFor="date" className="label-text w30 t-center">
            {t("milkcollection:m-s-date")}
          </label>
          <input
            className="w60 data"
            type="date"
            name="date"
            id="date"
            value={values.date || ""}
            onChange={handleInputs}
          />
          {/* <button className="heading btn ">
            {t("milkcollection:m-d-show")}
          </button> */}
        </div>
        <div className="input-date-div w40 d-flex a-center">
          <label htmlFor="period" className="label-text w40 t-center">
            {t("milkcollection:m-s-shift")}
          </label>
          <select
            className="w60 data"
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}>
            <option value="2">All</option>
            <option value="0">Morning</option>
            <option value="1">Evening</option>
          </select>
        </div>
      </form>
      <div className="milk-collection-info-div w70 h70 d-flex-col sa bg">
        <div className="collection-info-heading w100 h10 d-flex a-center t-center sa bg1">
          <span className="f-label-text w10">
            {t("milkcollection:m-cust-code")}
          </span>
          <span className="f-label-text w40">
            {t("milkcollection:m-cust-name")}
          </span>
          <span className="f-label-text w10">{t("c-liters")}</span>
          <span className="f-label-text w20">
            {" "}
            {t("milkcollection:m-sample-no")}
          </span>
        </div>
        <div className="milk-collection-data-div w100 d-flex-col h90 mh90 hidescrollbar">
          {status === "loading" ? (
            <div className="w100 h80 d-flex center">
              <Spinner />
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((collection, index) => (
              <div
                key={index}
                className={`collection-info-heading w100 h10 d-flex a-center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}>
                <span className="text w10">{collection.rno}</span>
                <span className="text w40 t-center">{collection.cname}</span>
                <span className="text w10">{collection.Litres}</span>
                <span className="text w20">{collection.SampleNo}</span>
              </div>
            ))
          ) : (
            <div className="w100 h1 d-flex center">
              <span className="label-text">{t("c-no-data-avai")}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mobile-milk-btns w100 h10 d-flex a-center j-center sa">
        <span className="heading py10">
          {t("milkcollection:m-count")} : {records}
        </span>
        <span className="heading py10">
          {t("milkcollection:m-t-liters")} : {totalLiters.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default SankalanReport;
