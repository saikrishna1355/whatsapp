import { reportService } from './report.service';
import { generateReportPDF } from './report.pdf';
import { reportLogRepository } from './report-log.repository';
import { toDateStr } from '../../utils/date';

export interface GeneratedReport {
  buffer: Buffer;
  filename: string;
}

export async function buildReport(
  phoneNumber: string,
  userId: number,
  period: 'today' | 'week',
  dateFrom: string,
  dateTo: string,
): Promise<GeneratedReport> {
  const from = toDateStr(dateFrom);
  const to = toDateStr(dateTo);

  const reportData = await reportService.generate(phoneNumber, period, from, to);
  const buffer = await generateReportPDF(reportData, from, to);
  const filename = `report-${phoneNumber}-${Date.now()}.pdf`;

  await reportLogRepository.insert(userId, period, from, to);

  return { buffer, filename };
}
