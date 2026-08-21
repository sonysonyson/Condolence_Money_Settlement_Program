import type { DonationRow } from '../types/donation';
import { isDonationRowLike } from './row';

const JSON_FILE_NAME = '부조금_데이터.json';
const JSON_ACCEPT: Record<string, string[]> = { 'application/json': ['.json'] };

export type SaveRowsResult = 'saved' | 'cancelled' | 'unsupported' | 'failed';
export type LoadRowsResult =
  | { status: 'loaded'; rows: DonationRow[] }
  | { status: 'cancelled' }
  | { status: 'invalid' };

/** 현재 브라우저가 파일을 같은 위치에 덮어쓸 수 있는 File System Access API를 지원하는지 확인한다. */
function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.showSaveFilePicker === 'function' &&
    typeof window.showOpenFilePicker === 'function'
  );
}

function downloadJsonFile(json: string, fileName: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/** File System Access API를 지원하지 않는 브라우저를 위한 대체 수단: <input type="file"> */
function pickFileViaInput(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    // 일부 브라우저(및 자동화 환경)는 DOM에 붙어 있지 않은 input의 클릭을 무시하므로
    // 화면에 보이지 않게 붙여둔 뒤 선택이 끝나면 정리한다.
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = () => {
      resolve(input.files?.[0] ?? null);
      input.remove();
    };
    // 일부 브라우저는 취소 시 change 이벤트를 주지 않는다. 그 경우 호출부는 계속 대기하지 않고
    // 사용자의 다음 행동을 기다리게 되며, 별도 타임아웃 없이도 앱 동작에는 문제가 없다.
    input.click();
  });
}

/**
 * 현재 행 목록을 JSON 파일로 저장한다.
 * File System Access API를 지원하는 브라우저(Chrome/Edge 등)에서는 한 번 지정한 파일 위치에
 * 계속 덮어쓰기 저장하고, 지원하지 않는 브라우저에서는 매번 새 파일을 다운로드한다.
 */
export async function saveRowsToFile(
  rows: DonationRow[],
  fileHandleRef: { current: FileSystemFileHandle | null },
): Promise<SaveRowsResult> {
  const json = JSON.stringify(rows, null, 2);

  if (!isFileSystemAccessSupported() || !window.showSaveFilePicker) {
    downloadJsonFile(json, JSON_FILE_NAME);
    return 'unsupported';
  }

  try {
    let handle = fileHandleRef.current;
    if (!handle) {
      handle = await window.showSaveFilePicker({
        suggestedName: JSON_FILE_NAME,
        types: [{ description: 'JSON 파일', accept: JSON_ACCEPT }],
      });
    }

    const writable = await handle.createWritable();
    await writable.write(json);
    await writable.close();

    fileHandleRef.current = handle;
    return 'saved';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'cancelled';
    }
    // 저장 위치 핸들이 더 이상 유효하지 않을 수 있으므로 초기화해서 다음 저장 시 다시 선택하게 한다.
    fileHandleRef.current = null;
    return 'failed';
  }
}

/**
 * JSON 파일을 선택해서 행 목록을 불러온다.
 * File System Access API를 지원하는 브라우저에서는 선택한 파일 핸들을 기억해 두어,
 * 이후 저장 시 같은 파일에 이어서 덮어쓸 수 있게 한다.
 */
export async function loadRowsFromFile(
  fileHandleRef: { current: FileSystemFileHandle | null },
): Promise<LoadRowsResult> {
  let file: File | null = null;

  if (isFileSystemAccessSupported() && window.showOpenFilePicker) {
    try {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [{ description: 'JSON 파일', accept: JSON_ACCEPT }],
      });
      fileHandleRef.current = handle;
      file = await handle.getFile();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { status: 'cancelled' };
      }
      return { status: 'invalid' };
    }
  } else {
    file = await pickFileViaInput();
    if (!file) return { status: 'cancelled' };
  }

  try {
    const text = await file.text();
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed) || !parsed.every(isDonationRowLike)) {
      return { status: 'invalid' };
    }
    return { status: 'loaded', rows: parsed };
  } catch {
    return { status: 'invalid' };
  }
}
