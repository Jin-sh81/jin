// 🌗 ThemeToggleButton: 클릭하면 다크/라이트 테마가 바뀌는 버튼이에요!
import React from 'react'
import { useTheme } from './ThemeProvider'

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded shadow"
      aria-label="테마 전환"
    >
      {theme === 'light' ? '🌙 다크 모드' : '☀️ 라이트 모드'}
    </button>
  )
}

export default ThemeToggleButton
