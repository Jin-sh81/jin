export interface Routine {
  id: string;
  name: string;
  time: string;
  title: string;
  color: string;
  message: string;
  repeat: string[];
  notification: boolean;
  completed: boolean;
  beforeImage?: string;
  afterImage?: string;
  files?: Array<{
    name: string;
    data: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewRoutine {
  time: string;
  title: string;
  color: string;
  message: string;
  repeat: string[];
  notification: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
  };
}

export interface WeeklyStat {
  date: string;
  total: number;
  completed: number;
  completionRate: number;
}

export interface Statistics {
  totalRoutines: number;
  completedRoutines: number;
  completionRate: number;
  todayRoutines: number;
  todayCompleted: number;
  todayCompletionRate: number;
  weeklyStats: WeeklyStat[];
  repeatStats: Record<string, number>;
}

export interface Goals {
  daily: number;
  weekly: number;
  monthly: number;
  currentStreak: number;
  bestStreak: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
} 