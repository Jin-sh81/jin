'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash, FaBell, FaCamera, FaImage } from 'react-icons/fa';

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

function SortableRoutine({ routine, onToggle, onDelete, onNotificationToggle, onImageUpload, onShowImages }: {
  routine: Routine;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onNotificationToggle: (id: string) => void;
  onImageUpload: (id: string, type: 'before' | 'after', file: File) => void;
  onShowImages: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: routine.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeftColor: routine.color,
    borderLeftWidth: '4px'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center p-4 bg-gray-700 border border-gray-600 rounded-lg mb-2 cursor-move hover:bg-gray-600 transition-colors duration-200"
    >
      <input
        type="checkbox"
        checked={routine.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(routine.id);
        }}
        className="mr-4 w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="font-semibold text-white">{routine.time} - {routine.title}</div>
        {routine.message && (
          <div className="text-sm text-gray-400">{routine.message}</div>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onNotificationToggle(routine.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              routine.notification 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <FaBell />
          </button>
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
              onClick={onShowImages}
              className="p-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors duration-200"
            >
              <FaImage />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(routine.id);
            }}
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routines');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newRoutine, setNewRoutine] = useState({
    time: '',
    title: '',
    color: '#000000',
    message: '',
    repeat: [] as string[]
  });

  // 날짜, 요일, 시간 표시용 상태
  const [now, setNow] = useState(new Date());
  useEffect(() => {
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

  // 루틴 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('routines', JSON.stringify(routines));
    }
  }, [routines]);

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
        notification: false,
        createdAt: new Date().toISOString()
      };
      setRoutines(prevRoutines => [...prevRoutines, routine]);
      setNewRoutine({ time: '', title: '', color: '#000000', message: '', repeat: [] });
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

  // 루틴 삭제
  const deleteRoutine = (id: string) => {
    setRoutines(prevRoutines => {
      const newRoutines = prevRoutines.filter(routine => routine.id !== id);
      localStorage.setItem('routines', JSON.stringify(newRoutines));
      return newRoutines;
    });
  };

  // 이미지 모달
  const [showImageModal, setShowImageModal] = useState<{ show: boolean; routine: Routine | null }>({ show: false, routine: null });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 알람 소리 설정
  useEffect(() => {
    audioRef.current = new Audio('/alarm.mp3'); // 알람 소리 파일 필요
  }, []);

  // 알람 체크
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      routines.forEach(routine => {
        if (routine.time === currentTime && routine.notification && !routine.completed) {
          // 알람 소리 재생
          audioRef.current?.play();
          // 브라우저 알림
          if (Notification.permission === 'granted') {
            new Notification('루틴 알림', {
              body: `${routine.title} - ${routine.message || '할 시간이에요!'}`,
              icon: '/icon.png' // 알림 아이콘 필요
            });
          }
        }
      });
    };

    // 알림 권한 요청
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

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      {/* 날짜, 요일, 시간 표시 */}
      <div className="text-center mb-4">
        <div className="text-lg font-semibold text-gray-300">{dateString} ({dayString})</div>
        <div className="text-2xl font-bold text-white">{timeString}</div>
      </div>

      {/* 오늘의 진행률 + D+N 카운터 */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
          오늘의 진행률
          <span className="text-base text-blue-400 font-bold">{getDaysCount()}</span>
        </h2>
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
                  onToggle={(id) => {
                    setRoutines(prevRoutines =>
                      prevRoutines.map(r =>
                        r.id === id ? {...r, completed: !r.completed} : r
                      )
                    );
                  }}
                  onDelete={deleteRoutine}
                  onNotificationToggle={(id) => {
                    setRoutines(prevRoutines =>
                      prevRoutines.map(r =>
                        r.id === id ? {...r, notification: !r.notification} : r
                      )
                    );
                  }}
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
            type="text"
            value={newRoutine.time}
            onChange={(e) => {
              const value = e.target.value;
              // HH:mm 형식 검증
              if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || value === '') {
                setNewRoutine({...newRoutine, time: value});
              }
            }}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="시간 (HH:mm)"
          />
          <input
            type="text"
            value={newRoutine.title}
            onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="일과 제목"
          />
          <input
            type="color"
            value={newRoutine.color}
            onChange={(e) => setNewRoutine({...newRoutine, color: e.target.value})}
            className="border border-gray-600 bg-gray-700 p-2 rounded-lg h-10"
          />
          <input
            type="text"
            value={newRoutine.message}
            onChange={(e) => setNewRoutine({...newRoutine, message: e.target.value})}
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="응원 메시지"
          />
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
