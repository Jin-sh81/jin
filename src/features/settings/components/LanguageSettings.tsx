// 🌐 LanguageSettings: 앱에서 사용할 언어를 고를 수 있어요!
import React from 'react'

interface LanguageSettingsProps {
  value: 'ko' | 'en'
  onChange: (value: 'ko' | 'en') => void
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ value, onChange }) => (
  <div>
    <label>
      언어 선택:
      <select value={value} onChange={e => onChange(e.target.value as 'ko' | 'en')}>
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
    </label>
  </div>
)

export default LanguageSettings
