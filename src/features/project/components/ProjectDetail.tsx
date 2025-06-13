// 📂 ProjectDetail: 선택한 프로젝트의 상세 정보를 보여주는 컴포넌트예요!

// 📦 React, useAuth, 서비스, 아이콘 등 필요한 모듈을 가져와요
import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { updateProject, deleteProject } from '@/services/projectService'
import type { Project } from '@/types/firestore'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import ProjectTaskForm from './ProjectTaskForm'

// 📋 project: 표시할 프로젝트 데이터
// 🔀 onUpdate: 프로젝트 수정 후 리스트 업데이트 콜백
// 🗑️ onDelete: 프로젝트 삭제 후 리스트 업데이트 콜백
interface ProjectDetailProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => Promise<void>;
}

const ProjectDetail = ({ project, onUpdate, onDelete }: ProjectDetailProps) => {
  // 🔑 useAuth: 로그인된 사용자 정보를 가져와요
  const { user } = useAuth()

  // ✏️ isEditing: 편집 모드 여부를 저장해요
  const [isEditing, setIsEditing] = useState(false)
  // 📝 editedTitle: 수정 중인 프로젝트 제목을 저장해요
  const [editedTitle, setEditedTitle] = useState(project.title)
  // 📄 editedDescription: 수정 중인 설명을 저장해요
  const [editedDescription, setEditedDescription] = useState(project.description || '')
  // ⏰ editedStartDate, editedEndDate: 수정 중인 시작/종료 날짜를 저장해요
  const [editedStartDate, setEditedStartDate] = useState(project.startDate)
  const [editedEndDate, setEditedEndDate] = useState(project.endDate)
  // ⚙️ editedStatus: 수정 중인 상태를 저장해요
  const [editedStatus, setEditedStatus] = useState(project.status)
  // 🗑️ isDeleting: 삭제 진행 중 로딩 표시를 제어해요
  const [isDeleting, setIsDeleting] = useState(false)

  // ✏️ handleEdit: 편집 모드로 전환하고 기존 데이터를 입력 필드에 불러와요
  const handleEdit = () => {
    setIsEditing(true)
    setEditedTitle(project.title)
    setEditedDescription(project.description || '')
    setEditedStartDate(project.startDate)
    setEditedEndDate(project.endDate)
    setEditedStatus(project.status)
  }

  // 💾 handleSave: 수정된 데이터를 서버에 저장하고 onUpdate 콜백을 호출해요
  const handleSave = async () => {
    if (!user) return

    try {
      const updatedProject = {
        ...project,
        title: editedTitle,
        description: editedDescription,
        startDate: editedStartDate,
        endDate: editedEndDate,
        status: editedStatus,
        updatedAt: new Date()
      }
      await updateProject(project.id, updatedProject)
      onUpdate(updatedProject)
      setIsEditing(false)
    } catch (error) {
      console.error('프로젝트 업데이트 중 오류 발생:', error)
    }
  }

  // 🚫 handleCancel: 편집을 취소하고 원래 데이터로 돌아가요
  const handleCancel = () => {
    setIsEditing(false)
    setEditedTitle(project.title)
    setEditedDescription(project.description || '')
    setEditedStartDate(project.startDate)
    setEditedEndDate(project.endDate)
    setEditedStatus(project.status)
  }

  // 🗑️ handleDelete: 삭제 확인 후 onDelete 콜백을 호출해요
  const handleDelete = async () => {
    if (!user) return

    if (window.confirm('정말로 이 프로젝트를 삭제하시겠어요?')) {
      setIsDeleting(true)
      try {
        await onDelete(project.id)
      } catch (error) {
        console.error('프로젝트 삭제 중 오류 발생:', error)
        setIsDeleting(false)
      }
    }
  }

  const handleTaskStatusChange = async (taskId: string, status: Project['status']) => {
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
      case 'active':
        return 'bg-gray-100 text-gray-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return '진행 중'
      case 'completed':
        return '완료'
      case 'archived':
        return '보관됨'
      default:
        return '알 수 없음'
    }
  }

  return (
    <>
      {/* 카드 컨테이너 */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* 🏷️ 제목/설명/날짜/상태 표시 영역에 주석 추가 */}
        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">제목</label>
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{project.title}</p>
            )}
          </div>
  
          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">설명</label>
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-gray-900">{project.description || '설명이 없어요'}</p>
            )}
          </div>
  
          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">시작일</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedStartDate}
                  onChange={(e) => setEditedStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{project.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">종료일</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedEndDate}
                  onChange={(e) => setEditedEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{project.endDate}</p>
              )}
            </div>
          </div>
  
          {/* 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">상태</label>
            {isEditing ? (
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value as Project['status'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="active">진행 중</option>
                <option value="completed">완료</option>
                <option value="archived">보관됨</option>
              </select>
            ) : (
              <p className="mt-1 text-gray-900">
                {project.status === 'active' ? '진행 중' :
                 project.status === 'completed' ? '완료' : '보관됨'}
              </p>
            )}
          </div>
        </div>
  
        {/* 🔘 저장/취소/편집/삭제/닫기 버튼 역할 설명 */}
        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                저장
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 inline-block mr-1" />
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <TrashIcon className="h-4 w-4 inline-block mr-1" />
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </>
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