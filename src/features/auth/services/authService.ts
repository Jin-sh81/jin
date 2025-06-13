// 🔐 authService: Firebase 인증 관련 API를 처리하는 서비스예요!
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signOut,
  User,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth'
import { LoginCredentials } from '../types'
import { StorageService } from './storageService'

// 🔄 AuthService: 인증 관련 API 함수들을 모아놓은 서비스예요
export const AuthService = {
  // 🔑 이메일/비밀번호로 로그인
  loginWithEmail: async (credentials: LoginCredentials): Promise<User> => {
    const auth = getAuth()
    const { user } = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )

    // 💾 Remember Me가 켜져있으면 토큰 저장
    if (credentials.rememberMe) {
      const token = await user.getIdToken()
      StorageService.setAuthToken(token)
      StorageService.setUserData({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      })
    }

    return user
  },

  // 🚪 로그아웃
  logout: async (): Promise<void> => {
    const auth = getAuth()
    await signOut(auth)
    StorageService.clearAuthData()
  },

  // 🔄 토큰 갱신
  refreshToken: async (): Promise<string | null> => {
    const auth = getAuth()
    const user = auth.currentUser
    
    if (user) {
      const token = await user.getIdToken(true)
      StorageService.setAuthToken(token)
      return token
    }
    
    return null
  },

  // 🔄 비밀번호 재설정 이메일 보내기
  sendPasswordResetEmail: async (email: string) => {
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
  },

  // 🔑 비밀번호 재설정(이메일 링크 클릭 후)
  confirmPasswordReset: async (oobCode: string, newPassword: string) => {
    const auth = getAuth()
    await confirmPasswordReset(auth, oobCode, newPassword)
  }
}
