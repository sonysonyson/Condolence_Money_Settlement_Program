/** localStorage에 저장할 때 사용하는 키 */
export const STORAGE_KEY = 'bujogeum-settlement:rows:v1';

/** 초기/초기화 시 기본으로 채워지는 행 개수 */
export const DEFAULT_ROW_COUNT = 10;

/** 한 번에 여러 행을 추가하는 버튼들의 옵션 */
export const ADD_ROW_OPTIONS = [1, 10, 50, 100] as const;

/** CSV로 내보낼 때 사용할 파일명 */
export const CSV_FILE_NAME = '부조금_정산.csv';

/** 테이블 헤더에 표시되는 컬럼 라벨 (번호 포함, 화면 표시 순서) */
export const COLUMN_LABELS = {
  index: '번호',
  name: '이름',
  affiliation: '소속',
  amount: '금액',
  relation: '관계',
  note: '비고',
} as const;
