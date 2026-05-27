import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import type { ReportData, ReportEntry } from './report.types';

const PAGE_MARGIN = 34;
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN * 2;
const CARD_GAP = 10;
const KPI_CARD_WIDTH = (CONTENT_WIDTH - CARD_GAP * 3) / 4;
const BRAND_NAME = 'WAU Business Assistant';
const BRAND_LOGO_PATH = '/home/administrator/whatsapp/whatsapp/brand-placeholder.svg';

function money(n: number): string {
  return `Rs ${n.toFixed(2)}`;
}

function formatDateOnly(value: string | Date): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function formatDateCompact(value: string | Date): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yy} ${hh}:${min}`;
}

function ensureSpace(doc: PDFKit.PDFDocument, needed = 40): void {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

function drawHeader(doc: PDFKit.PDFDocument, data: ReportData, dateFrom: string, dateTo: string): void {
  const x = PAGE_MARGIN;
  const y = doc.y;
  const h = 116;

  doc.roundedRect(x, y, CONTENT_WIDTH, h, 14).fill('#0f4c5c');
  const logoX = x + 16;
  const logoY = y + 14;
  const logoW = 30;
  const logoH = 30;
  let titleX = x + 16;

  if (fs.existsSync(BRAND_LOGO_PATH)) {
    const ext = path.extname(BRAND_LOGO_PATH).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      doc.image(BRAND_LOGO_PATH, logoX, logoY, { fit: [logoW, logoH] });
      titleX = logoX + logoW + 10;
    } else {
      doc.roundedRect(logoX, logoY, logoW, logoH, 6).fill('#ffffff');
      doc.fillColor('#0f4c5c').font('Helvetica-Bold').fontSize(9).text('LOGO', logoX, logoY + 11, {
        width: logoW,
        align: 'center',
      });
      titleX = logoX + logoW + 10;
    }
  }

  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(18).text(BRAND_NAME, titleX, y + 14);
  doc.fillColor('#ffffff').font('Helvetica').fontSize(11).text('Business Report', titleX, y + 38);
  doc.font('Helvetica').fontSize(10).fillColor('#d9eef3');
  doc.text(data.period === 'week' ? 'Weekly Financial Summary' : 'Daily Financial Summary', titleX, y + 56);
  doc.text(`Period: ${dateFrom}  to  ${dateTo}`, x + 16, y + 76);
  doc.text(`Generated: ${new Date().toLocaleString()}`, x + 16, y + 92);

  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(24).text(money(data.profit), x, y + 22, {
    width: CONTENT_WIDTH - 16,
    align: 'right',
  });
  doc.font('Helvetica').fontSize(10).fillColor('#d9eef3').text('Net Profit', x, y + 60, {
    width: CONTENT_WIDTH - 16,
    align: 'right',
  });
  doc.y = y + h + 10;
}

function drawKpiCards(doc: PDFKit.PDFDocument, data: ReportData): void {
  ensureSpace(doc, 92);
  const y = doc.y;
  const items = [
    { label: 'Income', value: money(data.totalIncome), bg: '#e8f7ee', fg: '#1e6a37' },
    { label: 'Expense', value: money(data.totalExpense), bg: '#fff1f0', fg: '#96352b' },
    { label: 'Profit', value: money(data.profit), bg: '#e9f3ff', fg: '#1b4f9e' },
    {
      label: 'Margin',
      value: data.totalIncome > 0 ? `${((data.profit / data.totalIncome) * 100).toFixed(1)}%` : '0%',
      bg: '#f2efff',
      fg: '#5b3fa3',
    },
  ];

  items.forEach((item, i) => {
    const x = PAGE_MARGIN + i * (KPI_CARD_WIDTH + CARD_GAP);
    doc.roundedRect(x, y, KPI_CARD_WIDTH, 72, 10).fill(item.bg);
    doc.fillColor(item.fg).font('Helvetica-Bold').fontSize(17).text(item.value, x + 10, y + 18, {
      width: KPI_CARD_WIDTH - 20,
      align: 'left',
    });
    doc.fillColor('#44515c').font('Helvetica').fontSize(10).text(item.label, x + 10, y + 48);
  });
  doc.y = y + 84;
}

function drawSectionTitle(doc: PDFKit.PDFDocument, title: string): void {
  ensureSpace(doc, 28);
  doc.fillColor('#1c2733').font('Helvetica-Bold').fontSize(13).text(title, PAGE_MARGIN, doc.y);
  doc.moveDown(0.4);
}

function summarizeByDescription(data: ReportEntry[], topN = 5): Array<{ description: string; amount: number }> {
  const map = new Map<string, number>();
  for (const row of data) {
    const key = row.description.trim();
    map.set(key, (map.get(key) || 0) + Number(row.amount));
  }
  return [...map.entries()]
    .map(([description, amount]) => ({ description, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, topN);
}

function drawTopItems(doc: PDFKit.PDFDocument, title: string, items: Array<{ description: string; amount: number }>, tone: 'income' | 'expense'): void {
  ensureSpace(doc, 130);
  const x = PAGE_MARGIN;
  const y = doc.y;
  const w = CONTENT_WIDTH;
  const h = 116;
  const barColor = tone === 'income' ? '#2a9d60' : '#c23e3e';

  doc.roundedRect(x, y, w, h, 10).fill('#f8fafc');
  doc.fillColor('#1c2733').font('Helvetica-Bold').fontSize(11).text(title, x + 12, y + 10);

  if (!items.length) {
    doc.fillColor('#6b7280').font('Helvetica').fontSize(10).text('No data available', x + 12, y + 38);
    doc.y = y + h + 8;
    return;
  }

  const maxAmount = Math.max(...items.map((i) => i.amount), 1);
  items.slice(0, 4).forEach((item, i) => {
    const rowY = y + 30 + i * 20;
    const barX = x + 180;
    const barW = Math.max(8, ((w - 270) * item.amount) / maxAmount);
    doc.fillColor('#374151').font('Helvetica').fontSize(9).text(item.description, x + 12, rowY, { width: 160 });
    doc.roundedRect(barX, rowY + 2, barW, 10, 4).fill(barColor);
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(9).text(money(item.amount), x + w - 90, rowY, { width: 78, align: 'right' });
  });

  doc.y = y + h + 8;
}

function summarizeByDate(entries: ReportEntry[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of entries) {
    const d = formatDateOnly(e.date);
    m.set(d, (m.get(d) || 0) + Number(e.amount));
  }
  return m;
}

function drawDailySummary(doc: PDFKit.PDFDocument, incomes: ReportEntry[], expenses: ReportEntry[]): void {
  drawSectionTitle(doc, 'Daily Summary');
  ensureSpace(doc, 140);

  const inc = summarizeByDate(incomes);
  const exp = summarizeByDate(expenses);
  const days = [...new Set([...inc.keys(), ...exp.keys()])].sort();
  const x = PAGE_MARGIN;
  const y = doc.y;
  const rowH = 20;
  const tableH = 24 + Math.max(1, days.length) * rowH;

  doc.roundedRect(x, y, CONTENT_WIDTH, tableH, 10).fill('#ffffff').stroke('#dbe4ee');
  doc.fillColor('#4b5563').font('Helvetica-Bold').fontSize(9);
  doc.text('Date', x + 12, y + 8);
  doc.text('Income', x + 220, y + 8, { width: 100, align: 'right' });
  doc.text('Expense', x + 340, y + 8, { width: 100, align: 'right' });
  doc.text('Profit', x + 460, y + 8, { width: 90, align: 'right' });

  if (!days.length) {
    doc.fillColor('#6b7280').font('Helvetica').text('No records found', x + 12, y + 30);
    doc.y = y + tableH + 10;
    return;
  }

  days.forEach((d, i) => {
    const yy = y + 24 + i * rowH;
    if (i % 2 === 1) doc.rect(x + 1, yy, CONTENT_WIDTH - 2, rowH).fill('#f8fafc');
    const iAmt = inc.get(d) || 0;
    const eAmt = exp.get(d) || 0;
    const p = iAmt - eAmt;

    doc.fillColor('#111827').font('Helvetica').fontSize(9).text(d, x + 12, yy + 5);
    doc.text(money(iAmt), x + 220, yy + 5, { width: 100, align: 'right' });
    doc.text(money(eAmt), x + 340, yy + 5, { width: 100, align: 'right' });
    doc.fillColor(p >= 0 ? '#166534' : '#b91c1c').font('Helvetica-Bold').text(money(p), x + 460, yy + 5, { width: 90, align: 'right' });
  });

  doc.y = y + tableH + 10;
}

function drawDetailTable(doc: PDFKit.PDFDocument, title: string, rows: ReportEntry[]): void {
  drawSectionTitle(doc, title);
  ensureSpace(doc, 80);
  const x = PAGE_MARGIN;
  let y = doc.y;
  const rowH = 20;

  const drawHeader = () => {
    doc.roundedRect(x, y, CONTENT_WIDTH, 22, 8).fill('#eef2f7');
    doc.fillColor('#4b5563').font('Helvetica-Bold').fontSize(9);
    doc.text('Date', x + 10, y + 7, { width: 120 });
    doc.text('Description', x + 130, y + 7, { width: 285 });
    doc.text('Amount', x + 430, y + 7, { width: 90, align: 'right' });
    y += 24;
  };

  drawHeader();
  if (!rows.length) {
    doc.fillColor('#6b7280').font('Helvetica').fontSize(10).text('No records found', x + 10, y + 6);
    doc.y = y + 18;
    return;
  }

  rows.forEach((r, i) => {
    ensureSpace(doc, 26);
    if (doc.y !== y) y = doc.y;
    if (i % 2 === 0) doc.rect(x, y, CONTENT_WIDTH, rowH).fill('#fbfdff');
    doc.fillColor('#111827').font('Helvetica').fontSize(9);
    doc.text(formatDateCompact(r.date), x + 10, y + 6, { width: 120, lineBreak: false, ellipsis: true });
    doc.text(r.description, x + 130, y + 6, { width: 285, ellipsis: true });
    doc.text(money(Number(r.amount)), x + 430, y + 6, { width: 90, align: 'right' });
    y += rowH;

    if (y + 30 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      y = doc.page.margins.top;
      drawHeader();
    }
  });
  doc.y = y + 6;
}

export function generateReportPDF(data: ReportData, dateFrom: string, dateTo: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: PAGE_MARGIN });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    drawHeader(doc, data, dateFrom, dateTo);
    drawKpiCards(doc, data);
    drawSectionTitle(doc, 'Highlights');
    drawTopItems(doc, 'Top Income Items', summarizeByDescription(data.incomes), 'income');
    drawTopItems(doc, 'Top Expense Items', summarizeByDescription(data.expenses), 'expense');
    if (data.period === 'week') {
      drawDailySummary(doc, data.incomes, data.expenses);
    }
    drawDetailTable(doc, 'Income Transactions', data.incomes);
    drawDetailTable(doc, 'Expense Transactions', data.expenses);

    doc.moveDown(0.8);
    doc.font('Helvetica').fontSize(8).fillColor('#6b7280').text('Generated by WAU Business Assistant', PAGE_MARGIN, doc.y, {
      width: CONTENT_WIDTH,
      align: 'center',
    });
    doc.end();
  });
}
