// 🗝️ SessionManagementPage: 세션/기기 관리와 종료, 제한을 한눈에 할 수 있어요!
import React, { useEffect, useState } from 'react'
import { sessionService } from '../services/sessionService'
import SessionList from '../components/SessionList'
import DeviceList from '../components/DeviceList'
import { Session, Device } from '../types'

const SessionManagementPage: React.FC = () => {
  // 🗝️ 세션/기기 상태
  const [sessions, setSessions] = useState<Session[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 세션/기기 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [sess, devs] = await Promise.all([
          sessionService.getSessions(),
          sessionService.getDevices()
        ])
        setSessions(sess)
        setDevices(devs)
      } catch (err: any) {
        setError('세션/기기 정보를 불러오지 못했어요.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 세션 종료
  const handleEndSession = async (id: string) => {
    await sessionService.endSession(id)
    setSessions(sessions => sessions.map(s => s.id === id ? { ...s, isActive: false } : s))
  }

  // 기기 접속 제한
  const handleDisconnect = async (id: string) => {
    await sessionService.disconnectDevice(id)
    setDevices(devices => devices.map(d => d.id === id ? { ...d, isActive: false } : d))
  }

  if (loading) return <div>⏳ 세션/기기 정보를 불러오는 중이에요...</div>
  if (error) return <div>🚨 {error}</div>

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-4">세션 관리</h2>
      <SessionList sessions={sessions} onEndSession={handleEndSession} />
      <h2 className="text-2xl font-bold mb-4">기기 관리</h2>
      <DeviceList devices={devices} onDisconnect={handleDisconnect} />
    </div>
  )
}

export default SessionManagementPage
