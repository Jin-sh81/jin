import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Project, ProjectTask } from '@/types/project'
import { useAuth } from '@/hooks/useAuth'

/**
 * 🎯 프로젝트 만들기/수정하기 폼 컴포넌트
 * 사용자가 새로운 프로젝트를 만들거나
 * 기존 프로젝트를 수정할 때 사용하는 화면입니다.
 * 제목, 마감일, 할 일 목록, 메모를 입력할 수 있습니다.
 */
interface ProjectFormProps {
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Project['status']>('not_started')
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState('')
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return false
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError('종료일은 시작일보다 이후여야 합니다.')
      return false
    }

    const invalidTasks = tasks.filter(task => !task.title.trim())
    if (invalidTasks.length > 0) {
      setError('모든 작업의 제목을 입력해주세요.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      setError(null)

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        startDate,
        endDate: endDate || undefined,
        tasks: tasks.map(task => ({
          ...task,
          title: task.title.trim()
        }))
      })
    } catch (error) {
      console.error('프로젝트 생성 실패:', error)
      setError('프로젝트 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTask = () => {
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: '',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString()
    }])
  }

  const handleTaskChange = (index: number, field: keyof ProjectTask, value: string) => {
    const updatedTasks = [...tasks]
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    }
    setTasks(updatedTasks)
  }

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Project['status'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="not_started">시작 전</option>
          <option value="in_progress">진행 중</option>
          <option value="completed">완료</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">시작일</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">종료일</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">작업 목록</label>
          <button
            type="button"
            onClick={handleAddTask}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            작업 추가
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                placeholder="작업 제목"
                required
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                value={task.priority}
                onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">낮음</option>
                <option value="medium">중간</option>
                <option value="high">높음</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveTask(index)}
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '생성 중...' : '생성'}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm 