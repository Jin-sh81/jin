// 🧪 useProfile 훅이 프로필을 잘 불러오고, 수정할 수 있는지 테스트해요!
import { renderHook, act } from '@testing-library/react'
import { useProfile } from '../useProfile'

test('프로필을 불러오고, 수정할 수 있어요', async () => {
  const { result } = renderHook(() => useProfile())

  // 처음엔 로딩 중이에요!
  expect(result.current.loading).toBe(true)

  // 프로필이 불러와질 때까지 기다려요
  await act(async () => {
    await new Promise(res => setTimeout(res, 10))
  })

  // 프로필이 잘 불러와졌는지 확인해요
  expect(result.current.profile).not.toBeNull()

  // 프로필을 수정해요
  await act(async () => {
    await result.current.updateProfile({
      displayName: '김철수',
      email: 'kim@sample.com',
      phoneNumber: '010-0000-0000',
      address: '부산시 해운대구'
    })
  })

  // 수정된 프로필이 반영됐는지 확인해요
  expect(result.current.profile?.displayName).toBe('김철수')
})
