// 🔐 인증 관리자: JIN 앱의 로그인과 회원가입을 관리해요!
// 📝 검증 명령서:
// 1. 사용자가 로그인했는지 확인해요
// 2. 로그인 상태가 바뀔 때마다 알려줘요
// 3. 로그인, 회원가입, 로그아웃 기능을 제공해요
// 4. 오류가 발생하면 콘솔에 기록해요
import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth'

// 🎯 인증 컨텍스트 타입: 사용자 정보와 인증 함수들을 정의해요
interface AuthContextType {
  user: User | null;        // 👤 현재 로그인한 사용자 정보
  loading: boolean;         // 🔄 로딩 상태
  signIn: (email: string, password: string) => Promise<void>;    // 🔑 로그인 함수
  signUp: (email: string, password: string) => Promise<void>;    // ✏️ 회원가입 함수
  signOut: () => Promise<void>;                                  // 🚪 로그아웃 함수
}

// 🏭 인증 컨텍스트 생성: 다른 컴포넌트에서 사용할 수 있게 만들어요
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🎣 useAuth 훅: 인증 컨텍스트를 쉽게 사용할 수 있게 해줘요
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 🎪 AuthProvider 컴포넌트: 인증 기능을 제공하는 컴포넌트예요
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 👤 user 상태: 현재 로그인한 사용자 정보를 저장해요
  const [user, setUser] = useState<User | null>(null)
  // 🔄 loading 상태: 로딩 중인지 알려줘요
  const [loading, setLoading] = useState(true)
  const auth = getAuth()

  // 👀 사용자 상태 감시: 로그인 상태가 바뀔 때마다 실행돼요
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [auth])

  // 🔑 로그인 함수: 이메일과 비밀번호로 로그인해요
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('로그인 중 오류 발생:', error)
      throw error
    }
  }

  // ✏️ 회원가입 함수: 새로운 계정을 만들어요
  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error)
      throw error
    }
  }

  // 🚪 로그아웃 함수: 현재 로그인한 계정에서 나가요
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      throw error
    }
  }

  // 📦 제공할 값들을 모아서 전달해요
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 