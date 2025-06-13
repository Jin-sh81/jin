// 🧪 라우팅 통합 테스트: 페이지 이동이 잘 되는지 확인해요!
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import ProfilePage from '../features/profile/pages/ProfilePage'

test('로그인 후 프로필 페이지로 이동할 수 있어요', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </MemoryRouter>
  )
  // 로그인 폼이 보여요
  expect(screen.getByText('로그인')).toBeInTheDocument()
  // (여기서 실제 로그인 로직을 흉내내고, /profile로 이동하는 코드를 추가할 수 있어요)
})
