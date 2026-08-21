import { useCallback, useMemo, useRef, useState } from 'react';
import { DEFAULT_ROW_COUNT } from '../constants/donation';
import type { DonationRow, EditableDonationField } from '../types/donation';
import { loadRowsFromFile, saveRowsToFile } from '../utils/file';
import type { LoadRowsResult, SaveRowsResult } from '../utils/file';
import { createEmptyRow, createEmptyRows, isRowEmpty } from '../utils/row';

export interface UseDonationRowsResult {
  rows: DonationRow[];
  /** 마지막으로 저장하거나 불러온 시점 이후 변경 사항이 있는지 여부 */
  isDirty: boolean;
  addRows: (count: number) => void;
  insertRowBelow: (rowId: string) => void;
  removeRow: (rowId: string) => void;
  removeEmptyRows: () => void;
  updateCell: (rowId: string, field: EditableDonationField, value: string) => void;
  resetAll: () => void;
  saveToFile: () => Promise<SaveRowsResult>;
  loadFromFile: () => Promise<LoadRowsResult>;
}

/**
 * 부조금 대장 행 상태와 편집 로직을 담당하는 훅.
 *
 * 이 앱은 새로고침 시 항상 기본 10행에서 시작한다. 화면의 내용을 보존하려면
 * saveToFile()로 JSON 파일에 저장해야 하고, 이전 내용을 다시 보려면
 * loadFromFile()로 저장된 파일을 불러와야 한다. 즉 초기화/삭제/추가/수정은
 * 모두 화면(메모리) 상의 변경일 뿐이며, 저장 파일 자체는 저장 버튼을 눌러야만 바뀐다.
 */
export function useDonationRows(): UseDonationRowsResult {
  const [rows, setRows] = useState<DonationRow[]>(() => createEmptyRows(DEFAULT_ROW_COUNT));
  const [savedSnapshot, setSavedSnapshot] = useState<string>(() => JSON.stringify(rows));
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);

  const isDirty = useMemo(() => JSON.stringify(rows) !== savedSnapshot, [rows, savedSnapshot]);

  const addRows = useCallback((count: number) => {
    setRows((prev) => [...prev, ...createEmptyRows(count)]);
  }, []);

  const insertRowBelow = useCallback((rowId: string) => {
    setRows((prev) => {
      const index = prev.findIndex((row) => row.id === rowId);
      if (index === -1) return prev;
      const next = [...prev];
      next.splice(index + 1, 0, createEmptyRow());
      return next;
    });
  }, []);

  const removeRow = useCallback((rowId: string) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId));
  }, []);

  const removeEmptyRows = useCallback(() => {
    setRows((prev) => prev.filter((row) => !isRowEmpty(row)));
  }, []);

  const updateCell = useCallback(
    (rowId: string, field: EditableDonationField, value: string) => {
      setRows((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
      );
    },
    [],
  );

  const resetAll = useCallback(() => {
    setRows(createEmptyRows(DEFAULT_ROW_COUNT));
  }, []);

  const saveToFile = useCallback(async (): Promise<SaveRowsResult> => {
    const result = await saveRowsToFile(rows, fileHandleRef);
    if (result === 'saved' || result === 'unsupported') {
      setSavedSnapshot(JSON.stringify(rows));
    }
    return result;
  }, [rows]);

  const loadFromFile = useCallback(async (): Promise<LoadRowsResult> => {
    const result = await loadRowsFromFile(fileHandleRef);
    if (result.status === 'loaded') {
      setRows(result.rows);
      setSavedSnapshot(JSON.stringify(result.rows));
    }
    return result;
  }, []);

  return {
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
  };
}
