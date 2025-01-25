import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (fromDate, toDate, milkReport, summary) => {
  const doc = new jsPDF();

  // Add a title
  doc.setFontSize(18);
  doc.text("Milk Collection Report", 14, 22);

  // Add the date range
  doc.setFontSize(12);
  doc.text(`Date: From: ${fromDate} To: ${toDate}`, 14, 32);

  // Define the table columns
  const columns = [
    { header: "Date", dataKey: "date" },
    { header: "M/E", dataKey: "me" },
    { header: "C/B", dataKey: "cb" },
    { header: "Liters", dataKey: "liters" },
    { header: "FAT", dataKey: "fat" },
    { header: "SNF", dataKey: "snf" },
    { header: "Rate", dataKey: "rate" },
    { header: "Amount", dataKey: "amount" },
  ];

  // Map the milk report data into rows
  const rows = milkReport.map((report) => ({
    date: new Date(report.ReceiptDate).toLocaleDateString(),
    me: report.ME,
    cb: report.CB,
    liters: report.Litres,
    fat: report.fat,
    snf: report.snf,
    rate: report.Rate,
    amount: report.Amt,
  }));

  // Add the table to the PDF
  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
    startY: 40,
  });

  // Add summary data below the table
  doc.autoTable({
    head: [
      [
        "Total",
        "   ",
        "   ",
        summary.totalLiters,
        summary.avgFat,
        summary.avgSNF,
        summary.avgRate,
        summary.totalAmount,
      ],
    ],
    body: [],
    startY: doc.lastAutoTable.finalY + 10, // Start after the previous table
    theme: "plain",
    styles: {
      fontStyle: "bold",
      halign: "right",
    },
    columnStyles: {
      0: { halign: "left" }, // Align "Total" label to the left
      4: { halign: "right" }, // Align summary values to the right
    },
  });

  // Save the PDF
  doc.save(`Milk_Report_${fromDate}_to_${toDate}.pdf`);
};
