// 🛠️ sessionService: 세션/기기 관리 함수들이에요!
import { Session, Device } from '../types'

// 예시 데이터(실제로는 서버에서 받아와야 해요!)
let mockSessions: Session[] = [
  {
    id: 'sess-1',
    loginAt: '2024-06-01 10:23:45',
    device: 'Chrome (Windows 10)',
    ip: '123.123.123.123',
    location: 'Seoul, South Korea',
    isActive: true
  },
  {
    id: 'sess-2',
    loginAt: '2024-05-30 21:11:02',
    device: 'Safari (iPhone)',
    ip: '111.222.111.222',
    location: 'Busan, South Korea',
    isActive: false
  }
]

let mockDevices: Device[] = [
  {
    id: 'dev-1',
    name: 'Chrome (Windows 10)',
    lastActiveAt: '2024-06-01 10:23:45',
    isActive: true
  },
  {
    id: 'dev-2',
    name: 'Safari (iPhone)',
    lastActiveAt: '2024-05-30 21:11:02',
    isActive: false
  }
]

export const sessionService = {
  // 👀 활성 세션 목록 불러오기
  getSessions: async (): Promise<Session[]> => {
    // 실제로는 API 호출!
    return mockSessions
  },
  // 🗑️ 세션 종료
  endSession: async (sessionId: string) => {
    // 실제로는 서버에 종료 요청!
    mockSessions = mockSessions.map(s =>
      s.id === sessionId ? { ...s, isActive: false } : s
    )
    alert('세션이 종료되었습니다.')
  },
  // 📱 기기 목록 불러오기
  getDevices: async (): Promise<Device[]> => {
    // 실제로는 API 호출!
    return mockDevices
  },
  // 🗑️ 기기 접속 제한(로그아웃)
  disconnectDevice: async (deviceId: string) => {
    // 실제로는 서버에 요청!
    mockDevices = mockDevices.map(d =>
      d.id === deviceId ? { ...d, isActive: false } : d
    )
    alert('기기 접속이 제한되었습니다.')
  }
}
