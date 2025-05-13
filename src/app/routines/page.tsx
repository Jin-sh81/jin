'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaCheck, FaEdit, FaTrash, FaBell, FaRedo, FaArrowLeft } from 'react-icons/fa';
import { SessionProvider } from "next-auth/react";
import { Routine } from '@/types';

export const dynamic = 'force-dynamic';

function RoutinesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchRoutines();
    }
  }, [status, router]);

  const fetchRoutines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/routines');
      if (!response.ok) {
        throw new Error('루틴을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setRoutines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleComplete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/routines/${id}/complete`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('루틴 완료 처리에 실패했습니다.');
      }
      await fetchRoutines();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  }, [fetchRoutines]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('정말로 이 루틴을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/routines/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('루틴 삭제에 실패했습니다.');
      }
      await fetchRoutines();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  }, [fetchRoutines]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 h-24" />
            ))}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">루틴 목록</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/routines/new')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus />
            <span>새 루틴</span>
          </button>
        </div>

        {routines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">아직 루틴이 없습니다.</p>
            <button
              onClick={() => router.push('/routines/new')}
              className="mt-4 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              첫 루틴을 만들어보세요
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {routine.title}
                      </h2>
                      {routine.notification && (
                        <FaBell className="text-yellow-500" title="알림 설정됨" />
                      )}
                      {routine.repeat.length > 0 && (
                        <FaRedo className="text-blue-500" title="반복 설정됨" />
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {routine.time}
                    </p>
                    {routine.message && (
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {routine.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleComplete(routine.id)}
                      className={`p-2 rounded-full ${
                        routine.completed
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      title={routine.completed ? '완료됨' : '완료하기'}
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => router.push(`/routines/${routine.id}/edit`)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                      title="수정"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(routine.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                      title="삭제"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoutinesPageWithSession() {
  return (
    <SessionProvider>
      <RoutinesPage />
    </SessionProvider>
  );
} 