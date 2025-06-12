import { useState } from 'react'
import type { Project } from '@/types/project'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarIcon, FlagIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'
import { deleteProject } from '@/services/projectService'
import { ProjectDetail } from './ProjectDetail'

/**
 * 🎯 프로젝트 목록 컴포넌트
 * 사용자가 만든 모든 프로젝트를 보여주는 화면입니다.
 * 각 프로젝트는 카드 형태로 표시되며,
 * 프로젝트의 제목, 마감일, 진행 상황을 한눈에 볼 수 있습니다.
 */

// 프로젝트 목록 컴포넌트의 props 타입 정의
interface ProjectListProps {
  projects: Project[];  // 보여줄 프로젝트 목록
  onProjectClick?: (projectId: string) => void;  // 프로젝트를 클릭했을 때 실행할 함수
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => Promise<void>;
}

// 프로젝트 목록을 보여주는 컴포넌트
export const ProjectList: React.FC<ProjectListProps> = ({
  projects = [],
  onProjectClick,
  onUpdate,
  onDelete
}) => {
  const { user } = useAuth()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 프로젝트를 클릭했을 때 실행되는 함수
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    onProjectClick?.(project.id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    setError(null)
  }

  const handleDelete = async (projectId: string) => {
    if (!user) return
    
    try {
      setIsDeleting(true)
      setError(null)
      await onDelete(projectId)
      handleCloseModal()
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error)
      setError('프로젝트 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  // 우선순위에 따른 색상과 텍스트를 반환하는 함수
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'text-red-600', text: '높음' }
      case 'medium':
        return { color: 'text-yellow-600', text: '중간' }
      case 'low':
        return { color: 'text-green-600', text: '낮음' }
      default:
        return { color: 'text-gray-600', text: '없음' }
    }
  }

  // 상태에 따른 색상과 텍스트를 반환하는 함수
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'not_started':
        return { color: 'text-gray-600', text: '시작 전' }
      case 'in_progress':
        return { color: 'text-blue-600', text: '진행 중' }
      case 'completed':
        return { color: 'text-green-600', text: '완료' }
      default:
        return { color: 'text-gray-600', text: '없음' }
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
    <div className="space-y-4">
      {projects.map((project) => {
        const priorityInfo = getPriorityInfo(project.priority || 'low')
        const statusInfo = getStatusInfo(project.status)

        return (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {format(new Date(project.startDate), 'yyyy년 MM월 dd일', { locale: ko })}
                  {project.endDate && ` ~ ${format(new Date(project.endDate), 'yyyy년 MM월 dd일', { locale: ko })}`}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>

            {project.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {project.tasks.length}개의 작업
                </span>
                <span className="text-sm text-gray-500">
                  {project.tasks.filter(task => task.status === 'completed').length}개 완료
                </span>
              </div>
            </div>
          </div>
        )
      })}

      {selectedProject && isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProjectDetail
              project={selectedProject}
              onUpdate={onUpdate}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}
            <div className="p-4 border-t">
              <button
                onClick={handleCloseModal}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectList 