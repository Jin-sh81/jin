import React, { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ProjectTask } from '@/types/project'
import  ProjectTaskForm  from './ProjectTaskForm'

interface ProjectTaskListProps {
  projectId: string;
  tasks: ProjectTask[];
  onTaskCreate: (task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onTaskUpdate: (taskId: string, task: Partial<ProjectTask>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

export const ProjectTaskList: React.FC<ProjectTaskListProps> = ({
  projectId,
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [isCreating, setIsCreating] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleCreateTask = async (task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    await onTaskCreate(task)
    setIsCreating(false)
  }

  const handleUpdateTask = async (taskId: string, task: Partial<ProjectTask>) => {
    await onTaskUpdate(taskId, task)
    setEditingTaskId(null)
  }

  const handleDeleteTask = async (taskId: string) => {
    setIsDeleting(taskId)
    try {
      await onTaskDelete(taskId)
    } finally {
      setIsDeleting(null)
    }
  }

  const getPriorityColor = (priority: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return '할 일'
      case 'in_progress':
        return '진행 중'
      case 'done':
        return '완료'
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">작업 목록</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          작업 추가
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-4 rounded-lg shadow">
          <ProjectTaskForm
            projectId={projectId}
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            {editingTaskId === task.id ? (
              <ProjectTaskForm
                projectId={projectId}
                initialData={task}
                onSubmit={(updatedTask) => handleUpdateTask(task.id, updatedTask)}
                onCancel={() => setEditingTaskId(null)}
              />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTaskId(task.id)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={isDeleting === task.id}
                      className="p-1 text-red-400 hover:text-red-500 disabled:opacity-50"
                    >
                      {isDeleting === task.id ? '삭제 중...' : '삭제'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '중간' : '낮음'}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {getStatusText(task.status)}
                  </span>
                  {task.dueDate && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {format(new Date(task.dueDate), 'yyyy년 MM월 dd일', { locale: ko })}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {tasks.length === 0 && !isCreating && (
          <p className="text-center text-gray-500 py-4">
            등록된 작업이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
} 

