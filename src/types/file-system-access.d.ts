// TypeScript의 기본 DOM 라이브러리는 File System Access API 중
// FileSystemFileHandle/FileSystemWritableFileStream 등은 포함하지만
// window.showSaveFilePicker / window.showOpenFilePicker 는 아직 포함하지 않는다.
// 저장 파일을 같은 위치에 덮어쓰기 위해 필요한 최소 타입만 보강한다.
export {};

declare global {
  interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string | string[]>;
  }

  interface FilePickerOptions {
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
  }

  interface SaveFilePickerOptions extends FilePickerOptions {
    suggestedName?: string;
  }

  interface OpenFilePickerOptions extends FilePickerOptions {
    multiple?: boolean;
  }

  interface Window {
    showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
    showOpenFilePicker?(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
  }
}
