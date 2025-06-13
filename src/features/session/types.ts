// 🗝️ Session 타입: 활성 세션 정보를 담는 상자예요!
export interface Session {
  // 🆔 세션 ID
  id: string
  // 🕒 로그인 시간
  loginAt: string
  // 💻 기기 정보
  device: string
  // 🌐 IP
  ip: string
  // 📍 위치 정보
  location: string
  // 🟢 현재 활성화 여부
  isActive: boolean
}

// 📱 Device 타입: 사용자가 로그인한 기기 정보를 담아요!
export interface Device {
  // 🆔 기기 ID
  id: string
  // 💻 기기 이름/브라우저
  name: string
  // 🕒 마지막 접속 시간
  lastActiveAt: string
  // 🟢 현재 접속 중인지
  isActive: boolean
}
