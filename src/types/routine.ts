/**
 * 루틴 관련 타입 정의
 */

// 🔽 루틴 데이터 타입 정의
export interface Routine {
  id: string;                 // 루틴 고유 ID
  title: string;              // 루틴 제목
  description?: string;       // 루틴 설명 (선택사항)
  time: string;               // 실행 시간
  repeatDays: string[];       // 반복 요일 (0-6, 일-토)
  category: string;           // 카테고리
  userId: string;             // 루틴 소유자 ID
  notify: boolean;            // 알림 여부
  createdAt: string;          // 생성 시간 (선택사항)
  updatedAt?: string;         // 수정 시간 (선택사항)
}

// 🔽 루틴 수행 기록 타입 정의
export interface RoutineRecord {
  id: string;                 // 기록 고유 ID
  routineId: string;          // 루틴 ID
  userId: string;             // 사용자 ID
  completedAt: string;        // 완료 시간
  memo?: string;              // 메모 (선택사항)
  createdAt: string;          // 생성 시간 (선택사항)
  updatedAt?: string;         // 수정 시간 (선택사항)
}

// 🔽 루틴 통계 데이터 타입 정의
export interface RoutineStats {
  totalRecords: number;        // 전체 루틴 수
  completedRecords: number;     // 완료된 루틴 수
  completionRate: number;        // 완료율
  byCategory: {                 // 카테고리별 통계
    [key: string]: number;
  };
  byDay: {                      // 요일별 통계
    [key: string]: number;
  };
  streak: number;                // 연속 달성 일수
  lastCompleted: string;          // 마지막 완료 시간
}

export interface RoutineDetailModalProps {
  routine: Routine;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (routineId: string) => Promise<void>;
} 