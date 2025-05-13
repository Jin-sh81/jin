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
  beforeImage?: string;
  afterImage?: string;
  createdAt: string;
  files?: { name: string; data: string }[];
}

export default function History() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  //const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('routines');
    if (saved) setRoutines(JSON.parse(saved));
  }, []);

  // 선택한 날짜의 루틴 필터링
  const filteredRoutines = routines.filter(routine => {
    const routineDate = new Date(routine.createdAt).toISOString().slice(0, 10);
    return routineDate === selectedDate;
  });

  // After 이미지 업로드
  const handleAfterImageUpload = (file: File) => {
    if (!selectedRoutine) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = routines.map(r =>
        r.id === selectedRoutine.id ? { ...r, afterImage: reader.result as string } : r
      );
      setRoutines(updated);
      localStorage.setItem('routines', JSON.stringify(updated));
      setSelectedRoutine({ ...selectedRoutine, afterImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // 파일 업로드
  const handleFileUpload = (file: File) => {
    if (!selectedRoutine) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = routines.map(r =>
        r.id === selectedRoutine.id
          ? { ...r, files: [ ...(r.files || []), { name: file.name, data: reader.result as string } ] }
          : r
      );
      setRoutines(updated);
      localStorage.setItem('routines', JSON.stringify(updated));
      setSelectedRoutine({
        ...selectedRoutine,
        files: [ ...(selectedRoutine.files || []), { name: file.name, data: reader.result as string } ]
      });
    };
    reader.readAsDataURL(file);
  };

  // 파일 삭제
  const handleFileDelete = (fileName: string) => {
    if (!selectedRoutine) return;
    const updated = routines.map(r =>
      r.id === selectedRoutine.id
        ? { ...r, files: (r.files || []).filter(f => f.name !== fileName) }
        : r
    );
    setRoutines(updated);
    localStorage.setItem('routines', JSON.stringify(updated));
    setSelectedRoutine({
      ...selectedRoutine,
      files: (selectedRoutine.files || []).filter(f => f.name !== fileName)
    });
  };

  // 날짜별로 그룹핑
  const routinesByDate = routines.reduce((acc, routine) => {
    const date = routine.createdAt.slice(0, 10); // YYYY-MM-DD
    if (!acc[date]) acc[date] = [];
    acc[date].push(routine);
    return acc;
  }, {} as Record<string, Routine[]>);
  //const sortedDates = Object.keys(routinesByDate).sort((a, b) => b.localeCompare(a));

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

          <h1 className="text-2xl font-bold mb-8">과거 일정</h1>

          <div className="mb-8">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 rounded-lg border border-card-border bg-card-bg text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            {filteredRoutines.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                선택한 날짜에 예정된 일과가 없습니다.
              </div>
            ) : (
              filteredRoutines.map(routine => (
                <div
                  key={routine.id}
                  className={`flex items-center p-4 bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg ${
                    routine.completed ? 'opacity-50' : ''
                  }`}
                  style={{ borderLeftColor: routine.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-primary">
                      {routine.time} - {routine.title}
                    </div>
                    {routine.message && (
                      <div className="text-sm text-secondary">{routine.message}</div>
                    )}
                    <div className="text-xs text-tertiary mt-1">
                      반복: {routine.repeat.join(', ')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 상세 보기 모달 */}
          {selectedRoutine && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gray-800 p-6 rounded-xl max-w-2xl w-full">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {selectedRoutine.time} - {selectedRoutine.title}
                </h3>
                {selectedRoutine.message && (
                  <p className="text-gray-300 mb-4">{selectedRoutine.message}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg mb-2 text-gray-300">Before</h4>
                    {selectedRoutine.beforeImage ? (
                      <image 
                        src={selectedRoutine.beforeImage} 
                        alt="Before" 
                        className="w-full rounded-lg"
                      />
                    ) : (
                      <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-400">
                        Before 이미지 없음
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg mb-2 text-gray-300">After</h4>
                    {selectedRoutine.afterImage ? (
                      <image 
                        src={selectedRoutine.afterImage} 
                        alt="After" 
                        className="w-full rounded-lg mb-2"
                      />
                    ) : (
                      <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-400 mb-2">
                        After 이미지 없음
                      </div>
                    )}
                    {/* After 이미지 업로드 */}
                    <label className="block mt-2 text-sm text-blue-300 cursor-pointer hover:underline">
                      After 사진 업로드
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleAfterImageUpload(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {/* 파일 업로드 및 리스트 */}
                <div className="mt-6">
                  <label className="block mb-2 text-gray-300 cursor-pointer hover:underline">
                    파일 첨부하기
                    <input
                      type="file"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  {selectedRoutine.files && selectedRoutine.files.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-400 mb-1">첨부 파일:</div>
                      <ul className="space-y-1">
                        {selectedRoutine.files.map(f => (
                          <li key={f.name} className="flex items-center gap-2">
                            <a href={f.data} download={f.name} className="underline text-blue-300" target="_blank" rel="noopener noreferrer">{f.name}</a>
                            <button type="button" onClick={() => handleFileDelete(f.name)} className="text-red-400 hover:text-red-600 text-xs">삭제</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedRoutine(null)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BackgroundLayout>
  );
} 