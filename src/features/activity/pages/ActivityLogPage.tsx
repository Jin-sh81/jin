// 📝 ActivityLogPage: 내 로그인 기록을 한눈에 볼 수 있는 페이지예요!
import React, { useEffect, useState } from 'react'
import { activityService } from '../services/activityService'
import ActivityLogTable from '../components/ActivityLogTable'
import { ActivityLog } from '../types'

const ActivityLogPage: React.FC = () => {
  // 📝 로그인 기록 상태
  const [logs, setLogs] = useState<ActivityLog[]>([])
  // ⏳ 로딩 상태
  const [loading, setLoading] = useState(false)
  // 🚨 에러 상태
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await activityService.getActivityLogs()
        setLogs(data)
      } catch (err: any) {
        setError('로그인 기록을 불러오지 못했어요.')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) return <div>⏳ 로그인 기록을 불러오는 중이에요...</div>
  if (error) return <div>🚨 {error}</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">로그인 기록</h2>
      <ActivityLogTable logs={logs} />
    </div>
  )
}

export default ActivityLogPage
