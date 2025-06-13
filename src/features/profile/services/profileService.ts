// 🛠️ profileService: 프로필 정보를 가져오고, 수정하는 함수들이에요!
import { Profile } from '../types'
import defaultProfile from 'assets/default-profile.png'

// 예시: 실제로는 서버/파이어베이스와 연동해야 해요!
let mockProfile: Profile = {
  displayName: '홍길동',
  email: 'hong@sample.com',
  phoneNumber: '010-1234-5678',
  address: '서울시 강남구',
  photoURL: defaultProfile // 🖼️ 기본 이미지
}

export const profileService = {
  // 👀 프로필 정보 가져오기
  getProfile: async (): Promise<Profile> => {
    // 실제로는 API 호출!
    return mockProfile
  },
  // ✏️ 프로필 정보 수정하기
  updateProfile: async (profile: Profile): Promise<Profile> => {
    // 실제로는 API 호출!
    mockProfile = { ...profile }
    return mockProfile
  }
}
