'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaCheck, FaEdit, FaTrash, FaBell, FaRedo } from 'react-icons/fa';

interface Routine {
  id: string;
  title: string;
  time: string;
  color: string;
  message: string;
  repeat: string[];
  notification: boolean;
  completed: boolean;
  beforeImage: string | null;
  afterImage: string | null;
}

export default function RoutinesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchRoutines();
    }
  }, [session]);

  const fetchRoutines = async () => {
    try {
      const response = await fetch('/api/routines');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '루틴을 불러오는데 실패했습니다.');
      }

      setRoutines(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('루틴을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const response = await fetch(`/api/routines/${id}/complete`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '루틴 완료 처리에 실패했습니다.');
      }

      setRoutines(prev =>
        prev.map(routine =>
          routine.id === id
            ? { ...routine, completed: !routine.completed }
            : routine
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('루틴 완료 처리에 실패했습니다.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 루틴을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/routines/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '루틴 삭제에 실패했습니다.');
      }

      setRoutines(prev => prev.filter(routine => routine.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('루틴 삭제에 실패했습니다.');
      }
    }
  };

  if (!session) {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">나의 루틴</h1>
            <button
              onClick={() => router.push('/routines/new')}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaPlus className="mr-2" />
              새 루틴
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/50 rounded-lg">
              {error}
            </div>
          )}

          {routines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">아직 루틴이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: routine.color }}
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {routine.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {routine.time}
                      </p>
                      {routine.message && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {routine.message}
                        </p>
                      )}
                      <div className="mt-2 flex items-center space-x-2">
                        {routine.notification && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <FaBell className="mr-1" />
                            알림
                          </span>
                        )}
                        {routine.repeat.length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <FaRedo className="mr-1" />
                            {routine.repeat.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleComplete(routine.id)}
                      className={`p-2 rounded-full ${
                        routine.completed
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => router.push(`/routines/${routine.id}/edit`)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(routine.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 