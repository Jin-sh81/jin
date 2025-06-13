// 📊 ProjectPage: 프로젝트 통계와 목록을 한 눈에 볼 수 있는 메인 페이지예요!

// 📦 React, useEffect, useState, getProjectStats, useAuth, useNavigate 등 필요한 모듈을 가져와요
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getProjectStats } from '@/services/projectService'
import ProjectList from '../components/ProjectList'
import { ProjectStats } from '../components/ProjectStats'
import type { Project } from '@/types/firestore'

const ProjectPage = () => {
  // 🔑 useAuth: 로그인된 사용자 UID를 가져와요
  const { user } = useAuth()
  const navigate = useNavigate()

  // 📈 stats: { total, completed, rate } 형태의 통계 데이터를 저장해요
  // 📋 projects: 프로젝트 목록을 저장해요 (추후 fetchProjects 추가)
  // ⏳ isLoading: 데이터 불러오기 로딩 상태를 알려줘요
  // 🚨 error: 데이터 로딩 중 에러 메시지를 저장해요
  const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 })
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔄 useEffect: 컴포넌트 마운트 시 getProjectStats를 호출해 stats 상태를 업데이트해요
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const statsData = await getProjectStats(user.uid)
        setStats({
          total: statsData.totalProjects,
          completed: statsData.completedProjects,
          rate: statsData.completionRate
        })
      } catch (error) {
        console.error('통계 데이터 로딩 실패:', error)
        setError('통계 데이터를 불러오는데 실패했어요')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  // 🔍 fetchProjects: 서버에서 프로젝트 목록을 가져와 projects 상태에 저장해요
  const fetchProjects = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      // TODO: 프로젝트 목록 가져오기 구현
      setProjects([])
    } catch (error) {
      console.error('프로젝트 목록 로딩 실패:', error)
      setError('프로젝트 목록을 불러오는데 실패했어요')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중이에요...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 📊 통계 영역: stats.total, stats.completed, stats.rate를 보여줘요 */}
      <div className="mb-8">
        <ProjectStats
          total={stats.total}
          completed={stats.completed}
          rate={stats.rate}
        />
      </div>

      {/* ➕ 프로젝트 생성 또는 상세 페이지로 이동할 버튼을 배치할 수 있어요 */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/projects/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 프로젝트 만들기
        </button>
      </div>

      {/* 📜 ProjectList 컴포넌트: projects 배열을 전달해 렌더링해요 */}
      <ProjectList
        projects={projects}
        onProjectClick={(project: Project) => navigate(`/projects/${project.id}`)}
        onUpdate={fetchProjects}
        onDelete={fetchProjects}
      />
    </div>
  )
}

export default ProjectPage 