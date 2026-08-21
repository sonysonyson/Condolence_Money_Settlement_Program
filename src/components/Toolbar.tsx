import { ADD_ROW_OPTIONS } from '../constants/donation';
import { Button } from './common/Button';

interface ToolbarProps {
  isDirty: boolean;
  onAddRows: (count: number) => void;
  onRemoveEmptyRows: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  onDownloadCsv: () => void;
}

/** 행 추가 / 일괄 삭제 / 초기화 / 불러오기 / 저장 / CSV 다운로드 등 상단 조작 영역 */
export function Toolbar({
  isDirty,
  onAddRows,
  onRemoveEmptyRows,
  onReset,
  onSave,
  onLoad,
  onDownloadCsv,
}: ToolbarProps) {
  const handleReset = () => {
    if (window.confirm('입력한 모든 내용을 초기화할까요? 저장하지 않은 변경 사항은 복구할 수 없습니다.')) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-ink-subtle">행 추가</span>
        {ADD_ROW_OPTIONS.map((count) => (
          <Button key={count} size="sm" onClick={() => onAddRows(count)}>
            +{count}
          </Button>
        ))}
        <Button size="sm" variant="danger" onClick={onRemoveEmptyRows}>
          빈 행 일괄 삭제
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="ghost" onClick={handleReset}>
          초기화
        </Button>
        <Button size="sm" variant="secondary" onClick={onLoad}>
          데이터 불러오기
        </Button>
        <Button size="sm" variant="secondary" onClick={onDownloadCsv}>
          최종 다운로드
        </Button>
        <Button size="sm" variant="primary" onClick={onSave}>
          {isDirty ? '데이터 저장' : '저장됨'}
        </Button>
      </div>
    </div>
  );
}
