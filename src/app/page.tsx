'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash, FaBell, FaCamera } from 'react-icons/fa';

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
}

function SortableRoutine({ routine, onToggle, onDelete, onNotificationToggle, onImageUpload }: {
  routine: Routine;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onNotificationToggle: (id: string) => void;
  onImageUpload: (id: string, type: 'before' | 'after', file: File) => void;
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
      className="flex items-center p-4 border rounded mb-2 cursor-move"
    >
      <input
        type="checkbox"
        checked={routine.completed}
        onChange={() => onToggle(routine.id)}
        className="mr-4"
      />
      <div className="flex-1">
        <div className="font-semibold">{routine.time} - {routine.title}</div>
        {routine.message && (
          <div className="text-sm text-gray-600">{routine.message}</div>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onNotificationToggle(routine.id)}
            className={`p-2 rounded ${routine.notification ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <FaBell />
          </button>
          <label className="p-2 rounded bg-gray-200 cursor-pointer">
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
            onClick={() => onDelete(routine.id)}
            className="p-2 rounded bg-red-500 text-white"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [routines, setRoutines] = useState<Routine[]>([]);
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
        notification: false
      };
      setRoutines([...routines, routine]);
      setNewRoutine({ time: '', title: '', color: '#000000', message: '', repeat: [] });
    }
  };

  // 드래그 앤 드롭
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setRoutines((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 진행률 계산
  const calculateProgress = () => {
    const completed = routines.filter(r => r.completed).length;
    return routines.length > 0 ? Math.round((completed / routines.length) * 100) : 0;
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* 날짜, 요일, 시간 표시 */}
      <div className="text-center mb-4">
        <div className="text-lg font-semibold">{dateString} ({dayString})</div>
        <div className="text-2xl font-bold">{timeString}</div>
      </div>

      {/* 오늘의 진행률 + D+N 카운터 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          오늘의 진행률
          <span className="text-base text-blue-600 font-bold">{getDaysCount()}</span>
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">{calculateProgress()}% 완료</p>
      </div>

      {/* 오늘의 일과 (위로 이동) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">오늘의 일과</h2>
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
                    setRoutines(routines.map(r =>
                      r.id === id ? {...r, completed: !r.completed} : r
                    ));
                  }}
                  onDelete={(id) => {
                    setRoutines(routines.filter(r => r.id !== id));
                  }}
                  onNotificationToggle={(id) => {
                    setRoutines(routines.map(r =>
                      r.id === id ? {...r, notification: !r.notification} : r
                    ));
                  }}
                  onImageUpload={(id, type, file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setRoutines(routines.map(r =>
                        r.id === id
                          ? {...r, [type === 'before' ? 'beforeImage' : 'afterImage']: reader.result as string}
                          : r
                      ));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 새로운 일과 추가하기 (아래로 이동) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">새로운 일과 추가하기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="time"
            value={newRoutine.time}
            onChange={(e) => setNewRoutine({...newRoutine, time: e.target.value})}
            className="border p-2 rounded"
            placeholder="시간"
          />
          <input
            type="text"
            value={newRoutine.title}
            onChange={(e) => setNewRoutine({...newRoutine, title: e.target.value})}
            className="border p-2 rounded"
            placeholder="일과 제목"
          />
          <input
            type="color"
            value={newRoutine.color}
            onChange={(e) => setNewRoutine({...newRoutine, color: e.target.value})}
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={newRoutine.message}
            onChange={(e) => setNewRoutine({...newRoutine, message: e.target.value})}
            className="border p-2 rounded"
            placeholder="응원 메시지"
          />
          <div className="col-span-2">
            <label className="block mb-2">반복 요일</label>
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
                  className={`p-2 rounded ${
                    newRoutine.repeat.includes(day)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
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
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          일과 추가하기
        </button>
      </div>
    </div>
  );
}
