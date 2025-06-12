import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { updateProject } from '@/services/projectService'
import type { Project, ProjectTask } from '@/types/project'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import  ProjectTaskForm from './ProjectTaskForm'

interface ProjectDetailProps {
  project: Project
  onUpdate: (updatedProject: Project) => void
  onDelete: (projectId: string) => Promise<void>
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onUpdate,
  onDelete
}) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(project.title)
  const [editedDescription, setEditedDescription] = useState(project.description || '')
  const [editedStatus, setEditedStatus] = useState(project.status)
  const [editedStartDate, setEditedStartDate] = useState(project.startDate)
  const [editedEndDate, setEditedEndDate] = useState(project.endDate || '')
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleUpdate = async () => {
    if (!user) return

    try {
      const updatedProject = await updateProject(user.uid, project.id, {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        startDate: editedStartDate,
        endDate: editedEndDate || undefined
      })
      onUpdate(updatedProject)
      setIsEditing(false)
    } catch (error) {
      console.error('프로젝트 업데이트 실패:', error)
    }
  }

  const handleTaskStatusChange = async (taskId: string, status: ProjectTask['status']) => {
    if (!user) return

    try {
      const updatedTasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      )

      const updatedProject = await updateProject(user.uid, project.id, {
        tasks: updatedTasks
      })
      onUpdate(updatedProject)
    } catch (error) {
      console.error('작업 상태 업데이트 실패:', error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    if (!user) return

    try {
      const updatedTasks = project.tasks.filter(task => task.id !== taskId)
      const updatedProject = await updateProject(user.uid, project.id, {
        tasks: updatedTasks
      })
      onUpdate(updatedProject)
    } catch (error) {
      console.error('작업 삭제 실패:', error)
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'not_started':
        return '시작 전'
      case 'in_progress':
        return '진행 중'
      case 'completed':
        return '완료'
      default:
        return '알 수 없음'
    }
  }
  return (
    <>
      {/* 카드 컨테이너 */}
      <div className="bg-white shadow rounded-lg p-6">
        {isEditing ? (
          <div className="space-y-4">
            {/* 제목 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">제목</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
  
            {/* 설명 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">설명</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
  
            {/* 상태 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">상태</label>
              <select
                value={editedStatus}
                onChange={(e) =>
                  setEditedStatus(e.target.value as Project['status'])
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="not_started">시작 전</option>
                <option value="in_progress">진행 중</option>
                <option value="completed">완료</option>
              </select>
            </div>
  
            {/* 마감일 선택 */}
            <div>
              <input
                type="date"
                value={editedEndDate}
                onChange={(e) => setEditedEndDate(e.target.value)}
                className="mt-2 text-gray-600"
              />
            </div>
          </div>
        ) : (
          /* 보기 모드 */
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            {project.endDate && (
              <p className="text-gray-600">
                마감일:{' '}
                {format(new Date(project.endDate), 'PPP', { locale: ko })}
              </p>
            )}
          </div>
        )}
  
        {/* 저장/취소 또는 수정 버튼 */}
        <div className="flex gap-2 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="text-blue-600 hover:text-blue-800"
              >
                저장
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
  
      {/* 태스크 섹션 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">태스크</h3>
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> 태스크 추가
          </button>
        </div>
  
        {/* 태스크 추가 폼 */}
        {isAddingTask && (
          <div className="mb-4">
            <ProjectTaskForm
              projectId={project.id}
              onCancel={() => setIsAddingTask(false)}
              onSubmit={async (task) => {
                if (!user) return
                try {
                  const updatedTasks = [...project.tasks, { ...task, id: Date.now().toString(), createdAt: new Date().toISOString() }]
                  const updatedProject = await updateProject(user.uid, project.id, {
                    tasks: updatedTasks
                  })
                  onUpdate(updatedProject)
                  setIsAddingTask(false)
                } catch (error) {
                  console.error('작업 추가 실패:', error)
                }
              }}
            />
          </div>
        )}
  
        {/* 태스크 리스트 */}
        <div className="space-y-2">
          {project.tasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={(e) =>
                    handleTaskStatusChange(task.id, e.target.checked ? 'completed' : 'todo')
                  }
                  className="mr-3"
                />
                <span
                  className={`${
                    task.status === 'completed'
                      ? 'line-through text-gray-500'
                      : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTaskDelete(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProjectDetail 