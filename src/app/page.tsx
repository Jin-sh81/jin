'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCamera, FaImage, FaHistory, FaTimes } from 'react-icons/fa';
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
  files?: { name: string; data: string }[];
}

function SortableRoutine({ routine, onToggle, onDelete, onImageUpload, onShowImages, onFileUpload, onFileDelete }: {
  routine: Routine;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, type: 'before' | 'after', file: File) => void;
  onShowImages: () => void;
  onFileUpload: (id: string, file: File) => void;
  onFileDelete: (id: string, fileName: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: routine.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeftColor: routine.color,
    borderLeftWidth: '4px',
    position: 'relative' as React.CSSProperties['position']
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center p-4 bg-gray-700 border border-gray-600 rounded-lg mb-2 cursor-move hover:bg-gray-600 transition-colors duration-200 relative"
    >
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(routine.id); }}
        onPointerDown={e => e.stopPropagation()}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg z-50"
        style={{ cursor: 'pointer' }}
        aria-label="삭제"
      >
        <FaTimes />
      </button>
      <input
        type="checkbox"
        checked={routine.completed}
        onClick={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
        onChange={() => onToggle(routine.id)}
        className="mr-4 w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="font-semibold text-white">{routine.time} - {routine.title}</div>
        {routine.message && (
          <div className="text-sm text-gray-400">{routine.message}</div>
        )}
        <div className="flex gap-2 mt-2">
          <div className="flex gap-2">
            <label className="p-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 cursor-pointer transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(routine.id, 'before', file);
                }}
                className="hidden"
              />
              <FaCamera />
            </label>
            <button
              type="button"
              onClick={onShowImages}
              className="p-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors duration-200"
            >
              <FaImage />
            </button>
          </div>
          <label className="p-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 cursor-pointer transition-colors duration-200">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(routine.id, file);
              }}
              className="hidden"
            />
            📎
          </label>
        </div>
        {routine.files && routine.files.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-gray-400 mb-1">첨부 파일:</div>
            <ul className="space-y-1">
              {routine.files.map(f => (
                <li key={f.name} className="flex items-center gap-2">
                  <a href={f.data} download={f.name} className="underline text-blue-300" target="_blank" rel="noopener noreferrer">{f.name}</a>
                  <button type="button" onClick={() => onFileDelete(routine.id, f.name)} className="text-red-400 hover:text-red-600 text-xs">삭제</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  // 1. 초기값은 빈 배열
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState({
    time: '',
    title: '',
    color: '#000000',
    message: '',
    repeat: [] as string[],
    notification: false
  });

  // 2. 마운트 시 localStorage에서 한 번만 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routines');
      if (saved) setRoutines(JSON.parse(saved));
    }
  }, []);

  // 3. routines가 바뀔 때만 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('routines', JSON.stringify(routines));
    }
  }, [routines]);

  // 날짜, 요일, 시간 표시용 상태
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const dayString = days[now.getDay()];
  const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  // 사용 시작일(첫 루틴 추가일, 없으면 오늘)
  const [startDate, setStartDate] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routineStartDate');
      if (saved) return saved;
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('routineStartDate', today);
      return today;
    }
    return new Date().toISOString().slice(0, 10);
  });
  useEffect(() => {
    if (routines.length === 1) {
      const today = new Date().toISOString().slice(0, 10);
      setStartDate(today);
      localStorage.setItem('routineStartDate', today);
    }
  }, [routines.length]);

  // D+N 계산
  const getDaysCount = () => {
    const start = new Date(startDate);
    const nowDate = new Date(dateString);
    const diff = Math.floor((nowDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `D+${diff + 1}` : '';
  };

  // 드래그 센서
  const sensors = useSensors(useSensor(PointerSensor));

  // 루틴 추가
  const addRoutine = () => {
    if (newRoutine.time && newRoutine.title) {
      const routine: Routine = {
        id: Date.now().toString(),
        time: newRoutine.time,
        title: newRoutine.title,
        color: newRoutine.color,
        completed: false,
        repeat: newRoutine.repeat,
        message: newRoutine.message,
        notification: !!newRoutine.notification,
        createdAt: new Date().toISOString()
      };
      setRoutines(prevRoutines => [...prevRoutines, routine]);
      setNewRoutine({ time: '', title: '', color: '#000000', message: '', repeat: [], notification: false });
    }
  };

  // 드래그 앤 드롭
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setRoutines((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 진행률 계산
  const calculateProgress = () => {
    const completed = routines.filter(r => r.completed).length;
    return routines.length > 0 ? Math.round((completed / routines.length) * 100) : 0;
  };

  // 완료 상태 토글 함수
  const toggleRoutine = (id: string) => {
    setRoutines(prev =>
      prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    );
  };

  // 삭제 함수
  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  // 이미지 모달
  const [showImageModal, setShowImageModal] = useState<{ show: boolean; routine: Routine | null }>({ show: false, routine: null });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 알람 소리 설정
  useEffect(() => {
    // 알람 소리 파일 존재 여부 확인
    fetch('/alarm.mp3').then(res => {
      if (!res.ok) {
        console.warn('알람 소리 파일이 없습니다. public/alarm.mp3를 추가하세요.');
      }
    });
    audioRef.current = new Audio('/alarm.mp3');
  }, []);

  // 알람 체크
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      routines.forEach(routine => {
        if (routine.time === currentTime && routine.notification && !routine.completed) {
          audioRef.current?.play();
          if (Notification.permission === 'granted') {
            new Notification('루틴 알림', {
              body: `${routine.title} - ${routine.message || '할 시간이에요!'}`,
              icon: '/icon.png'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission !== 'granted') {
                alert('브라우저 알림 권한을 허용해야 알람이 정상 동작합니다.');
              }
            });
          }
        }
      });
    };
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [routines]);

  // 이미지 모달 표시
  const showImages = (routine: Routine) => {
    setShowImageModal({ show: true, routine });
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setRoutines(prevRoutines =>
        prevRoutines.map(r =>
          r.id === id
            ? {
                ...r,
                files: [ ...(r.files || []), { name: file.name, data: reader.result as string } ]
              }
            : r
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // 파일 삭제 핸들러
  const handleFileDelete = (id: string, fileName: string) => {
    setRoutines(prevRoutines =>
      prevRoutines.map(r =>
        r.id === id
          ? { ...r, files: (r.files || []).filter(f => f.name !== fileName) }
          : r
      )
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      {mounted && (
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-gray-300">{dateString} ({dayString})</div>
          <div className="text-2xl font-bold text-white">{timeString}</div>
        </div>
      )}

      {/* 오늘의 진행률 + D+N 카운터 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            오늘의 진행률
            <span className="text-base text-blue-400 font-bold">{getDaysCount()}</span>
          </h2>
          <Link href="/history" className="flex items-center text-blue-400 hover:text-blue-300">
            <FaHistory className="mr-2" />
            과거 일정 보기
          </Link>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 text-gray-300">{calculateProgress()}% 완료</p>
      </div>

      {/* 오늘의 일과 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">오늘의 일과</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={routines.map(r => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {routines.map((routine) => (
                <SortableRoutine
                  key={routine.id}
                  routine={routine}
                  onToggle={toggleRoutine}
                  onDelete={deleteRoutine}
                  onImageUpload={(id, type, file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setRoutines(prevRoutines =>
                        prevRoutines.map(r =>
                          r.id === id
                            ? {...r, [type === 'before' ? 'beforeImage' : 'afterImage']: reader.result as string}
                            : r
                        )
                      );
                    };
                    reader.readAsDataURL(file);
                  }}
                  onShowImages={() => showImages(routine)}
                  onFileUpload={handleFileUpload}
                  onFileDelete={handleFileDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 새로운 일과 추가하기 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">새로운 일과 추가하기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="time"
            value={newRoutine.time || ''}
            onChange={(e) => setNewRoutine({...newRoutine, time: e.target.value})}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={newRoutine.title || ''}
            onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="일과 제목"
          />
          <input
            type="color"
            value={newRoutine.color || '#000000'}
            onChange={(e) => setNewRoutine({...newRoutine, color: e.target.value})}
            className="border border-gray-600 bg-gray-700 p-2 rounded-lg h-10"
          />
          <input
            type="text"
            value={newRoutine.message || ''}
            onChange={(e) => setNewRoutine({...newRoutine, message: e.target.value})}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="응원 메시지"
          />
          <div className="flex items-center col-span-2 mt-2">
            <input
              type="checkbox"
              id="newRoutineNotification"
              checked={!!newRoutine.notification}
              onChange={e => setNewRoutine({...newRoutine, notification: e.target.checked})}
              className="mr-2 w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="newRoutineNotification" className="text-gray-300">알람(알림) 설정</label>
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-gray-300">반복 요일</label>
            <div className="flex gap-2">
              {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    const newRepeat = newRoutine.repeat.includes(day)
                      ? newRoutine.repeat.filter(d => d !== day)
                      : [...newRoutine.repeat, day];
                    setNewRoutine({...newRoutine, repeat: newRepeat});
                  }}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    newRoutine.repeat.includes(day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={addRoutine}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
        >
          일과 추가하기
        </button>
      </div>

      {/* 이미지 모달 */}
      {showImageModal.show && showImageModal.routine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-xl max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {showImageModal.routine.title} - 사진 기록
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg mb-2 text-gray-300">Before</h4>
                {showImageModal.routine.beforeImage ? (
                  <img 
                    src={showImageModal.routine.beforeImage} 
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
                {showImageModal.routine.afterImage ? (
                  <img 
                    src={showImageModal.routine.afterImage} 
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
              onClick={() => setShowImageModal({ show: false, routine: null })}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
