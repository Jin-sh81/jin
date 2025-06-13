// ⚙️ SettingsPage: 내 앱 설정을 한 번에 바꿀 수 있는 페이지예요!
import React from 'react'
import { useSettings } from '../hooks/useSettings'
import {
  NotificationSettings,
  PrivacySettings,
  LanguageSettings,
  ThemeSettings
} from '../components'

const SettingsPage: React.FC = () => {
  const { settings, loading, error, updateSettings } = useSettings()

  if (loading && !settings) return <div>⏳ 설정을 불러오는 중이에요...</div>
  if (error) return <div>🚨 {error}</div>
  if (!settings) return null

  // 각 설정이 바뀔 때마다 updateSettings로 저장!
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">내 설정</h2>
      <NotificationSettings
        value={settings.notifications}
        onChange={v => updateSettings({ ...settings, notifications: v })}
      />
      <PrivacySettings
        value={settings.isProfilePublic}
        onChange={v => updateSettings({ ...settings, isProfilePublic: v })}
      />
      <LanguageSettings
        value={settings.language}
        onChange={v => updateSettings({ ...settings, language: v })}
      />
      <ThemeSettings
        value={settings.theme}
        onChange={v => updateSettings({ ...settings, theme: v })}
      />
    </div>
  )
}

export default SettingsPage
