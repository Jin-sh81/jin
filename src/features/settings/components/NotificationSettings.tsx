// 🔔 NotificationSettings: 알림 설정을 켜고 끌 수 있어요!
import React from 'react'

interface NotificationSettingsProps {
  value: boolean
  onChange: (value: boolean) => void
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ value, onChange }) => (
  <div>
    <label>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />
      알림 받기
    </label>
  </div>
)

export default NotificationSettings
