// 📝 storageService: 로컬 스토리지에 데이터를 저장하고 가져오는 서비스예요!

// 🔑 스토리지 키 상수
const REMEMBER_ME_KEY = 'rememberMe'
const AUTH_TOKEN_KEY = 'authToken'
const USER_DATA_KEY = 'userData'

// 📦 StorageService: 로컬 스토리지 관련 함수들을 모아놓은 서비스예요
export const StorageService = {
  // 💾 Remember Me 설정 저장
  setRememberMe: (value: boolean): void => {
    localStorage.setItem(REMEMBER_ME_KEY, String(value))
  },

  // 📖 Remember Me 설정 가져오기
  getRememberMe: (): boolean => {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  },

  // 💾 인증 토큰 저장
  setAuthToken: (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },

  // 📖 인증 토큰 가져오기
  getAuthToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  // 💾 사용자 데이터 저장
  setUserData: (userData: any): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  },

  // 📖 사용자 데이터 가져오기
  getUserData: (): any | null => {
    const data = localStorage.getItem(USER_DATA_KEY)
    return data ? JSON.parse(data) : null
  },

  // 🗑️ 모든 인증 관련 데이터 삭제
  clearAuthData: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  }
}
