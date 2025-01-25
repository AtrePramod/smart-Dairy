import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf } from "react-icons/fa6";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getAllMilkSankalan,
  mobileMilkCollReport,
} from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";
import { listEmployee } from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import { RiFileExcel2Fill } from "react-icons/ri";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const MilkCollectorsReports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const dairy_name = useSelector((state) => state.dairy.dairyData.SocietyName);
  // State selectors
  const tDate = useSelector((state) => state.date.toDate);
  const milkData = useSelector(
    (state) => state.milkCollection.allMilkCollector || []
  );
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails || []
  );

  const Emplist = useSelector((state) => state.emp.emplist || []);

  // Local states
  const [errors, setErrors] = useState({});
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [selectedEmp, setSelectedEmp] = useState("");
  const [filteredMilkData, setFilteredMilkData] = useState([]);
  const [selectedCenterName, setSelectedCenterName] = useState("");
  const [selectedEmpName, setSelectedEmpName] = useState("");
  const [values, setValues] = useState({ fromDate: "", toDate: "" });

  useEffect(() => {
    setFilteredMilkData(milkData);
    dispatch(listEmployee());
    dispatch(mobileMilkCollReport());
  }, [dispatch]);

  useEffect(() => {
    setFilteredMilkData(milkData);
  }, [milkData]);

  useEffect(() => {
    if (selectedEmp) {
      const filteredData = milkData.filter(
        (data) => data.userid === selectedEmp
      );
      setFilteredMilkData(filteredData);
    } else {
      setFilteredMilkData(milkData);
    }
  }, [selectedEmp]);

  const milkCollectors = useMemo(() => {
    return Emplist.filter(
      (emp) =>
        emp.center_id.toString() === selectedCenterId &&
        emp.designation === "mobilecollector"
    );
  }, [selectedCenterId, Emplist]);

  const handleCenterChange = (event) => {
    const selectedCenterId = event.target.value;
    const selectedCenter = centerList.find(
      (center) => center.center_id.toString() === selectedCenterId
    );
    setSelectedCenterName(selectedCenter ? selectedCenter.center_name : "");
    setSelectedCenterId(selectedCenterId);
  };

  const handleCollectorChange = (event) => {
    const selectedEmp = event.target.value;
    const selectedEmpname = Emplist.find(
      (emp) => emp.emp_mobile.toString() === selectedEmp
    );
    setSelectedEmpName(selectedEmpname ? selectedEmpname.emp_name : "");
    setSelectedEmp(selectedEmp);
  };

  const validateField = (name, value) => {
    let error = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      error[name] = "Invalid date format.";
    } else {
      delete errors[name];
    }
    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = ["fromDate", "toDate"];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });
    setErrors(validationErrors);
    return validationErrors;
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, ...fieldError }));
  };

  const handleShowData = (e) => {
    e.preventDefault();
    if (Object.keys(validateFields()).length === 0) {
      dispatch(
        getAllMilkSankalan({ fromDate: values.fromDate, toDate: values.toDate })
      );
    }
  };

  const downloadExcel = () => {
    if (filteredMilkData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const excelData = filteredMilkData.map((collection) => [
      collection.rno,
      collection.cname,
      collection.Litres,
      collection.SampleNo,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Code",
        "Customer Name",
        "Liters",
        "Sample No.",
        "Update Liters",
        "FAT",
        "SNF",
      ],
      ...excelData,
      [],
      ["Total Liters", "=", calculateTotalLiters(filteredMilkData).toFixed(2)],
    ]);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Milk Collection Report");

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Save the workbook as a file
    XLSX.writeFile(wb, `Mobile_Milk_Collection_Report_${formattedDate}.xlsx`);
  };

  const downloadPDF = () => {
    if (filteredMilkData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    // Set title
    doc.setFontSize(12);
    doc.text(
      "Mobile Milk Collection Report",
      doc.internal.pageSize.getWidth() / 2,
      10,
      { align: "center" }
    );

    // Add dairy name centered
    doc.setFontSize(14);
    doc.text(dairy_name, doc.internal.pageSize.getWidth() / 2, 18, {
      align: "center",
    });

    // Add center name centered
    doc.setFontSize(12);
    doc.text(selectedCenterName, doc.internal.pageSize.getWidth() / 2, 24, {
      align: "center",
    });
    // Add center name centered
    doc.setFontSize(12);
    doc.text(selectedEmpName, doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    // Add date
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDate}`, 14, 34);

    // Define table headers and rows
    const headers = [
      [
        "Code",
        "Customer Name",
        "Liters",
        "Sample No.",
        "Update Liters",
        "FAT",
        "SNF",
      ],
    ];

    const data = filteredMilkData.map((collection) => [
      collection.rno,
      collection.cname,
      collection.Litres,
      collection.SampleNo,
    ]);

    // Add table
    doc.autoTable({
      startY: 38,
      head: headers,
      body: data,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    // Add total liters
    doc.setFontSize(10);
    doc.text(
      `Total Samples: ${
        filteredMilkData.length
      } , Total Liters: ${calculateTotalLiters(filteredMilkData).toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    // Save the PDF
    doc.save(`Mobile_Milk_Collection_Report_${formattedDate}.pdf`);
  };

  const calculateTotalLiters = (data) =>
    data.reduce((total, item) => total + parseFloat(item.Litres), 0);

  return (
    <div className="milk-collector-reports w100 h1 d-flex-col sb">
      <div className="select-milk-collector-conatiner w100 h20 d-flex a-center sb px10">
        <form
          onSubmit={handleShowData}
          className="form-label-select-div w50 d-flex-col a-center j-start">
          <label htmlFor="date" className="label-text w100">
            Select Dates
          </label>
          <div className="dates-btn-container w100 h1 d-flex a-center sb">
            <div className="dates-container w80 h1 d-flex a-center sb">
              <input
                className={`data w45 ${errors.fromDate ? "input-error" : ""}`}
                type="date"
                name="fromDate"
                id="fromDate"
                onChange={handleInputs}
                required
                max={tDate}
              />
              <label htmlFor="toDate" className="label-text px10">
                To
              </label>
              <input
                className={`data w45 ${errors.toDate ? "input-error" : ""}`}
                type="date"
                name="toDate"
                id="toDate"
                onChange={handleInputs}
                required
                max={tDate}
              />
            </div>
            <button type="submit" className="btn">
              Show
            </button>
          </div>
        </form>
        <div className="selectand-btn-div w50 h1 d-flex a-center j-start sa">
          <div className="label-select-div w60 d-flex-col a-center j-start sa">
            <select
              className="data w100 h50 my5"
              id="center"
              value={selectedCenterId}
              onChange={handleCenterChange}>
              <option value="">--Select Center--</option>
              {centerList.map((center, i) => (
                <option key={i} value={center.center_id}>
                  {center.center_name}
                </option>
              ))}
            </select>
            <select
              className="data w100 h50"
              id="milk-collector"
              value={selectedEmp}
              onChange={handleCollectorChange}>
              <option value="">--Select Collector--</option>
              {milkCollectors.map((emp, i) => (
                <option key={i} value={emp.emp_mobile}>
                  {emp.emp_name}
                </option>
              ))}
            </select>
          </div>
          <div className="collection-download-btn w30 h1 d-flex-col sa">
            <button className="btn" onClick={downloadPDF}>
              <span className="f-heading px10">PDF</span>
              <FaFilePdf />
            </button>
            <button className="btn" onClick={downloadExcel}>
              <span className="f-heading px10">
                {t("milkcollection:m-d-excel")}
              </span>
              <RiFileExcel2Fill />
            </button>
          </div>
        </div>
      </div>
      <div className="milkdata-container w100 h80 d-flex-col mh90 hidescrollbar bg">
        <div className="milkdata-data-headings w100 h10 d-flex a-center t-center sa py10 bg1">
          <span className="f-label-text w10">Code</span>
          <span className="f-label-text w60">Customer Name</span>
          <span className="f-label-text w10">Liters</span>
          <span className="f-label-text w20">SampleNo.</span>
        </div>
        <div className="milkdata-card-container w100 d-flex-col hidescrollbar">
          {filteredMilkData.map((milkdata, index) => (
            <div
              key={index}
              className={`milkdata-card w100 d-flex a-center sa ${
                index % 2 === 0 ? "bg-light" : "bg-dark"
              }`}
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}>
              <span className="label-text w10 t-center">{milkdata.rno}</span>
              <span className="label-text w60">{milkdata.cname}</span>
              <span className="label-text w10 t-center">{milkdata.Litres}</span>
              <span className="label-text w20 t-center">
                {milkdata.SampleNo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilkCollectorsReports;
