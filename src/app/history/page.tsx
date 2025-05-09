'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

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
}

export default function History() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRoutines = localStorage.getItem('routines');
      if (savedRoutines) {
        setRoutines(JSON.parse(savedRoutines));
      }
    }
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300">
            <FaArrowLeft className="mr-2" />
            메인으로 돌아가기
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">과거 일정 기록</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setSelectedRoutine(routine)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-white">{routine.time} - {routine.title}</div>
                <div className={`w-3 h-3 rounded-full ${routine.completed ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              {routine.message && (
                <div className="text-sm text-gray-400 mb-4">{routine.message}</div>
              )}
              <div className="flex gap-2">
                {routine.beforeImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img src={routine.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  </div>
                )}
                {routine.afterImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img src={routine.afterImage} alt="After" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ))}
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
                    <img 
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
                    <img 
                      src={selectedRoutine.afterImage} 
                      alt="After" 
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-400">
                      After 이미지 없음
                    </div>
                  )}
                </div>
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
  );
} 