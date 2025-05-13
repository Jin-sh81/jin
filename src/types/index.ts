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

export interface Statistics {
  totalRoutines: number;
  completedRoutines: number;
  streak: number;
  lastCompleted: Date | null;
}

export interface Goals {
  daily: number;
  weekly: number;
  monthly: number;
  currentStreak: number;
  bestStreak: number;
} 