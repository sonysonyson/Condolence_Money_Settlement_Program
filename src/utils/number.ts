import type { DonationRow } from '../types/donation';

/** 입력값에서 숫자가 아닌 문자를 모두 제거한다. (금액 입력 정규화) */
export function sanitizeAmountInput(rawValue: string): string {
  return rawValue.replace(/[^0-9]/g, '');
}

/** 숫자 문자열을 천 단위 콤마가 포함된 표시용 문자열로 변환한다. */
export function formatAmount(digitsOnly: string): string {
  if (digitsOnly === '') return '';
  const numeric = Number(digitsOnly);
  if (Number.isNaN(numeric)) return '';
  return numeric.toLocaleString('ko-KR');
}

/** 전체 행의 금액 합계를 계산한다. */
export function sumAmounts(rows: DonationRow[]): number {
  return rows.reduce((total, row) => total + (Number(row.amount) || 0), 0);
}
