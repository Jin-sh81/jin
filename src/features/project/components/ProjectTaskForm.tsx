// ✏️ ProjectTaskForm: 특정 프로젝트의 작업을 생성 또는 수정할 수 있는 입력 폼이에요!

// 📦 React, useState, ProjectTask 타입 등 필요한 모듈을 가져와요
import React, { useState } from 'react'
import type { ProjectTask } from '@/types/firestore'

// 🔢 projectId: 작업이 속한 프로젝트 ID
// ➕ onSubmit: 새 작업 생성 또는 기존 작업 업데이트 콜백
// 📥 initialData?: 수정할 작업의 초기 데이터를 받아요
// ❌ onCancel: 폼 취소 시 호출되는 콜백
interface ProjectTaskFormProps {
  projectId: string;
  onSubmit: (task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Partial<ProjectTask>;
  onCancel: () => void;
}

export const ProjectTaskForm: React.FC<ProjectTaskFormProps> = ({
  projectId,
  onSubmit,
  initialData,
  onCancel,
}) => {
  // 📝 title: 작업 제목을 저장해요
  // 📄 description: 작업 설명을 저장해요
  // ⚙️ priority: 작업 우선순위를 저장해요
  // ⏳ isSubmitting: 제출 중 로딩 표시를 제어해요
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState(initialData?.priority || 'medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✋ 폼 제출 방지: 페이지 리로드 없이 제출 처리해요
  // 🚨 title 빈값 검증 및 projectId 존재 여부 확인
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (!projectId) {
      console.error('projectId가 없습니다')
      return
    }

    // 🔄 isSubmitting true: 제출 시작
    setIsSubmitting(true)
    try {
      // 💾 onSubmit 호출: 부모 컴포넌트에 작업 데이터를 전달해요
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status: initialData?.status || 'todo'
      })
      // ✖️ onCancel: 제출 후 폼 닫기
      onCancel()
    } catch (error) {
      console.error('작업 저장 중 오류 발생:', error)
    } finally {
      // 🔄 isSubmitting false: 제출 완료
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 📋 제목(input): title 상태와 연결돼 있어요 */}
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

      {/* 📜 설명(textarea): description 상태와 연결돼 있어요 */}
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

      {/* ⚙️ 우선순위(select): priority 상태와 연결돼 있어요 */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          우선순위
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as ProjectTask['priority'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="low">낮음</option>
          <option value="medium">중간</option>
          <option value="high">높음</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        {/* ❌ 취소 버튼: onCancel 호출 */}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
        {/* ✅ 저장 버튼(type submit): handleSubmit 실행, isSubmitting 상태에 따라 disabled 처리 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}

export default ProjectTaskForm
