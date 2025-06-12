/**
 * 지출 관련 타입 정의
 */

// 🔽 지출 카테고리 타입 정의
export type ExpenseCategory = 
  | 'food'           // 식비
  | 'transport'      // 교통비
  | 'housing'        // 주거비
  | 'communication'  // 통신비
  | 'medical'        // 의료비
  | 'education'      // 교육비
  | 'culture'        // 문화생활
  | 'other';         // 기타

// 🔽 지출 데이터 타입 정의
export interface ExpenseAttachment {
  id: string;                 // 첨부파일 고유 ID
  name: string;               // 파일 이름
  url: string;                // 파일 URL
  type: string;               // 파일 타입
  size: number;               // 파일 크기
  createdAt: string;          // 업로드 시간
}

export interface Expense {
  id: string;                 // 지출 고유 ID
  title: string;              // 지출 제목
  description?: string;       // 지출 설명 (선택사항)
  amount: number;             // 지출 금액
  category: ExpenseCategory;  // 지출 카테고리
  date: string;               // 지출 날짜
  userId: string;             // 지출 소유자 ID
  attachments?: ExpenseAttachment[];  // 첨부파일 목록 (선택사항)
  createdAt?: string;         // 생성 시간 (선택사항)
  updatedAt?: string;         // 수정 시간 (선택사항)
  isDeleted?: boolean;        // 삭제 여부 (선택사항)
}

// 🔽 지출 통계 타입 정의
export interface ExpenseStats {
  total: number;              // 전체 지출 금액
  count: number;              // 지출 건수
  average: number;            // 평균 지출 금액
  byCategory: {               // 카테고리별 통계
    [key: string]: {
      total: number;
      count: number;
      percentage: number;
    };
  };
  byMonth: {                  // 월별 통계
    [key: string]: {
      total: number;
      count: number;
    };
  };
  trend: {                    // 추이 통계
    labels: string[];
    data: number[];
  };
} 