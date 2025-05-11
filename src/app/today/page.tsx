'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBell, FaBellSlash } from 'react-icons/fa';

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

export default function TodayPage() {
  const router = useRouter();
  const [todayRoutines, setTodayRoutines] = useState<Routine[]>([]);
  const [now, setNow] = useState(new Date());

  // 현재 요일 가져오기
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = days[now.getDay()];

  // localStorage에서 루틴 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routines');
      if (saved) {
        const allRoutines = JSON.parse(saved);
        // 오늘 요일에 해당하는 루틴만 필터링
        const filtered = allRoutines.filter((routine: Routine) => 
          routine.repeat.includes(today)
        );
        setTodayRoutines(filtered);
      }
    }
  }, [today]);

  // 완료 상태 토글
  const toggleComplete = (id: string) => {
    setTodayRoutines(prev =>
      prev.map(routine =>
        routine.id === id
          ? { ...routine, completed: !routine.completed }
          : routine
      )
    );
  };

  // 알림 상태 토글
  const toggleNotification = (id: string) => {
    setTodayRoutines(prev =>
      prev.map(routine =>
        routine.id === id
          ? { ...routine, notification: !routine.notification }
          : routine
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.push('/')}
              className="mr-4 p-2 rounded-lg hover:bg-card-border transition-colors duration-200"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold">오늘의 일과</h1>
          </div>

          {/* 일과 목록 */}
          <div className="space-y-4">
            {todayRoutines.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                오늘은 예정된 일과가 없습니다.
              </div>
            ) : (
              todayRoutines.map(routine => (
                <div
                  key={routine.id}
                  className={`p-4 rounded-lg border border-card-border bg-card-bg transition-all duration-200 ${
                    routine.completed ? 'opacity-50' : ''
                  }`}
                  style={{ borderLeftColor: routine.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={routine.completed}
                          onChange={() => toggleComplete(routine.id)}
                          className="w-5 h-5 rounded border-card-border bg-card-bg text-primary focus:ring-primary"
                        />
                        <div>
                          <div className="font-semibold">{routine.time} - {routine.title}</div>
                          {routine.message && (
                            <div className="text-sm text-secondary mt-1">{routine.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleNotification(routine.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        routine.notification
                          ? 'text-primary hover:bg-primary/10'
                          : 'text-secondary hover:bg-card-border'
                      }`}
                    >
                      {routine.notification ? <FaBell /> : <FaBellSlash />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 