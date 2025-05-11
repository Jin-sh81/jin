'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCamera, FaImage, FaHistory, FaTimes, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import NotificationPopup from '@/components/NotificationPopup';

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
      className={`flex items-center p-4 bg-card-bg border border-card-border rounded-lg mb-2 cursor-move hover:bg-card-border transition-colors duration-200 relative ${
        routine.completed ? 'opacity-50' : ''
      }`}
    >
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(routine.id); }}
        onPointerDown={e => e.stopPropagation()}
        className="absolute top-2 right-2 text-tertiary hover:text-red-500 text-lg z-50"
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
        className="mr-4 w-5 h-5 rounded border-card-border bg-card-bg text-primary focus:ring-primary"
      />
      <div className="flex-1">
        <div className="font-semibold text-primary">{routine.time} - {routine.title}</div>
        {routine.message && (
          <div className="text-sm text-secondary">{routine.message}</div>
        )}
        {routine.repeat.length > 0 && (
          <div className="text-xs text-tertiary mt-1">
            반복: {routine.repeat.join(', ')}
          </div>
        )}
        {routine.notification && (
          <div className="text-xs text-tertiary mt-1">
            알림 설정됨
          </div>
        )}
        {/* Before 이미지 미리보기 */}
        {routine.beforeImage && (
          <div className="my-2">
            <img src={routine.beforeImage} alt="Before" className="w-24 h-24 object-cover rounded-lg border border-card-border" />
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <div className="flex gap-2">
            <label className="p-2 rounded-lg bg-card-bg text-secondary hover:bg-card-border cursor-pointer transition-colors duration-200">
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
              className="p-2 rounded-lg bg-card-bg text-secondary hover:bg-card-border transition-colors duration-200"
            >
              <FaImage />
            </button>
          </div>
          <label className="p-2 rounded-lg bg-card-bg text-secondary hover:bg-card-border cursor-pointer transition-colors duration-200">
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
            <div className="text-xs text-tertiary mb-1">첨부 파일:</div>
            <ul className="space-y-1">
              {routine.files.map(f => (
                <li key={f.name} className="flex items-center gap-2">
                  <a href={f.data} download={f.name} className="underline text-primary" target="_blank" rel="noopener noreferrer">{f.name}</a>
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
    if (!newRoutine.time) {
      alert('시간을 입력해주세요.');
      return;
    }
    if (!newRoutine.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const routine: Routine = {
      id: Date.now().toString(),
      time: newRoutine.time,
      title: newRoutine.title.trim(),
      color: newRoutine.color,
      completed: false,
      repeat: newRoutine.repeat,
      message: newRoutine.message.trim(),
      notification: !!newRoutine.notification,
      createdAt: new Date().toISOString()
    };

    setRoutines(prevRoutines => [...prevRoutines, routine]);
    setNewRoutine({ time: '', title: '', color: '#000000', message: '', repeat: [], notification: false });
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
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, completed: true } : r));
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

  // 알림 권한 요청 및 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // 알림 체크 로직 수정
  const [notification, setNotification] = useState<{
    show: boolean;
    routine: Routine | null;
  }>({ show: false, routine: null });

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      routines.forEach(routine => {
        if (routine.time === currentTime && routine.notification && !routine.completed) {
          // 알림 소리 재생
          if (audioRef.current) {
            audioRef.current.play().catch(error => {
              console.error('알림 소리 재생 실패:', error);
            });
          }

          // 팝업 알림 표시
          setNotification({ show: true, routine });
        }
      });
    };

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

  const [statistics, setStatistics] = useState({
    weekly: 0,
    monthly: 0
  });

  useEffect(() => {
    // 주간/월간 통계 계산
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklyCompleted = routines.filter(r => 
      new Date(r.createdAt) >= weekStart && r.completed
    ).length;
    
    const monthlyCompleted = routines.filter(r => 
      new Date(r.createdAt) >= monthStart && r.completed
    ).length;

    setStatistics({
      weekly: Math.round((weeklyCompleted / routines.length) * 100) || 0,
      monthly: Math.round((monthlyCompleted / routines.length) * 100) || 0
    });
  }, [routines]);

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* 알림 팝업 */}
      {notification.show && notification.routine && (
        <NotificationPopup
          routine={notification.routine}
          onClose={() => setNotification({ show: false, routine: null })}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">나의 루틴</h1>
              <div className="text-sm text-secondary">
                {dateString} ({dayString}) {timeString}
                <span className="ml-2">{getDaysCount()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/today"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors duration-200"
              >
                오늘의 일과
              </Link>
            </div>
          </div>

          {/* 루틴 추가 폼 */}
          <div className="bg-card-bg border border-card-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">새로운 루틴 추가하기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">시간</label>
                  <input
                    type="time"
                    value={newRoutine.time}
                    onChange={e => setNewRoutine(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full p-2 rounded-lg border border-card-border bg-card-bg text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">일과 제목</label>
                  <input
                    type="text"
                    value={newRoutine.title}
                    onChange={e => setNewRoutine(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="일과 제목을 입력하세요"
                    className="w-full p-2 rounded-lg border border-card-border bg-card-bg text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">색상</label>
                  <input
                    type="color"
                    value={newRoutine.color}
                    onChange={e => setNewRoutine(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-10 rounded-lg border border-card-border bg-card-bg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">응원 메시지</label>
                  <input
                    type="text"
                    value={newRoutine.message}
                    onChange={e => setNewRoutine(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="응원 메시지를 입력하세요"
                    className="w-full p-2 rounded-lg border border-card-border bg-card-bg text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notification"
                  checked={newRoutine.notification}
                  onChange={e => setNewRoutine(prev => ({ ...prev, notification: e.target.checked }))}
                  className="w-4 h-4 rounded border-card-border bg-card-bg text-primary focus:ring-primary"
                />
                <label htmlFor="notification" className="ml-2 text-sm text-secondary">
                  푸시 알림 설정
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">반복 요일</label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setNewRoutine(prev => ({
                          ...prev,
                          repeat: prev.repeat.includes(day)
                            ? prev.repeat.filter(d => d !== day)
                            : [...prev.repeat, day]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newRoutine.repeat.includes(day)
                          ? 'bg-primary text-white'
                          : 'bg-card-bg text-secondary hover:bg-card-border'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addRoutine}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                일과 추가하기
              </button>
            </div>
          </div>

          {/* 루틴 목록 */}
          <div className="space-y-4">
            {routines.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                아직 추가된 루틴이 없습니다. 새로운 루틴을 추가해보세요!
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={routines.map(r => r.id)} strategy={verticalListSortingStrategy}>
                  {routines.map(routine => (
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
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
