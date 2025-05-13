'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCamera, FaImage, FaHistory, FaTimes, FaMoon, FaSun } from 'react-icons/fa';//FaPlus, FaPalette,
import Link from 'next/link';
//import NotificationPopup from '@/components/NotificationPopup';
import BackgroundLayout from '@/components/BackgroundLayout';
import { Routine, NewRoutine } from '@/types';
import { useTranslation } from '@/i18n';

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
              {routine.files.map((file: { name: string; data: string }) => (
                <li key={file.name} className="flex items-center gap-2">
                  <a href={file.data} download={file.name} className="underline text-primary" target="_blank" rel="noopener noreferrer">{file.name}</a>
                  <button type="button" onClick={() => onFileDelete(routine.id, file.name)} className="text-red-400 hover:text-red-600 text-xs">삭제</button>
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
  const [t, setT] = useState<any>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<NewRoutine>({
    time: '',
    title: '',
    color: '#000000',
    message: '',
    repeat: [],
    notification: false
  });
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [goals, setGoals] = useState<{ projects: string; objectives: string }>({ projects: '', objectives: '' });
  const [notification, setNotification] = useState<{ show: boolean; routine: Routine | null }>({ show: false, routine: null });
  const [showImageModal, setShowImageModal] = useState<{ show: boolean; routine: Routine | null }>({ show: false, routine: null });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const days = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    const initTranslation = async () => {
      const { t } = await useTranslation('ko', 'common');
      setT(t);
    };
    initTranslation();
  }, []);

  // localStorage 관련 로직을 useCallback으로 최적화
  const loadRoutines = useCallback(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('routines');
      if (saved) setRoutines(JSON.parse(saved));
    }
  }, []);

  const saveRoutines = useCallback((updatedRoutines: Routine[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('routines', JSON.stringify(updatedRoutines));
    }
  }, []);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  useEffect(() => {
    saveRoutines(routines);
  }, [routines, saveRoutines]);

  // 날짜, 요일, 시간 표시용 상태
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      name: newRoutine.title.trim(),
      time: newRoutine.time,
      title: newRoutine.title.trim(),
      color: newRoutine.color,
      completed: false,
      repeat: newRoutine.repeat,
      message: newRoutine.message.trim(),
      notification: !!newRoutine.notification,
      createdAt: new Date(),
      updatedAt: new Date()
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
      prev.map(r => r.id === id ? { ...r, completed: !r.completed, updatedAt: new Date() } : r)
    );
  };

  // 삭제 함수
  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

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
    monthly: 0,
    total: 0,
    streak: 0
  });

  // 통계 계산
  useEffect(() => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklyCompleted = routines.filter(r => 
      new Date(r.createdAt) >= weekStart && r.completed
    ).length;
    
    const monthlyCompleted = routines.filter(r => 
      new Date(r.createdAt) >= monthStart && r.completed
    ).length;

    const totalCompleted = routines.filter(r => r.completed).length;

    // 연속 달성 일수 계산
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      //const dateStr = checkDate.toISOString().slice(0, 10);
      
      const dayRoutines = routines.filter(r => 
        r.repeat.includes(days[checkDate.getDay()])
      );
      
      if (dayRoutines.length === 0) continue;
      
      const allCompleted = dayRoutines.every(r => r.completed);
      if (allCompleted) {
        streak++;
      } else {
        break;
      }
    }

    setStatistics({
      weekly: Math.round((weeklyCompleted / routines.length) * 100) || 0,
      monthly: Math.round((monthlyCompleted / routines.length) * 100) || 0,
      total: Math.round((totalCompleted / routines.length) * 100) || 0,
      streak
    });
  }, [routines]);

  // 클라이언트 사이드 초기화
  useEffect(() => {
    setMounted(true);
    // localStorage에서 데이터 로드
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedGoals = localStorage.getItem('goals');

    if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
    if (savedGoals) setGoals(JSON.parse(savedGoals));

    // 다크모드 설정
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  // 다크모드 설정 저장
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode, mounted]);

  // 목표 저장
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('goals', JSON.stringify(goals));
    }
  }, [goals, mounted]);

  if (!t) {
    return <div>Loading...</div>;
  }

  return (
    <BackgroundLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold">{t('appName')}</h1>
                {mounted && (
                  <button
                    onClick={() => {
                      const projects = prompt('진행 중인 프로젝트를 입력하세요:', goals.projects);
                      const objectives = prompt('이루고 싶은 목표를 입력하세요:', goals.objectives);
                      if (projects !== null && objectives !== null) {
                        setGoals({ projects, objectives });
                      }
                    }}
                    className="p-2 rounded-lg bg-card-bg text-secondary hover:bg-card-border transition-colors duration-200"
                  >
                    ✏️
                  </button>
                )}
              </div>
              {mounted && (goals.projects || goals.objectives) && (
                <div className="bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg p-4 mb-2">
                  {goals.projects && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-secondary">진행 중인 프로젝트:</span>
                      <p className="text-primary">{goals.projects}</p>
                    </div>
                  )}
                  {goals.objectives && (
                    <div>
                      <span className="text-sm font-medium text-secondary">이루고 싶은 목표:</span>
                      <p className="text-primary">{goals.objectives}</p>
                    </div>
                  )}
                </div>
              )}
              {mounted && (
                <div className="text-sm text-secondary">
                  {dateString} ({dayString}) {timeString}
                  <span className="ml-2">{getDaysCount()}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {mounted && (
                <>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-lg bg-card-bg text-secondary hover:bg-card-border transition-colors duration-200"
                    aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                  >
                    {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
                  </button>
                  <Link
                    href="/today"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors duration-200"
                  >
                    오늘의 일과
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg p-4">
              <h3 className="text-sm text-secondary mb-1">주간 완료율</h3>
              <div className="text-2xl font-bold text-primary">{statistics.weekly}%</div>
            </div>
            <div className="bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg p-4">
              <h3 className="text-sm text-secondary mb-1">월간 완료율</h3>
              <div className="text-2xl font-bold text-primary">{statistics.monthly}%</div>
            </div>
            <div className="bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg p-4">
              <h3 className="text-sm text-secondary mb-1">전체 완료율</h3>
              <div className="text-2xl font-bold text-primary">{statistics.total}%</div>
            </div>
            <div className="bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg p-4">
              <h3 className="text-sm text-secondary mb-1">연속 달성</h3>
              <div className="text-2xl font-bold text-primary">{statistics.streak}일</div>
            </div>
          </div>

          {/* 진행률 원형 차트 */}
          <div className="bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">오늘의 진행률</h2>
              <Link href="/history" className="flex items-center text-primary hover:text-primary-hover">
                <FaHistory className="mr-2" />
                과거 일정 보기
              </Link>
            </div>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--card-border)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={calculateProgress() > 70 ? "#48bb78" : calculateProgress() > 30 ? "#ecc94b" : "#f56565"}
                  strokeWidth="3"
                  strokeDasharray={`${calculateProgress()}, 100`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-2xl font-bold">{calculateProgress()}%</span>
              </div>
            </div>
          </div>

          {/* 루틴 추가 폼 */}
          <div className="bg-card-bg/90 backdrop-blur-sm border border-card-border rounded-lg p-6 mb-8">
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
                {t('add')}
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
    </BackgroundLayout>
  );
}
