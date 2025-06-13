// 🔑 useAuth 훅: 로그인 상태를 자동으로 알려주는 마법 같은 함수예요!
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { AuthState, LoginCredentials } from '../types'
import { AuthService } from '../services/authService'
import { StorageService } from '../services/storageService'
import { useRememberMe } from './useRememberMe'

export const useAuth = () => {
  // 🌱 authState 상태: 사용자 정보(user), 로딩 중(loading), 에러(error)를 담아요
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isGoogleLoading: false,
    rememberMe: StorageService.getRememberMe()
  })

  // 💾 Remember Me 훅 사용
  const { rememberMe, setRememberMe } = useRememberMe()

  // ⚡️ 앱이 켜지면 한 번만 실행: Firebase에 로그인 상태 변경이 있는지 기다려요
  useEffect(() => {
    // 🏷️ auth 인스턴스: Firebase 인증 서버와 연결해요
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      // 😊 로그인 상태가 바뀌면 호출: 사용자 정보를 authState에 넣어요
      async (user: User | null) => {
        if (user) {
          // 🔑 토큰 가져오기
          const token = await user.getIdToken()
          
          // 💾 Remember Me가 켜져있으면 토큰 저장
          if (rememberMe) {
            StorageService.setAuthToken(token)
            StorageService.setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          }
        } else {
          // 🔒 로그아웃 시 토큰 삭제
          StorageService.clearAuthData()
        }

        setAuthState(prev => ({
          ...prev,
          user: user ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          } : null,
          loading: false,
          error: null,
          isGoogleLoading: false
        }))
      },
      // 🚨 인증 중 오류 발생 시 호출: 에러 메시지를 authState에 저장해요
      (error) => {
        setAuthState(prev => ({
          ...prev,
          user: null,
          loading: false,
          error: error.message,
          isGoogleLoading: false
        }))
      }
    )

    // 🔌 구독 해제: 컴포넌트가 사라질 때 더 이상 상태 변화를 듣지 않아요
    return () => unsubscribe()
  }, [rememberMe])

  // 🔑 이메일/비밀번호로 로그인
  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const user = await AuthService.loginWithEmail(credentials)
      setRememberMe(credentials.rememberMe)
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }))
    }
  }

  // 🚪 로그아웃
  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }))
    }
  }

  // 🌐 Google 로그인 함수: 구글 계정으로 로그인할 때 사용해요
  const signInWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, isGoogleLoading: true }))
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // 💾 Remember Me가 켜져있으면 토큰 저장
      if (rememberMe) {
        const token = await result.user.getIdToken()
        StorageService.setAuthToken(token)
        StorageService.setUserData({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        })
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        isGoogleLoading: false
      }))
    }
  }

  return {
    ...authState,
    login,
    logout,
    signInWithGoogle,
    setRememberMe
  }
} 