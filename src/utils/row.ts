import type { DonationRow } from '../types/donation';
import { generateRowId } from './id';

/** 비어 있는 행 1개를 생성한다. */
export function createEmptyRow(): DonationRow {
  return {
    id: generateRowId(),
    name: '',
    affiliation: '',
    amount: '',
    relation: '',
    note: '',
  };
}

/** 비어 있는 행 여러 개를 생성한다. */
export function createEmptyRows(count: number): DonationRow[] {
  return Array.from({ length: count }, () => createEmptyRow());
}

/** '번호'를 제외한 모든 값이 비어 있는 행인지 판단한다. */
export function isRowEmpty(row: DonationRow): boolean {
  return (
    row.name.trim() === '' &&
    row.affiliation.trim() === '' &&
    row.amount.trim() === '' &&
    row.relation.trim() === '' &&
    row.note.trim() === ''
  );
}

/** 파일 등 외부에서 불러온 값이 DonationRow 형태를 갖추고 있는지 검사한다. */
export function isDonationRowLike(value: unknown): value is DonationRow {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.affiliation === 'string' &&
    typeof row.amount === 'string' &&
    typeof row.relation === 'string' &&
    typeof row.note === 'string'
  );
}
