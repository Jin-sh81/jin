// 🎣 useAuth 훅: JIN 앱에서 사용자의 로그인 상태를 쉽게 확인할 수 있어요!
// 📝 검증 명령서:
// 1. 사용자가 로그인했는지 확인해요
// 2. 로그인 중인지 확인해요
// 3. 오류가 발생했는지 확인해요
// 4. 사용자 정보(이메일, 이름, 사진)를 가져와요
import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { AuthState } from '../types'

// 🎯 useAuth 훅: 사용자의 로그인 상태를 관리하는 함수예요
export const useAuth = () => {
  // 📦 authState 상태: 사용자 정보, 로딩 상태, 오류를 저장해요
  const [authState, setAuthState] = useState<AuthState>({
    user: null,      // 👤 사용자 정보
    loading: true,   // 🔄 로딩 중인지
    error: null,     // ⚠️ 오류 메시지
  })

  // 👀 사용자 상태 감시: 로그인 상태가 바뀔 때마다 실행돼요
  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      // ✅ 로그인 성공 시: 사용자 정보를 저장해요
      (user: User | null) => {
        setAuthState({
          user: user ? {
            uid: user.uid,           // 🔑 사용자 고유 번호
            email: user.email,       // 📧 사용자 이메일
            displayName: user.displayName,  // 👤 사용자 이름
            photoURL: user.photoURL,       // 🖼️ 사용자 사진
          } : null,
          loading: false,
          error: null,
        })
      },
      // ❌ 로그인 실패 시: 오류 메시지를 저장해요
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        })
      }
    )

    // 🧹 정리 함수: 컴포넌트가 사라질 때 실행돼요
    return () => unsubscribe()
  }, [])

  return authState
} 