// 🛡️ AuthProvider: 사용자 인증 정보를 앱 전체에 알려주는 상자예요!
import React, { createContext, useContext } from 'react'
import { useAuth } from '../hooks'
import { AuthState } from '../types'

// 📦 AuthContext: 인증 상태를 담는 상자(컨테이너)를 만들어요
const AuthContext = createContext<AuthState | undefined>(undefined)

// 🎁 AuthProvider: 상자(AuthContext)에 인증 상태를 넣고, 아래 자식들에게 나눠줘요
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 🔍 useAuth 훅으로 로그인 상태, 사용자 정보 등을 가져와요
  const authState = useAuth()

  return (
    // 💌 value={authState}: 가져온 인증 상태를 상자에 저장해요
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

// 💤 useAuthContext: 상자에서 인증 상태를 꺼내 쓰기 위한 도구예요
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  // ⚠️ AuthProvider 밖에서 이 훅을 쓰면 안 돼요! 오류를 알려줘요
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
} 