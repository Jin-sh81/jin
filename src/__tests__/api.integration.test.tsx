// 🧪 API 연동 통합 테스트: 실제 API와 컴포넌트가 잘 연결되는지 확인해요!
import { render, screen, waitFor } from '@testing-library/react'
import ProfilePage from '../features/profile/pages/ProfilePage'
import * as profileService from '../features/profile/services/profileService'

// profileService를 mock 처리해서 API 호출을 흉내내요!
jest.spyOn(profileService, 'profileService').mockImplementation(() => ({
  getProfile: async () => ({
    displayName: '테스트',
    email: 'test@sample.com',
    phoneNumber: '010-0000-0000',
    address: '서울시'
  }),
  updateProfile: async (profile) => profile
}))

test('프로필 페이지가 API에서 데이터를 잘 받아와서 보여줘요', async () => {
  render(<ProfilePage />)
  // API에서 받아온 이름이 화면에 보여요!
  await waitFor(() => {
    expect(screen.getByDisplayValue('테스트')).toBeInTheDocument()
  })
})
