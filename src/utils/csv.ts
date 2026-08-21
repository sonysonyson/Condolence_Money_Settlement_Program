import { CSV_FILE_NAME, COLUMN_LABELS } from '../constants/donation';
import type { DonationRow } from '../types/donation';

const CSV_HEADERS = [
  COLUMN_LABELS.index,
  COLUMN_LABELS.name,
  COLUMN_LABELS.affiliation,
  COLUMN_LABELS.amount,
  COLUMN_LABELS.relation,
  COLUMN_LABELS.note,
];

function escapeCsvField(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/** 행 목록을 CSV 문자열로 변환한다. '번호'는 현재 순번으로 계산해서 채운다. */
export function rowsToCsv(rows: DonationRow[]): string {
  const lines = [CSV_HEADERS.join(',')];

  rows.forEach((row, index) => {
    const fields = [
      String(index + 1),
      row.name,
      row.affiliation,
      row.amount,
      row.relation,
      row.note,
    ];
    lines.push(fields.map(escapeCsvField).join(','));
  });

  return lines.join('\r\n');
}

/** 행 목록을 CSV 파일로 다운로드한다. (엑셀 한글 호환을 위해 UTF-8 BOM을 붙인다) */
export function downloadRowsAsCsv(rows: DonationRow[], fileName: string = CSV_FILE_NAME): void {
  const csvContent = rowsToCsv(rows);
  const BOM = '﻿';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
