import React, { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Project, ProjectTask } from '@/types/firestore'
import { useAuth } from '@/hooks/useAuth'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

/**
 * 🎯 프로젝트 만들기/수정하기 폼 컴포넌트
 * 사용자가 새로운 프로젝트를 만들거나
 * 기존 프로젝트를 수정할 때 사용하는 화면입니다.
 * 제목, 마감일, 할 일 목록, 메모를 입력할 수 있습니다.
 */
interface ProjectFormProps {
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Project>;
}

const ProjectForm = ({ onSubmit, onCancel, initialData }: ProjectFormProps) => {
  const { user } = useAuth()
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [status, setStatus] = useState<Project['status']>(initialData?.status || 'active')
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date())
  const [endDate, setEndDate] = useState(initialData?.endDate || new Date())
  const [tasks, setTasks] = useState<Omit<ProjectTask, 'id'>[]>(initialData?.tasks || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError('프로젝트 제목을 입력해주세요')
      return false
    }
    if (!startDate) {
      setError('시작일을 선택해주세요')
      return false
    }
    if (endDate && new Date(startDate) > new Date(endDate)) {
      setError('종료일은 시작일보다 이후여야 해요')
      return false
    }
    if (tasks.some(task => !task.title.trim())) {
      setError('모든 작업의 제목을 입력해주세요')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('로그인이 필요해요')
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit({
        title,
        description,
        status,
        startDate,
        endDate,
        tasks
      })
      setIsSubmitting(false)
      setError(null)
    } catch (error) {
      console.error('프로젝트 저장 중 오류 발생:', error)
      setError('프로젝트 저장에 실패했어요')
      setIsSubmitting(false)
    }
  }

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  }

  const handleTaskChange = (index: number, field: keyof ProjectTask, value: any) => {
    const updatedTasks = [...tasks]
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value,
      updatedAt: new Date()
    }
    setTasks(updatedTasks)
  }

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            상태
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Project['status'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="active">진행 중</option>
            <option value="completed">완료</option>
            <option value="archived">보관됨</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              시작일
            </label>
            <input
              type="date"
              id="startDate"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              종료일
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">할 일 목록</h3>
          <button
            type="button"
            onClick={handleAddTask}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            작업 추가
          </button>
        </div>

        {tasks.map((task, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 space-y-4">
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                placeholder="작업 제목"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <textarea
                value={task.description}
                onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                placeholder="작업 설명"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={task.status}
                  onChange={(e) => handleTaskChange(index, 'status', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="todo">할 일</option>
                  <option value="in_progress">진행 중</option>
                  <option value="completed">완료</option>
                </select>
                <select
                  value={task.priority}
                  onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveTask(index)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

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
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : initialData ? '수정하기' : '생성하기'}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm 