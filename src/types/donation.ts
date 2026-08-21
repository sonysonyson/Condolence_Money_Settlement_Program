/** 부조금 대장의 한 행(row)을 표현하는 데이터 모델 */
export interface DonationRow {
  /** 렌더링/편집 식별용 내부 id. 화면에 표시되는 '번호'와는 별개다. */
  id: string;
  /** 이름 */
  name: string;
  /** 소속 */
  affiliation: string;
  /** 금액. 콤마 없이 숫자 문자만 저장한다 (예: "1000000"). */
  amount: string;
  /** 관계 */
  relation: string;
  /** 비고 */
  note: string;
}

/** 사용자가 직접 편집할 수 있는 필드 (번호는 순번으로 자동 계산되므로 제외) */
export type EditableDonationField = Exclude<keyof DonationRow, 'id'>;
