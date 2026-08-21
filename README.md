# 부조금 정산

경조사비(부조금) 명단을 정리하고 합계를 확인하는 로컬 전용 웹앱입니다. 서버/DB 없이, 사용자가 지정한 JSON 파일 하나에 데이터를 저장합니다.

**배포**: https://sonysonyson.github.io/Condolence_Money_Settlement_Program/ (main 브랜치에 푸시하면 GitHub Actions가 자동으로 빌드/배포합니다. 워크플로: [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml))

## 실행

```bash
npm install
npm run dev
```

- `npm run build` — 타입체크 후 프로덕션 빌드
- `npm run lint` — oxlint 검사
- `npm run preview` — 빌드 결과 미리보기

## 기능

- 표 컬럼: 번호 · 이름 · 소속 · 금액 · 관계 · 비고
- 상단 툴바에서 행을 1 / 10 / 50 / 100개씩 추가
- 번호를 제외한 값이 모두 비어 있는 행만 골라 지우는 "빈 행 일괄 삭제"
- 각 행마다 개별 추가(바로 아래에 삽입) / 삭제 버튼 — 번호는 항상 순서대로 자동 재계산
- 화면 하단에 고정된 합계 영역 (스크롤해도 항상 보임)
- 금액은 숫자만 입력되도록 정규화하고, 화면에는 천 단위 콤마로 표시
- "최종 다운로드" — CSV로 내보내기 (엑셀 호환 UTF-8 BOM 포함)
- **데이터 저장** — 화면의 내용을 JSON 파일로 저장합니다. Chrome/Edge 등 File System Access API를 지원하는 브라우저에서는 최초 저장 시 저장 위치를 한 번 지정하면, 이후에는 같은 파일에 덮어씁니다. 지원하지 않는 브라우저에서는 매번 새 파일로 다운로드됩니다.
- **데이터 불러오기** — 이전에 저장한 JSON 파일을 선택해서 화면에 불러옵니다. 지원 브라우저에서는 이때 선택한 파일이 이후 "데이터 저장"의 대상 파일이 됩니다.
- 새로고침하면 항상 기본 10행에서 다시 시작합니다. 이전 내용을 보려면 "데이터 불러오기"로 저장 파일을 열어야 합니다.
- 초기화·삭제·추가·수정은 모두 화면(메모리)에서만 일어나는 변경이며, "데이터 저장"을 누르기 전까지는 저장 파일이 바뀌지 않습니다.

## 폴더 구조

```
src/
  types/       도메인 타입 (DonationRow 등) + File System Access API 보강 타입
  constants/   컬럼 라벨, 기본 행 개수 등 상수
  utils/       숫자 포맷/파싱, CSV 변환, JSON 파일 저장/불러오기 등 순수 함수
  hooks/       화면 상태와 편집 로직 (useDonationRows)
  components/  화면(뷰) 컴포넌트 — Toolbar, DonationTable, SummaryBar 등
```

로직(hooks/utils)과 화면(components), 스타일(디자인 토큰은 `src/index.css`의 `@theme`)을 분리해서, 디자인이나 화면 구성만 바꿀 때 로직을 건드리지 않아도 되도록 구성했습니다.
