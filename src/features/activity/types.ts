// 📝 ActivityLog: 로그인 기록
export interface ActivityLog {
  // 🕒 로그인 시간
  timestamp: string
  // 🌐 접속 IP
  ip: string
  // 💻 기기 정보(브라우저/OS)
  device: string
  // 📍 위치 정보(도시, 국가 등)
  location: string
}

// 📝 AllLog: 모든 활동 로그(주요 활동, 변경, 접근, 에러)
export interface AllLog {
  // 🕒 활동 시간
  timestamp: string
  // 🏷️ 활동 종류(예: 로그인, 정보수정, 접근, 에러 등)
  type: 'login' | 'update' | 'access' | 'error'
  // 📝 활동 내용(무엇을 했는지)
  message: string
  // 🌐 IP
  ip?: string
  // 💻 기기 정보
  device?: string
  // 📍 위치 정보
  location?: string
}
