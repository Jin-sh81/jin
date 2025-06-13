// 🔑 useAuth 훅: 로그인 상태를 자동으로 알려주는 마법 같은 함수예요!
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { AuthState } from '../types'

export const useAuth = () => {
  // 🌱 authState 상태: 사용자 정보(user), 로딩 중(loading), 에러(error)를 담아요
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // ⚡️ 앱이 켜지면 한 번만 실행: Firebase에 로그인 상태 변경이 있는지 기다려요
  useEffect(() => {
    // 🏷️ auth 인스턴스: Firebase 인증 서버와 연결해요
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      // 😊 로그인 상태가 바뀌면 호출: 사용자 정보를 authState에 넣어요
      (user: User | null) => {
        // 👤 user 정보 세팅: uid, 이메일, 이름, 프로필 사진 등을 저장해요
        setAuthState({
          user: user ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          } : null,
          loading: false,
          error: null,
        })
      },
      // 🚨 인증 중 오류 발생 시 호출: 에러 메시지를 authState에 저장해요
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        })
      }
    )

    // 🔌 구독 해제: 컴포넌트가 사라질 때 더 이상 상태 변화를 듣지 않아요
    return () => unsubscribe()
  }, [])

  // 🎯 authState 반환: 사용자 상태를 어디서든 사용할 수 있어요
  return authState
} 