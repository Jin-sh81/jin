// ⚙️ Settings 타입: 사용자 설정 정보를 담는 상자예요!
export interface Settings {
  // 🔔 알림 설정
  notifications: boolean
  // 🔒 개인정보 공개 여부
  isProfilePublic: boolean
  // 🌐 언어 설정
  language: 'ko' | 'en'
  // 🌗 테마 설정
  theme: 'light' | 'dark'
}
