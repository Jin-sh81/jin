import { useState } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { createRoutine } from '@/services/routineService'
import type { Routine } from '@/types/routine'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { StorageService } from '@/infrastructure/firebase/storageService'
import router from '@/config/routes'

// Storage 서비스 인스턴스 생성
const storageService = new StorageService()

// 루틴 데이터 타입 정의
interface RoutineData {
  title: string;
  time: string;
  memo?: string;
  repeat: string[];
  notify: boolean;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

// 이미지 미리보기 타입 정의
interface ImagePreview {
  before: string | null;
  after: string | null;
}

// 루틴 폼 컴포넌트의 props 타입 정의
interface RoutineFormProps {
  routine?: Routine;  // 수정할 루틴 (없으면 새로 생성)
  onSubmit: (routine: Omit<Routine, 'id'>) => void;  // 폼 제출 시 실행할 함수
  onCancel: () => void;  // 취소 시 실행할 함수
}

// 루틴 생성/수정 폼 컴포넌트
const RoutineForm = ({ routine, onSubmit, onCancel }: RoutineFormProps) => {
  // 폼 상태 관리
  const [title, setTitle] = useState(routine?.title || '')
  const [description, setDescription] = useState(routine?.description || '')
  const [time, setTime] = useState(routine?.time || '09:00')
  const [repeat, setRepeat] = useState(routine?.repeat || ['월', '화', '수', '목', '금'])
  const [category, setCategory] = useState(routine?.category || '일상')

  // 요일 선택 처리
  const handleDayToggle = (day: string) => {
    if (repeat.includes(day)) {
      setRepeat(repeat.filter(d => d !== day))
    } else {
      setRepeat([...repeat, day])
    }
  }

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      time,
      repeat,
      category,
      userId: routine?.userId || ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          시간
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ClockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          반복 요일
        </label>
        <div className="flex flex-wrap gap-2">
          {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayToggle(day)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                repeat.includes(day)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="일상">일상</option>
          <option value="운동">운동</option>
          <option value="학습">학습</option>
          <option value="취미">취미</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {routine ? '수정하기' : '생성하기'}
        </button>
      </div>
    </form>
  )
}

export default RoutineForm 