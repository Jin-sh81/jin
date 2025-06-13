// 🧪 profileService가 프로필을 잘 가져오고, 수정하는지 테스트해요!
import { profileService } from '../profileService'

test('프로필을 가져오고, 수정할 수 있어요', async () => {
  const profile = await profileService.getProfile()
  expect(profile.displayName).toBeDefined()

  const updated = await profileService.updateProfile({
    displayName: '김철수',
    email: 'kim@sample.com',
    phoneNumber: '010-0000-0000',
    address: '부산시 해운대구'
  })
  expect(updated.displayName).toBe('김철수')
})
