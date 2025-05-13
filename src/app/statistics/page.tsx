'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

interface Statistics {
  totalRoutines: number;
  completedRoutines: number;
  completionRate: number;
  todayRoutines: number;
  todayCompleted: number;
  todayCompletionRate: number;
  weeklyStats: {
    date: string;
    total: number;
    completed: number;
    completionRate: number;
  }[];
  repeatStats: Record<string, number>;
}

export const dynamic = 'force-dynamic';

export default function StatisticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchStatistics();
    }
  }, [status, router]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/statistics');
      if (!response.ok) {
        throw new Error('통계를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
  };

  const formatDay = (day: string) => {
    const dayMap: Record<string, string> = {
      'monday': '월요일',
      'tuesday': '화요일',
      'wednesday': '수요일',
      'thursday': '목요일',
      'friday': '금요일',
      'saturday': '토요일',
      'sunday': '일요일'
    };
    return dayMap[day] || day;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            <p>로그인이 필요합니다.</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">통계</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">전체 루틴</h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                총 루틴: {statistics.totalRoutines}개
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                완료된 루틴: {statistics.completedRoutines}개
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                완료율: {statistics.completionRate.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">오늘의 루틴</h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                총 루틴: {statistics.todayRoutines}개
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                완료된 루틴: {statistics.todayCompleted}개
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                완료율: {statistics.todayCompletionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">주간 통계</h2>
          <div className="space-y-4">
            {statistics.weeklyStats.map((stat) => (
              <div key={stat.date} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{formatDate(stat.date)}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    {stat.completed}/{stat.total}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {stat.completionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">반복 설정</h2>
          <div className="space-y-2">
            {Object.entries(statistics.repeatStats).map(([day, count]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{formatDay(day)}</span>
                <span className="text-gray-600 dark:text-gray-400">{count}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 