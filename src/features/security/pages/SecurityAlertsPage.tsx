// 🛡️ SecurityAlertsPage: 내 보안 알림을 한눈에 볼 수 있는 페이지예요!
import React, { useEffect, useState } from 'react'
import { securityAlertService } from '../services/securityAlertService'
import SecurityAlertList from '../components/SecurityAlertList'
import { SecurityAlert } from '../types'

const SecurityAlertsPage: React.FC = () => {
  // 🛡️ 보안 알림 상태
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  // ⏳ 로딩 상태
  const [loading, setLoading] = useState(false)
  // 🚨 에러 상태
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await securityAlertService.getAlerts()
        setAlerts(data)
      } catch (err: any) {
        setError('보안 알림을 불러오지 못했어요.')
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  if (loading) return <div>⏳ 보안 알림을 불러오는 중이에요...</div>
  if (error) return <div>🚨 {error}</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">보안 알림</h2>
      <SecurityAlertList alerts={alerts} />
    </div>
  )
}

export default SecurityAlertsPage
