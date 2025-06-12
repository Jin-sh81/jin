import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjectStats } from '@/services/projectService'
import type { ProjectStats } from '@/types/project'
import { useAuth } from '@/hooks/useAuth'

export default function ProjectStatsPage() {
  // 🔽 현재 로그인된 사용자 uid를 가져옵니다.
  const uid = useAuth().user?.uid || ''
  
  // �� stats 상태: { total, completed, rate } 구조로 통계 데이터를 저장합니다.
  const [stats, setStats] = useState<{ total: number; completed: number; rate: number }>({
    total: 0,
    completed: 0,
    rate: 0,
  })

  // 🔽 컴포넌트 마운트 시 getProjectStats를 호출해 통계 데이터를 가져옵니다.
  useEffect(() => {
    if (!uid) return
    getProjectStats(uid).then(data => {
      setStats(data)
    })
  }, [uid])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">프로젝트 통계</h1>
      <p>총 프로젝트 수: {stats.total}</p>
      <p>완료된 프로젝트 수: {stats.completed}</p>
      <p>완료율: {stats.rate}%</p>
      {/* 🔽 필요하면 그래프 라이브러리(ex. Chart.js)를 사용해 시각화할 수 있습니다. */}
    </div>
  )
} 