// 🌗 ThemeSettings: 라이트/다크 테마를 고를 수 있어요!
import React from 'react'

interface ThemeSettingsProps {
  value: 'light' | 'dark'
  onChange: (value: 'light' | 'dark') => void
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ value, onChange }) => (
  <div>
    <label>
      테마 선택:
      <select value={value} onChange={e => onChange(e.target.value as 'light' | 'dark')}>
        <option value="light">라이트</option>
        <option value="dark">다크</option>
      </select>
    </label>
  </div>
)

export default ThemeSettings
