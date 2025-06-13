// 🌗 ThemeProvider: 다크/라이트 테마를 관리하고 시스템 설정과 연동해요!
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 🌗 theme: 현재 테마 상태(라이트/다크)
  const [theme, setTheme] = useState<Theme>(() => {
    // 시스템 테마를 기본값으로 사용해요!
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  // 🖥️ 시스템 테마 변경 감지
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  // 🎨 테마가 바뀔 때 body에 클래스 추가
  useEffect(() => {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
  }, [theme])

  // 🌗 테마 전환 함수
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 🎨 useTheme: 테마 상태를 쉽게 꺼내쓰는 훅이에요!
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('ThemeProvider로 감싸야 해요!')
  return ctx
}
