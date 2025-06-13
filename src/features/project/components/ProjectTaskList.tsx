// 📋 ProjectTaskList: 특정 프로젝트의 작업들을 리스트로 보여주고 관리하는 컴포넌트예요!

// 📦 React, useState, format, ProjectTask 타입, ProjectTaskForm, 서비스 함수 등을 가져와요
import React, { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ProjectTaskForm } from './ProjectTaskForm'
import type { ProjectTask } from '@/types/firestore'

// 🔢 projectId: 작업이 속한 프로젝트의 ID
// 📄 tasks: 표시할 작업 배열
// ➕ onTaskCreate: 새로운 작업 생성 콜백
// 🛠️ onTaskUpdate: 작업 수정 콜백
// 🗑️ onTaskDelete: 작업 삭제 콜백
interface ProjectTaskListProps {
  projectId: string;
  tasks: ProjectTask[];
  onTaskCreate: (task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onTaskUpdate: (taskId: string, task: Partial<ProjectTask>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

const ProjectTaskList = ({ projectId, tasks, onTaskCreate, onTaskUpdate, onTaskDelete }: ProjectTaskListProps) => {
  // ✍️ isCreating: 새 작업 작성 폼 표시 여부를 저장해요
  // ✏️ editingTaskId: 수정 중인 작업 ID를 저장해요
  // ⏳ isDeleting: 삭제 중인 작업 ID를 저장해요
  const [isCreating, setIsCreating] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // ➕ handleCreateTask: onTaskCreate 호출 후 작성 폼을 닫아요
  const handleCreateTask = async (task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    await onTaskCreate(task)
    setIsCreating(false)
  }

  // 📝 handleUpdateTask: onTaskUpdate 호출 후 editingTaskId를 초기화해요
  const handleUpdateTask = async (taskId: string, task: Partial<ProjectTask>) => {
    await onTaskUpdate(taskId, task)
    setEditingTaskId(null)
  }

  // 🗑️ handleDeleteTask: onTaskDelete 호출 전후 삭제 상태를 토글해요
  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsDeleting(taskId)
      await onTaskDelete(taskId)
    } finally {
      setIsDeleting(null)
    }
  }

  // 🎨 getPriorityColor: 우선순위에 따라 배경/텍스트 색상을 반환해요
  const getPriorityColor = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 🔤 getStatusText: 상태 코드를 읽기 쉬운 텍스트로 변환해요
  const getStatusText = (status: ProjectTask['status']) => {
    switch (status) {
      case 'todo':
        return '할 일'
      case 'in_progress':
        return '진행 중'
      case 'completed':
        return '완료'
      default:
        return '알 수 없음'
    }
  }

  return (
    <div className="space-y-6">
      {/* 🏷️ 제목 및 추가 버튼 영역: 타이틀과 새 작업 버튼을 보여줘요 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">작업 목록</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 작업 추가
        </button>
      </div>

      {/* 📝 isCreating true일 때 ProjectTaskForm 렌더링 */}
      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow">
          <ProjectTaskForm
            projectId={projectId}
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {/* 📜 tasks.map: 각 작업을 카드로 렌더링해요 */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-lg shadow">
            {/* 🔹 수정 모드일 때 ProjectTaskForm으로 대체 */}
            {editingTaskId === task.id ? (
              <ProjectTaskForm
                projectId={projectId}
                initialData={{
                  title: task.title,
                  description: task.description,
                  priority: task.priority,
                  status: task.status
                }}
                onSubmit={(updatedTask) => handleUpdateTask(task.id, updatedTask)}
                onCancel={() => setEditingTaskId(null)}
              />
            ) : (
              /* 🔹 기본 모드일 때 제목, 설명, 우선순위, 상태, 기한 표시 */
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                    {task.description && (
                      <p className="mt-1 text-gray-600">{task.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {/* 🔹 수정 및 삭제 버튼 기능 설명 */}
                    <button
                      onClick={() => setEditingTaskId(task.id)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={isDeleting === task.id}
                      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ⚠️ tasks 빈 배열일 때 안내 메시지 표시 */}
      {tasks.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <p className="text-gray-500">등록된 작업이 없어요</p>
        </div>
      )}
    </div>
  )
}

export default ProjectTaskList 

