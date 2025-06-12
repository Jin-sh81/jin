/**
 * 일기 관련 타입 정의
 */

// 🔽 일기 데이터 타입 정의
export interface Diary {
  id: string;                   // 📝 일기의 고유 번호
  userId: string;              // 🧑‍💼 일기 소유자 ID
  date: string;                 // 📅 일기를 작성한 날짜
  content: string;              // 📝 일기 내용
  mood?: 'happy' | 'sad' | 'angry' | 'excited' | 'tired';
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  images?: string[];           // 🖼️ 일기 이미지 URL 목록
  createdAt: string;           // ⏰ 생성 시간
  updatedAt: string;           // ⏰ 수정 시간
  deleted?: boolean;
  deletedAt?: string;
}

// 🔽 타임라인 데이터 타입 정의
export interface TimelineEntry {
  id: string;                   // 🔖 타임라인 항목의 고유 번호
  date: string;                 // 📅 날짜
  type: 'diary' | 'event';      // 📂 항목 타입
  title: string;                // 📝 제목
  content: string;              // 📝 내용
  mood?: string;
  weather?: string;
  images?: string[];           // 🖼️ 이미지 URL 목록
  createdAt: string;           // ⏰ 생성 시간
  updatedAt?: string;
  userId: string;              // 🧑‍💼 소유자 ID
}

export interface DiaryDetailModalProps {
  diary: Diary;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (diaryId: string) => Promise<void>;
} 