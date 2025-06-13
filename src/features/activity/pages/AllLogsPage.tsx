// 📋 AllLogsPage: 내 모든 활동 로그를 한눈에 볼 수 있는 페이지예요!
import React, { useEffect, useState } from 'react'
import { activityService } from '../services/activityService'
import AllLogsTable from '../components/AllLogsTable'
import { AllLog } from '../types'

const AllLogsPage: React.FC = () => {
  // 📝 활동 로그 상태
  const [logs, setLogs] = useState<AllLog[]>([])
  // ⏳ 로딩 상태
  const [loading, setLoading] = useState(false)
  // 🚨 에러 상태
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await activityService.getAllLogs()
        setLogs(data)
      } catch (err: any) {
        setError('활동 로그를 불러오지 못했어요.')
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) return <div>⏳ 활동 로그를 불러오는 중이에요...</div>
  if (error) return <div>🚨 {error}</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">활동 로그</h2>
      <AllLogsTable logs={logs} />
    </div>
  )
}

export default AllLogsPage
