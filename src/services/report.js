const PDFDocument = require("pdfkit");

function generateReportPDF({ period, date, incomes, expenses, totalIncome, totalExpense, profit }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const label = period === "week" ? "Weekly" : "Today's";

    // Title
    doc.fontSize(20).font("Helvetica-Bold").text(`📊 ${label} Report`, { align: "center" });
    doc.fontSize(10).font("Helvetica").text(`Generated: ${date}`, { align: "center" });
    doc.moveDown(1.5);

    // Summary
    doc.fontSize(14).font("Helvetica-Bold").text("Summary");
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica");
    doc.text(`Total Income:   $${totalIncome}`);
    doc.text(`Total Expense:  $${totalExpense}`);
    doc.text(`Profit:         $${profit}`);
    doc.moveDown(1.5);

    // Income table
    if (incomes.length) {
      doc.fontSize(14).font("Helvetica-Bold").text("Income");
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Date", 40, doc.y, { continued: true, width: 100 });
      doc.text("Description", 140, doc.y, { continued: true, width: 250 });
      doc.text("Amount", 400, doc.y, { align: "right" });
      doc.moveDown(0.3);
      doc.font("Helvetica");
      for (const item of incomes) {
        doc.text(item.date, 40, doc.y, { continued: true, width: 100 });
        doc.text(item.description, 140, doc.y, { continued: true, width: 250 });
        doc.text(`$${item.amount}`, 400, doc.y, { align: "right" });
        doc.moveDown(0.2);
      }
      doc.moveDown(1);
    }

    // Expense table
    if (expenses.length) {
      doc.fontSize(14).font("Helvetica-Bold").text("Expenses");
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Date", 40, doc.y, { continued: true, width: 100 });
      doc.text("Description", 140, doc.y, { continued: true, width: 250 });
      doc.text("Amount", 400, doc.y, { align: "right" });
      doc.moveDown(0.3);
      doc.font("Helvetica");
      for (const item of expenses) {
        doc.text(item.date, 40, doc.y, { continued: true, width: 100 });
        doc.text(item.description, 140, doc.y, { continued: true, width: 250 });
        doc.text(`$${item.amount}`, 400, doc.y, { align: "right" });
        doc.moveDown(0.2);
      }
    }

    doc.end();
  });
}

module.exports = { generateReportPDF };
