'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import BackgroundLayout from '@/components/BackgroundLayout';

interface Routine {
  id: string;
  time: string;
  title: string;
  color: string;
  completed: boolean;
  repeat: string[];
  message: string;
  notification: boolean;
  createdAt: string;
}

export default function Today() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [ setMounted] = useState(false);//mounted

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('routines');
    if (saved) setRoutines(JSON.parse(saved));
  }, []);

  const toggleRoutine = (id: string) => {
    setRoutines(prev =>
      prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    );
  };

  // 오늘의 루틴만 필터링
  const todayRoutines = routines.filter(routine => {
    const today = new Date().getDay();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return routine.repeat.includes(days[today]);
  });

  return (
    <BackgroundLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-primary hover:text-primary-hover"
            >
              <FaArrowLeft className="mr-2" />
              돌아가기
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-8">오늘의 일과</h1>

          <div className="space-y-4">
            {todayRoutines.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                오늘 예정된 일과가 없습니다.
              </div>
            ) : (
              todayRoutines.map(routine => (
                <div
                  key={routine.id}
                  className={`flex items-center p-4 bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg ${
                    routine.completed ? 'opacity-50' : ''
                  }`}
                  style={{ borderLeftColor: routine.color, borderLeftWidth: '4px' }}
                >
                  <input
                    type="checkbox"
                    checked={routine.completed}
                    onChange={() => toggleRoutine(routine.id)}
                    className="mr-4 w-5 h-5 rounded border-card-border bg-card-bg text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-primary">
                      {routine.time} - {routine.title}
                    </div>
                    {routine.message && (
                      <div className="text-sm text-secondary">{routine.message}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
} 