// 🛡️ SecurityAlert: 보안 알림 정보를 담는 상자예요!
export interface SecurityAlert {
  // 🕒 알림 시간
  timestamp: string
  // 🏷️ 알림 종류(로그인, 비번변경, 의심, 설정변경)
  type: 'login' | 'password' | 'suspicious' | 'settings'
  // 📝 알림 내용
  message: string
  // 🌐 IP (선택)
  ip?: string
  // 💻 기기 정보 (선택)
  device?: string
}
