import { COLUMN_LABELS } from '../constants/donation';
import type { DonationRow, EditableDonationField } from '../types/donation';
import { DonationTableRow } from './DonationTableRow';

interface DonationTableProps {
  rows: DonationRow[];
  onChangeField: (rowId: string, field: EditableDonationField, value: string) => void;
  onInsertBelow: (rowId: string) => void;
  onRemove: (rowId: string) => void;
}

/** 부조금 대장 표. 열이 많으므로 좁은 화면에서는 가로 스크롤로 확인한다. */
export function DonationTable({ rows, onChangeField, onInsertBelow, onRemove }: DonationTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-canvas/70 text-xs font-medium text-ink-muted">
            <th className="w-14 px-2 py-2.5 text-center">{COLUMN_LABELS.index}</th>
            <th className="min-w-[7rem] px-3 py-2.5 text-left">{COLUMN_LABELS.name}</th>
            <th className="min-w-[7rem] px-3 py-2.5 text-left">{COLUMN_LABELS.affiliation}</th>
            <th className="min-w-[8rem] px-3 py-2.5 text-right">{COLUMN_LABELS.amount}</th>
            <th className="min-w-[6rem] px-3 py-2.5 text-left">{COLUMN_LABELS.relation}</th>
            <th className="min-w-[8rem] px-3 py-2.5 text-left">{COLUMN_LABELS.note}</th>
            <th className="w-20 px-2 py-2.5 text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-subtle">
                행이 없습니다. 상단의 행 추가 버튼을 눌러주세요.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <DonationTableRow
                key={row.id}
                row={row}
                index={index}
                onChangeField={onChangeField}
                onInsertBelow={onInsertBelow}
                onRemove={onRemove}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
