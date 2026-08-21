import { useMemo } from 'react';
import { DonationTable } from './components/DonationTable';
import { SummaryBar } from './components/SummaryBar';
import { Toolbar } from './components/Toolbar';
import { useDonationRows } from './hooks/useDonationRows';
import { downloadRowsAsCsv } from './utils/csv';
import { sumAmounts } from './utils/number';

function App() {
  const {
    rows,
    isDirty,
    addRows,
    insertRowBelow,
    removeRow,
    removeEmptyRows,
    updateCell,
    resetAll,
    saveToFile,
    loadFromFile,
  } = useDonationRows();

  const totalAmount = useMemo(() => sumAmounts(rows), [rows]);

  const handleSave = async () => {
    const result = await saveToFile();
    if (result === 'failed') {
      window.alert('저장에 실패했습니다. 다시 시도해주세요.');
    } else if (result === 'unsupported') {
      window.alert('이 브라우저는 파일 덮어쓰기를 지원하지 않아 새 파일로 다운로드했습니다.');
    }
  };

  const handleLoad = async () => {
    if (
      isDirty &&
      !window.confirm('저장하지 않은 변경 사항이 있습니다. 불러오면 현재 화면 내용이 사라집니다. 계속할까요?')
    ) {
      return;
    }

    const result = await loadFromFile();
    if (result.status === 'invalid') {
      window.alert('올바른 데이터 파일이 아닙니다.');
    }
  };

  const handleDownloadCsv = () => {
    downloadRowsAsCsv(rows);
  };

  return (
    <div className="min-h-screen bg-canvas pb-24">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
          <h1 className="text-lg font-semibold text-ink sm:text-xl">부조금 정산</h1>
          <p className="mt-1 text-sm text-ink-muted">경조사비 명단을 정리하고 합계를 확인하세요.</p>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-5 sm:px-6">
        <Toolbar
          isDirty={isDirty}
          onAddRows={addRows}
          onRemoveEmptyRows={removeEmptyRows}
          onReset={resetAll}
          onSave={handleSave}
          onLoad={handleLoad}
          onDownloadCsv={handleDownloadCsv}
        />

        <DonationTable
          rows={rows}
          onChangeField={updateCell}
          onInsertBelow={insertRowBelow}
          onRemove={removeRow}
        />
      </main>

      <SummaryBar rowCount={rows.length} totalAmount={totalAmount} />
    </div>
  );
}

export default App;
