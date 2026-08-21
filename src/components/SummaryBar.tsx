interface SummaryBarProps {
  rowCount: number;
  totalAmount: number;
}

/** 화면을 스크롤해도 항상 하단에 고정되어 합계 금액을 보여주는 영역 */
export function SummaryBar({ rowCount, totalAmount }: SummaryBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-sm text-ink-muted">
          총 <span className="font-medium text-ink">{rowCount.toLocaleString('ko-KR')}</span>건
        </span>
        <span className="text-base font-semibold text-ink sm:text-lg">
          합계 <span className="text-brand">{totalAmount.toLocaleString('ko-KR')}</span>원
        </span>
      </div>
    </div>
  );
}
