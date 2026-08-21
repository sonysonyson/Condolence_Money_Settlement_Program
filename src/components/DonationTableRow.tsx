import type { ChangeEvent } from 'react';
import type { DonationRow, EditableDonationField } from '../types/donation';
import { formatAmount, sanitizeAmountInput } from '../utils/number';

interface DonationTableRowProps {
  row: DonationRow;
  index: number;
  onChangeField: (rowId: string, field: EditableDonationField, value: string) => void;
  onInsertBelow: (rowId: string) => void;
  onRemove: (rowId: string) => void;
}

const TEXT_INPUT_CLASS =
  'w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-subtle hover:border-border focus:border-brand focus:bg-surface';

export function DonationTableRow({ row, index, onChangeField, onInsertBelow, onRemove }: DonationTableRowProps) {
  const handleTextChange = (field: EditableDonationField) => (event: ChangeEvent<HTMLInputElement>) => {
    onChangeField(row.id, field, event.target.value);
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeField(row.id, 'amount', sanitizeAmountInput(event.target.value));
  };

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-canvas/60">
      <td className="w-14 px-2 py-1 text-center text-sm tabular-nums text-ink-subtle">{index + 1}</td>
      <td className="min-w-[7rem] px-1 py-1">
        <input
          className={TEXT_INPUT_CLASS}
          value={row.name}
          onChange={handleTextChange('name')}
          placeholder="이름"
        />
      </td>
      <td className="min-w-[7rem] px-1 py-1">
        <input
          className={TEXT_INPUT_CLASS}
          value={row.affiliation}
          onChange={handleTextChange('affiliation')}
          placeholder="소속"
        />
      </td>
      <td className="min-w-[8rem] px-1 py-1">
        <input
          className={`${TEXT_INPUT_CLASS} text-right tabular-nums`}
          value={formatAmount(row.amount)}
          onChange={handleAmountChange}
          inputMode="numeric"
          placeholder="0"
        />
      </td>
      <td className="min-w-[6rem] px-1 py-1">
        <input
          className={TEXT_INPUT_CLASS}
          value={row.relation}
          onChange={handleTextChange('relation')}
          placeholder="관계"
        />
      </td>
      <td className="min-w-[8rem] px-1 py-1">
        <input
          className={TEXT_INPUT_CLASS}
          value={row.note}
          onChange={handleTextChange('note')}
          placeholder="비고"
        />
      </td>
      <td className="w-20 px-2 py-1">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onInsertBelow(row.id)}
            title="아래에 행 추가"
            aria-label="아래에 행 추가"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-brand-soft hover:text-brand"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => onRemove(row.id)}
            title="이 행 삭제"
            aria-label="이 행 삭제"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-danger-soft hover:text-danger"
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
}
