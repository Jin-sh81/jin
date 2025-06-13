// 🧪 상태 관리 통합 테스트: 여러 컴포넌트/훅이 상태를 잘 공유하는지 확인해요!
import { render, screen, fireEvent } from '@testing-library/react'
import ProfilePage from '../features/profile/pages/ProfilePage'

test('프로필 수정 시 상태가 잘 반영돼요', async () => {
  render(<ProfilePage />)
  // 이름 입력창을 찾아서 값을 바꿔요
  const nameInput = await screen.findByLabelText(/이름/)
  fireEvent.change(nameInput, { target: { value: '김테스트' } })
  // 저장 버튼 클릭
  fireEvent.click(screen.getByText('저장하기'))
  // 상태가 바뀌어서 입력값이 반영돼요
  expect(nameInput).toHaveValue('김테스트')
})
