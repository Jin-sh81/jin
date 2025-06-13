// 🔒 PrivacySettings: 내 프로필을 공개할지 정할 수 있어요!
import React from 'react'

interface PrivacySettingsProps {
  value: boolean
  onChange: (value: boolean) => void
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ value, onChange }) => (
  <div>
    <label>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />
      내 프로필을 다른 사람에게 공개하기
    </label>
  </div>
)

export default PrivacySettings
