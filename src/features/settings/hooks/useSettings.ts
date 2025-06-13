// 🪝 useSettings: 설정을 쉽게 불러오고, 바꿀 수 있는 훅이에요!
import { useState, useEffect } from 'react'
import { Settings } from '../types'
import { settingsService } from '../services/settingsService'

export const useSettings = () => {
  // ⚙️ 설정 상태
  const [settings, setSettings] = useState<Settings | null>(null)
  // ⏳ 로딩 상태
  const [loading, setLoading] = useState(false)
  // 🚨 에러 상태
  const [error, setError] = useState<string | null>(null)

  // 👀 설정 불러오기
  const fetchSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await settingsService.getSettings()
      setSettings(data)
    } catch (err: any) {
      setError('설정을 불러오지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  // ✏️ 설정 저장하기
  const updateSettings = async (newSettings: Settings) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await settingsService.updateSettings(newSettings)
      setSettings(updated)
    } catch (err: any) {
      setError('설정을 저장하지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return { settings, loading, error, fetchSettings, updateSettings }
}
