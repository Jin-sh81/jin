'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
];

interface Routine {
  id: string;
  title: string;
  time: string;
  color: string;
  message: string;
  repeat: string[];
  notification: boolean;
  beforeImage: string | null;
  afterImage: string | null;
}

export default function EditRoutinePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [message, setMessage] = useState('');
  const [repeat, setRepeat] = useState<string[]>([]);
  const [notification, setNotification] = useState(false);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await fetch(`/api/routines/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '루틴을 불러오는데 실패했습니다.');
        }

        setRoutine(data);
        setTitle(data.title);
        setTime(data.time);
        setColor(data.color);
        setMessage(data.message || '');
        setRepeat(data.repeat || []);
        setNotification(data.notification);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('루틴을 불러오는데 실패했습니다.');
        }
      }
    };

    if (session) {
      fetchRoutine();
    }
  }, [session, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('time', time);
      formData.append('color', color);
      formData.append('message', message);
      formData.append('repeat', JSON.stringify(repeat));
      formData.append('notification', String(notification));
      if (beforeImage) formData.append('beforeImage', beforeImage);
      if (afterImage) formData.append('afterImage', afterImage);

      const response = await fetch(`/api/routines/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '루틴 수정에 실패했습니다.');
      }

      router.push('/routines');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('루틴 수정에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepeatToggle = (day: string) => {
    setRepeat(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  if (!session) {
    router.push('/login');
    return null;
  }

  if (!routine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-primary hover:text-primary-hover"
            >
              <FaArrowLeft className="mr-2" />
              돌아가기
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">루틴 수정</h1>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/50 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                시간
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                색상
              </label>
              <div className="mt-2 flex space-x-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${
                      color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                메모
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                반복
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleRepeatToggle(day)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      repeat.includes(day)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notification"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="notification" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                알림 설정
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  시작 전 이미지
                </label>
                {routine.beforeImage && (
                  <div className="mt-2 mb-2">
                    <img
                      src={routine.beforeImage}
                      alt="시작 전 이미지"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary file:text-white
                    hover:file:bg-primary-hover"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  완료 후 이미지
                </label>
                {routine.afterImage && (
                  <div className="mt-2 mb-2">
                    <img
                      src={routine.afterImage}
                      alt="완료 후 이미지"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary file:text-white
                    hover:file:bg-primary-hover"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '수정 중...' : '루틴 수정'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 