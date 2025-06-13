// 🛠️ securityAlertService: 보안 알림을 불러오고, 새 알림을 추가하는 함수예요!
import { SecurityAlert } from '../types'

// 예시 데이터(실제로는 서버에서 받아와야 해요!)
let mockAlerts: SecurityAlert[] = [
  {
    timestamp: '2024-06-01 10:23:45',
    type: 'login',
    message: '새 기기에서 로그인했습니다.',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)'
  },
  {
    timestamp: '2024-06-01 10:30:00',
    type: 'password',
    message: '비밀번호가 변경되었습니다.',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)'
  },
  {
    timestamp: '2024-06-01 10:35:00',
    type: 'suspicious',
    message: '의심스러운 활동이 감지되었습니다.',
    ip: '111.222.111.222',
    device: 'Safari (iPhone)'
  },
  {
    timestamp: '2024-06-01 10:40:00',
    type: 'settings',
    message: '계정 설정이 변경되었습니다.',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)'
  }
]

export const securityAlertService = {
  // 👀 보안 알림 불러오기
  getAlerts: async (): Promise<SecurityAlert[]> => {
    // 실제로는 API 호출!
    return mockAlerts
  },
  // ➕ 새 보안 알림 추가하기(테스트용)
  addAlert: async (alert: SecurityAlert) => {
    mockAlerts = [alert, ...mockAlerts]
  }
}
