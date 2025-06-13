// 🛠️ settingsService: 설정을 저장하고 불러오는 함수들이에요!
import { Settings } from '../types'

let mockSettings: Settings = {
  notifications: true,
  isProfilePublic: true,
  language: 'ko',
  theme: 'light'
}

export const settingsService = {
  // 👀 설정 불러오기
  getSettings: async (): Promise<Settings> => {
    // 실제로는 API/로컬스토리지에서 불러와요!
    return mockSettings
  },
  // ✏️ 설정 저장하기
  updateSettings: async (settings: Settings): Promise<Settings> => {
    // 실제로는 API/로컬스토리지에 저장해요!
    mockSettings = { ...settings }
    return mockSettings
  }
}
