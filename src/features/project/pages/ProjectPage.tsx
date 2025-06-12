import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject } from '@/services/projectService'
import type { Project } from '@/types/project'
import ProjectList from '../components/ProjectList'
import ProjectForm from '../components/ProjectForm'
import Button from '@/shared/components/Button'
import { useAuth } from '@/hooks/useAuth'
import { PlusIcon } from '@heroicons/react/24/outline'

const ProjectPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const fetchProjects = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const projectsData = await getProjects(user.uid)
      setProjects(projectsData)
    } catch (error) {
      console.error('프로젝트 목록 로딩 실패:', error)
      setError('프로젝트 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleCreateProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    try {
      setError(null)
      const newProject = await createProject(user.uid, {
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      if (newProject) {
        await fetchProjects() // 프로젝트 목록 새로고침
        setIsCreating(false)
      }
    } catch (error) {
      console.error('프로젝트 생성 실패:', error)
      setError('프로젝트 생성에 실패했습니다.')
    }
  }

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">프로젝트</h1>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          프로젝트 생성
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {projects.length > 0 ? (
        <ProjectList
          projects={projects}
          onProjectClick={handleProjectClick}
          onUpdate={fetchProjects}
          onDelete={fetchProjects}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {isCreating
              ? '새 프로젝트를 생성해보세요.'
              : '등록된 프로젝트가 없습니다.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectPage 