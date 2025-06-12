import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, updateProject, deleteProject } from '@/services/projectService'
import type { Project, ProjectTask } from '@/types/project'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { auth } from '@/infrastructure/firebase/firebaseConfig'
// 🔽 주석: 프로젝트를 가져오고, 편집/삭제하는 서비스 함수들입니다.
import { getProjectTasks, createProjectTask, updateProjectTask, deleteProjectTask } from '@/services/projectService'
// 🔽 주석: ProjectDetailModal 컴포넌트는 상세보기/수정 모달 UI를 제공합니다.
import ProjectDetailModal from '@/features/project/components/ProjectDetailModal'
import { ProjectStats as ProjectStatsType } from '@/types/project'
import { ProjectDetail } from '../components/ProjectDetail'
import { useAuth } from '@/hooks/useAuth'
import { ProjectTaskList } from '../components/ProjectTaskList'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ProjectCalendar } from '../components/ProjectCalendar'
import { ProjectStats } from '../components/ProjectStats'
import { ProjectTimeline } from '../components/ProjectTimeline'

// 🔽 프로젝트 타입 정의가 필요하다면, types 파일에서 가져옵니다.
// import { ProjectType } from '@/features/project/types'

// 🎯 프로젝트 상세 페이지 컴포넌트예요
// 📝 프로젝트의 자세한 내용을 보여주는 페이지예요
const ProjectDetailPage: React.FC = () => {
  // 🔍 URL에서 프로젝트 ID를 가져와요 (예: /projects/123 에서 123을 가져와요)
  const { projectId } = useParams<{ projectId: string }>()
  // 🚶‍♂️ 다른 페이지로 이동할 때 사용할 수 있어요
  const navigate = useNavigate()
  // 👤 현재 로그인한 사용자의 ID를 가져와요
  const { user } = useAuth()
  
  // 📦 프로젝트 정보를 저장할 상자예요
  // 처음에는 비어있고(null), 나중에 프로젝트 정보를 넣어요
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedStatus, setEditedStatus] = useState<Project['status']>('not_started')
  const [editedStartDate, setEditedStartDate] = useState('')
  const [editedEndDate, setEditedEndDate] = useState('')

  // 통계 데이터 계산
  const stats: ProjectStatsType = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length,
    completionRate: tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length) * 100 : 0
  }

  const fetchProjectData = useCallback(async () => {
    if (!user || !projectId) return

    try {
      setIsLoading(true)
      setError(null)

      const projectData = await getProject(user.uid, projectId)
      if (!projectData) {
        setError('프로젝트를 찾을 수 없습니다.')
        return
      }

      setProject(projectData)
      setEditedTitle(projectData.title)
      setEditedDescription(projectData.description || '')
      setEditedStatus(projectData.status)
      setEditedStartDate(projectData.startDate || '')
      setEditedEndDate(projectData.endDate || '')
      setTasks(projectData.tasks || [])
    } catch (error) {
      console.error('프로젝트 데이터 로딩 실패:', error)
      setError('프로젝트 데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [user, projectId])

  useEffect(() => {
    fetchProjectData()
  }, [fetchProjectData])

  const handleUpdateProject = async () => {
    if (!user || !projectId || !project) return

    try {
      setIsSaving(true)
      setError(null)

      const updatedProject = await updateProject(user.uid, projectId, {
        ...project,
        title: editedTitle.trim(),
        description: editedDescription.trim(),
        status: editedStatus,
        startDate: editedStartDate || undefined,
        endDate: editedEndDate || undefined,
      })

      setProject(updatedProject)
      setIsEditing(false)
    } catch (error) {
      console.error('프로젝트 업데이트 실패:', error)
      setError('프로젝트 업데이트에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!user || !projectId) return

    if (!window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return

    try {
      setIsDeleting(true)
      setError(null)
      await deleteProject(user.uid, projectId)
      navigate('/projects')
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error)
      setError('프로젝트 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateTask = async (task: Omit<ProjectTask, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !projectId) return

    try {
      setError(null)
      const newTask = await createProjectTask(user.uid, projectId, {
        ...task,
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      setTasks(prev => [...prev, newTask])
      await fetchProjectData() // 프로젝트 데이터 새로고침
    } catch (error) {
      console.error('작업 생성 실패:', error)
      setError('작업 생성에 실패했습니다.')
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<ProjectTask>) => {
    if (!user || !projectId) return

    try {
      setError(null)
      const updatedTask = await updateProjectTask(user.uid, projectId, taskId, updates)
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task))
      await fetchProjectData() // 프로젝트 데이터 새로고침
    } catch (error) {
      console.error('작업 업데이트 실패:', error)
      setError('작업 업데이트에 실패했습니다.')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!user || !projectId) return

    try {
      setError(null)
      await deleteProjectTask(user.uid, projectId, taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      await fetchProjectData() // 프로젝트 데이터 새로고침
    } catch (error) {
      console.error('작업 삭제 실패:', error)
      setError('작업 삭제에 실패했습니다.')
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-gray-100 text-gray-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return '계획'
      case 'in-progress':
        return '진행 중'
      case 'completed':
        return '완료'
      case 'on-hold':
        return '보류'
      default:
        return status
    }
  }

  // ⏳ 프로젝트 정보를 가져오는 동안 보여줄 메시지예요
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">프로젝트를 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    // 📱 페이지의 전체 모양을 만드는 상자예요
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          프로젝트 목록으로
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          )}
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdateProject}
                  disabled={isSaving}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  수정
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>

          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          ) : (
            <p className="text-gray-600">{project.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">시작일</h3>
              <p className="mt-1 text-sm text-gray-900">
                {project.startDate ? format(new Date(project.startDate), 'yyyy년 MM월 dd일', { locale: ko }) : '미정'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">종료일</h3>
              <p className="mt-1 text-sm text-gray-900">
                {project.endDate ? format(new Date(project.endDate), 'yyyy년 MM월 dd일', { locale: ko }) : '미정'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">작업 목록</h2>
        {projectId && (
          <ProjectTaskList
            projectId={projectId}
            tasks={tasks}
            onTaskCreate={handleCreateTask}
            onTaskUpdate={handleUpdateTask}
            onTaskDelete={handleDeleteTask}
          />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ProjectStats stats={stats} />
        </div>
        <div>
          <ProjectCalendar tasks={tasks} />
        </div>
      </div>

      <div className="mt-8">
        <ProjectTimeline tasks={tasks} />
      </div>
    </div>
  )
}

export default ProjectDetailPage 