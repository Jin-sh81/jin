export interface Routine {
  id: string;
  time: string;
  title: string;
  color: string;
  completed: boolean;
  repeat: string[];
  message: string;
  notification: boolean;
  beforeImage?: string;
  afterImage?: string;
  createdAt: string;
  files?: { name: string; data: string }[];
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
    darkMode: boolean;
    notifications: boolean;
  };
}

export interface Statistics {
  totalRoutines: number;
  completedRoutines: number;
  streak: number;
  lastCompleted: string;
}

export interface Goals {
  daily: number;
  weekly: number;
  monthly: number;
} 