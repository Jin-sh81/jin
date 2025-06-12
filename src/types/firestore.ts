// 사용자 프로필 타입
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 사용자 설정 타입
export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  notifications: boolean;
  updatedAt: Date;
}

// 루틴 타입
export interface Routine {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[]; // 0-6 (일-토)
  timeOfDay?: string; // HH:mm 형식
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 루틴 기록 타입
export interface RoutineRecord {
  id: string;
  routineId: string;
  date: string;
  completedAt?: string;
  memo?: string;
  afterImageURL?: string;
}

// 루틴 히스토리 타입
export interface RoutineHistory {
  date: string;
  completed: boolean;
  memo?: string;
  afterImageURL?: string;
}

// 루틴 통계 타입
export interface RoutineStats {
  id: string;
  routineId: string;
  totalCompletions: number;
  totalRecords: number;
  successRate: number;
  weekdayStats: {
    [key: string]: number;
  };
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: Date;
  updatedAt: Date;
}

// 프로젝트 타입
export interface Project {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// 지출 타입
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 일기 타입
export interface Diary {
  id: string;
  title: string;
  content: string;
  mood?: 'happy' | 'neutral' | 'sad';
  tags?: string[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
} 