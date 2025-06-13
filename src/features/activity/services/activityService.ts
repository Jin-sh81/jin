// 🛠️ activityService: 로그인 기록을 불러오는 함수예요!
import { ActivityLog, AllLog } from '../types'

// 예시 데이터(실제로는 서버에서 받아와야 해요!)
const mockLogs: ActivityLog[] = [
  {
    timestamp: '2024-06-01 10:23:45',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)',
    location: 'Seoul, South Korea'
  },
  {
    timestamp: '2024-05-30 21:11:02',
    ip: '111.222.111.222',
    device: 'Safari (iPhone)',
    location: 'Busan, South Korea'
  }
]

const mockAllLogs: AllLog[] = [
  {
    timestamp: '2024-06-01 10:23:45',
    type: 'login',
    message: '로그인 성공',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)',
    location: 'Seoul, South Korea'
  },
  {
    timestamp: '2024-06-01 10:25:00',
    type: 'update',
    message: '이메일 주소를 변경함',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)',
    location: 'Seoul, South Korea'
  },
  {
    timestamp: '2024-06-01 10:30:00',
    type: 'access',
    message: '설정 페이지에 접근함',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)',
    location: 'Seoul, South Korea'
  },
  {
    timestamp: '2024-06-01 10:35:00',
    type: 'error',
    message: '비밀번호 변경 중 에러 발생',
    ip: '123.123.123.123',
    device: 'Chrome (Windows 10)',
    location: 'Seoul, South Korea'
  }
]

export const activityService = {
  // 👀 로그인 기록 불러오기
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    // 실제로는 API 호출!
    return mockLogs
  },
  // 👀 모든 활동 로그 불러오기
  getAllLogs: async (): Promise<AllLog[]> => {
    // 실제로는 API 호출!
    return mockAllLogs
  }
}
