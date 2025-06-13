// 📈 ProjectStatsPage: 프로젝트 통계만 모아서 보여주는 페이지예요!

// 📦 React, useEffect, useState, getProjectStats, useAuth 등 필요한 모듈을 가져와요
import React, { useEffect, useState } from 'react'
import { getProjectStats } from '@/services/projectService'
import { useAuth } from '@/hooks/useAuth'

// 🔑 useAuth: 로그인된 사용자 UID를 가져와요
const ProjectStatsPage: React.FC = () => {
  const { user } = useAuth()

  // 📊 stats: { total, completed, rate } 형태의 통계 데이터를 저장해요
  // ⏳ isLoading: 통계 로딩 중 표시를 제어해요
  // 🚨 error: 통계 로딩 중 에러 메시지를 저장해요
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    rate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔍 useEffect: 컴포넌트 마운트 시 getProjectStats 호출 후 stats 상태 업데이트해요
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)
        const statsData = await getProjectStats(user.uid)
        setStats({
          total: statsData.totalProjects,
          completed: statsData.completedProjects,
          rate: statsData.completionRate
        })
      } catch (err) {
        setError('통계를 불러오는 중 오류가 발생했습니다.')
        console.error('통계 로딩 오류:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  // ⏳ isLoading true 시 스피너 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 🚨 error 발생 시 에러 메시지 표시
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">프로젝트 통계</h1>

      {/* 📊 통계 표시 영역: stats.total, stats.completed, stats.rate를 보여줘요 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">전체 프로젝트</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">완료된 프로젝트</h2>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">완료율</h2>
          <p className="text-3xl font-bold text-purple-600">
            {stats.rate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* 📊 추가: Chart 컴포넌트 연동 검토 가능 */}
    </div>
  )
}

export default ProjectStatsPage 