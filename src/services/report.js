const PDFDocument = require("pdfkit");

const LEFT = 40;
const TABLE_WIDTH = 480;
const ROW_HEIGHT = 25;

function generateReportPDF({ period, date, incomes, expenses, totalIncome, totalExpense, profit }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const label = period === "week" ? "Weekly Report" : "Daily Report";

    // Title
    doc.fontSize(18).font("Helvetica-Bold").text(label, LEFT, doc.y, { width: TABLE_WIDTH, align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica").text(`Date: ${date}`, LEFT, doc.y, { width: TABLE_WIDTH, align: "center" });
    doc.moveDown(1.5);

    // Summary
    doc.fontSize(13).font("Helvetica-Bold").text("Summary", LEFT, doc.y);
    doc.moveDown(0.5);
    drawSummaryTable(doc, totalIncome, totalExpense, profit);
    doc.moveDown(1.5);

    // Income
    doc.fontSize(13).font("Helvetica-Bold").text("Income", LEFT, doc.y);
    doc.moveDown(0.5);
    drawDataTable(doc, incomes);
    doc.moveDown(1.5);

    // Expenses
    doc.fontSize(13).font("Helvetica-Bold").text("Expenses", LEFT, doc.y);
    doc.moveDown(0.5);
    drawDataTable(doc, expenses);

    doc.end();
  });
}

function drawSummaryTable(doc, totalIncome, totalExpense, profit) {
  const colLabel = LEFT + 5;
  const colValue = LEFT + TABLE_WIDTH - 105;
  const colValueWidth = 100;
  let y = doc.y;

  // Header
  doc.rect(LEFT, y, TABLE_WIDTH, ROW_HEIGHT).fill("#f0f0f0").stroke("#cccccc");
  doc.fillColor("#000000").fontSize(10).font("Helvetica-Bold");
  doc.text("Description", colLabel, y + 7);
  doc.text("Amount", colValue, y + 7, { width: colValueWidth, align: "right" });
  y += ROW_HEIGHT;

  const rows = [
    { label: "Total Income", value: totalIncome },
    { label: "Total Expense", value: totalExpense },
    { label: "Profit", value: profit },
  ];

  for (let i = 0; i < rows.length; i++) {
    const bg = i % 2 === 0 ? "#ffffff" : "#f9f9f9";
    const isProfit = i === rows.length - 1;

    doc.rect(LEFT, y, TABLE_WIDTH, ROW_HEIGHT).fill(bg).stroke("#cccccc");
    doc.fillColor("#000000").fontSize(10).font(isProfit ? "Helvetica-Bold" : "Helvetica");
    doc.text(rows[i].label, colLabel, y + 7);
    doc.text(String(rows[i].value), colValue, y + 7, { width: colValueWidth, align: "right" });
    y += ROW_HEIGHT;
  }

  doc.y = y;
}

function drawDataTable(doc, data) {
  const colDate = LEFT + 5;
  const colDesc = LEFT + 120;
  const colAmt = LEFT + TABLE_WIDTH - 105;
  const colAmtWidth = 100;
  let y = doc.y;

  // Header
  doc.rect(LEFT, y, TABLE_WIDTH, ROW_HEIGHT).fill("#f0f0f0").stroke("#cccccc");
  doc.fillColor("#000000").fontSize(10).font("Helvetica-Bold");
  doc.text("Date", colDate, y + 7);
  doc.text("Description", colDesc, y + 7);
  doc.text("Amount", colAmt, y + 7, { width: colAmtWidth, align: "right" });
  y += ROW_HEIGHT;

  if (!data.length) {
    doc.rect(LEFT, y, TABLE_WIDTH, ROW_HEIGHT).stroke("#cccccc");
    doc.fontSize(10).font("Helvetica").fillColor("#666666");
    doc.text("No records found", LEFT + 5, y + 7, { width: TABLE_WIDTH - 10, align: "center" });
    doc.fillColor("#000000");
    y += ROW_HEIGHT;
    doc.y = y;
    return;
  }

  doc.fontSize(10).font("Helvetica").fillColor("#000000");

  for (let i = 0; i < data.length; i++) {
    const bg = i % 2 === 1 ? "#f9f9f9" : "#ffffff";
    doc.rect(LEFT, y, TABLE_WIDTH, ROW_HEIGHT).fill(bg).stroke("#cccccc");
    doc.fillColor("#000000");
    doc.text(data[i].date, colDate, y + 7);
    doc.text(data[i].description, colDesc, y + 7);
    doc.text(String(data[i].amount), colAmt, y + 7, { width: colAmtWidth, align: "right" });
    y += ROW_HEIGHT;
  }

  doc.y = y;
}

module.exports = { generateReportPDF };
